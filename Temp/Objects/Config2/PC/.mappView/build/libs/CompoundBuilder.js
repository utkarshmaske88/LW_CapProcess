(function () {
    'use strict';

    const modulePath = require('path'),
        grunt = require('grunt'),
        sass = require('node-sass'),
        moduleXml2js = require('xml2js'),
        xmlBuilder = new moduleXml2js.Builder({ headless: true, renderOpts: { 'pretty': true, 'indent': '  ', 'newline': '\n' } }),
        xmlConvert = {
            xml2js: moduleXml2js.parseString,
            js2xml: xmlBuilder.buildObject.bind(xmlBuilder)
        },
        Utils = require('../iat/utils'),
        DataTypes = require('../iat/DataTypes'),
        Properties = require('../iat/Properties'),
        xsdPrepare = require('../iat/xsdPrepare'),
        jsPrepare = require('../iat/jsPrepare'),
        styleParser = require('../iat/styleParser'),
        json2xml = require('../iat/json2xml'),
        cowiJsPrepare = require('../libs/cowi_jsPrepare'),
        patchCoWi = require('../libs/cowi_patchObj'),
        patchXML = require('../libs/cowi_patchXML'),
        patchHTML = require('../libs/cowi_patchHTML'),
        patchCoWiContent = require('../libs/cowi_patchContent'),
        childWidgets = require('../libs/childWidgets'),
        widgetsDataCache = require('../libs/widgetsDataCache'),
        defaultStyleTransformation = require('../iat/DefaultStyleTransformation'),
        contentHtmlTransformation = require('../libs/ContentHtmlTransformation'),
        scssTransformation = require('../libs/ScssTransformation'),
        debug = false;

    /**
    * 
    * @module libs/CompoundBuilder
    */
    let builder = {
        
        /**
         * Build multiple compound widgets with build config generated from build.json.
         * @param {Object} buildCfg 
         * @returns {Array} source file paths of files with build errors
         */
        create(buildCfg) {
            let common = loadCommonFiles(grunt.config('basePath'), buildCfg.corePath);
            let errors = [];

            for (let lib of buildCfg.libs) {
                for (let srcFile of lib.compound) {
                    try {
                        createCompound(lib, srcFile, buildCfg, common);
                    } catch (err) {
                        grunt.log.writeln(err.message);
                        errors.push({
                            lib: lib.name,
                            srcFile: srcFile,
                            message: err.message
                        });
                    }
                }
            }
            return errors;
        }
    };

    function loadCommonFiles(basePath, corePath) {       
        let ancestorObject = createAncestorObject(corePath);
        return {
            // ancestor (system.widgets.CompoundWidget) widget info (path, name, etc)
            ancestorObject: ancestorObject,
            // json of ancestor widget (=complete widget info, generated by widget compiler)
            ancestorWidget: grunt.file.readJSON(modulePath.resolve(ancestorObject.metaDir, ancestorObject.name + '.json')),
            //styles of the ancestor widget as an JS object extracted from .widget file {styleProperties.StyleProperty:[],propertyGroups}                
            superStyleObj: styleParser.parseFile(ancestorObject.dir + '/meta/' + ancestorObject.name + '.widget', grunt),
            templateHTML: grunt.file.read(modulePath.resolve(ancestorObject.dir, ancestorObject.name + '.html')),
            templateJS: grunt.file.read(modulePath.resolve(basePath, 'templates/CompoundTemplate.js')),
            templateStyle: grunt.file.read(modulePath.resolve(basePath, 'templates/CompoundTemplate.style'))
        };
    }

    function createCompound(lib, srcFile, buildCfg, common) {
        if (debug) {
            grunt.log.writeln('srcFile:' + srcFile);
            grunt.log.writeln('libraryName:' + lib.name);
        }
        if (!lib.name) {
            throw new Error('missing library name');
        }
        // read source file
        var coWiXML = grunt.file.read(srcFile),
            returnValue;

        xmlConvert.xml2js(coWiXML, {
            trim: true
        // eslint-disable-next-line no-unused-vars
        }, function (errArg, xmlObj) {

            if (debug) {
                writeFile(modulePath.resolve('/Temp/mvLog/compoundWidgetXML.json'), JSON.stringify(xmlObj));
            }
            if (!xmlObj) {
                grunt.log.writeln('error in xml2js');
                throw Error('error in xml2js');
            }
            
            // xml of compoundWidget as js object
            var compoundXML = xmlObj['CompoundWidget'], 
                // compoundWidget infos (path, name, type, properties, etc)
                widgetObject = patchXML.createWidgetObject(compoundXML, buildCfg.targetFolder, lib.name), 
                // widget types used in compoundWidget-content (including path, name, etc)
                arWidgetTypes = Utils.uniqueArray(childWidgets.findUsedWidgetTypes(compoundXML.Widgets[0].Widget)).sort(),
                childWidgetsList = childWidgets.find(grunt, modulePath, arWidgetTypes, buildCfg.breaseWidgets, buildCfg.customWidgets, buildCfg.derivedWidgets); 
            
            // here we start writing files so we have to be careful to cleanup if there is an error
            try {
                // child widgets info
                // json of all child widgets (=complete widget info, generated by widget compiler)
                let childInfos = widgetsDataCache.getMetaData(childWidgetsList);

                if (debug) {
                    writeFile(modulePath.resolve('/Temp/mvLog/compoundWidget.json'), JSON.stringify(widgetObject));
                    writeFile(modulePath.resolve('/Temp/mvLog/ancestorObject.json'), JSON.stringify(common.ancestorObject));
                    writeFile(modulePath.resolve('/Temp/mvLog/childWidgets.json'), JSON.stringify(childWidgetsList));
                    writeFile(modulePath.resolve('/Temp/mvLog/childInfos.json'), JSON.stringify(childInfos));
                }
                if (!childWidgets.validation.run(childInfos)) {
                    throw new Error(childWidgets.validation.errorMessage);
                }
                
                // json of compoundWidget as result of ancestorWidget patched with additional info and not as result of a widget compiler
                var widgetInfo = patchCoWi.run(common.ancestorWidget, widgetObject, childInfos, grunt, debug, buildCfg.targetFolder);
                
                writeFile(widgetObject.metaClassPath + '.json', JSON.stringify(widgetInfo));

                // cowi html file
                var widgetHTML = createWidgetHTML(common.templateHTML, common.ancestorObject, widgetObject);
                writeFile(modulePath.resolve(widgetObject.dir, widgetObject.name + '.html'), widgetHTML);

                // cowi js file
                var widgetJS = cowiJsPrepare.createWidgetJS(common.templateJS, widgetObject, childWidgetsList);
                writeFile(modulePath.resolve(widgetObject.dir, widgetObject.name + '.js'), widgetJS);

                // cowi style file
                var widgetStyle = createWidgetStyle(common.templateStyle, widgetObject, widgetObject.commonProps);
                writeFile(widgetObject.metaClassPath + '.style', widgetStyle);

                // meta infos for use in JS
                var classInfo = jsPrepare.run(widgetInfo, widgetObject.qualifiedName, common.ancestorObject.type, false, { isCompound: true });
                writeFile(modulePath.resolve(widgetObject.dir, 'designer/ClassInfo.js'), classInfo);
                
                // remove non-public properties and related events
                // we have to do this after creation of ClassInfo and Widget.js, because we need them in the widget but not in the interface to AS
                removeNonPublic(widgetInfo, ['events', 'properties']);

                // cowi xsd file
                var widgetXsd = xsdPrepare.run(widgetInfo, {
                    prettify: true
                }, DataTypes, Properties);
                writeFile(widgetObject.metaClassPath + '.xsd', widgetXsd);

                // this method creates the xml of stylable properties for the .widget file
                // and sets default values in superStyle if they exist in compoundWidget
                var stylablePropsXML = createStyleXML(common.superStyleObj, widgetObject);

                // cowi xml (.widget file)
                if (debug) {
                    writeFile(modulePath.resolve('/Temp/mvLog/widgetInfo_used_for_widgetFile.json'), JSON.stringify(widgetInfo));
                }
                var widgetXMLFile = widgetObject.metaClassPath + '.widget',
                    widgetXML = createWidgetFile(widgetInfo, json2xml, stylablePropsXML, common.superStyleObj.propertyGroups);
                writeFile(widgetXMLFile, widgetXML);

                // remove non-public methods of LocalProperty
                // we have to do this after creation of .widget file, because we need them in the widget-file for creation of WidgetLibrary.mapping, 
                // but not in the EventsActions.xsd
                removeNonPublic(widgetInfo, ['methods']);

                // cowi styles xsd file
                var stylesXsd = xsdPrepare.runWidgetStyleDefinition(widgetInfo, {
                    prettify: true
                });
                if (stylesXsd !== undefined && stylesXsd !== '') {
                    writeFile(widgetObject.metaClassPath + '_Styles.xsd', stylesXsd);
                } else {
                    deleteFile(widgetObject.metaClassPath + '_Styles.xsd');
                }

                // cowi events/actions xsd file
                var eventActionXsd = xsdPrepare.runEventActionDefinition(widgetInfo, {
                    prettify: true
                }, DataTypes);
                if (eventActionXsd !== undefined && eventActionXsd !== '') {
                    writeFile(widgetObject.metaClassPath + '_EventsActions.xsd', eventActionXsd);
                } else {
                    deleteFile(widgetObject.metaClassPath + '_EventsActions.xsd');
                }

                // patch widgets in content of cowi (LocalMedia path and default values of width/height)
                patchCoWiContent.run(compoundXML.Widgets, widgetObject.library, childInfos);
                
                // create content (temporary: needed by AS build but not by this cowi build itself; TODO: remove)
                let content = _createContent(compoundXML, widgetObject);
                writeFile(modulePath.resolve(widgetObject.dir, 'content/widgets.content'), content.xml);

                // content html file (content/widgets.html)
                let htmlTargetPath = modulePath.resolve(widgetObject.dir, 'content/widgets.html');
                let htmlString = contentHtmlTransformation.contentToHtml(widgetObject.name, compoundXML.Widgets, childInfos, childWidgetsList, true);
                htmlString = patchHTML.run(htmlString, widgetObject);
                writeFile(htmlTargetPath, `<div>\n${htmlString}</div>`);

                // content css file
                // creates "content/widgets.scss", "content/widgets.css" and "content/widgets_css.xml"
                let scssTargetPath = modulePath.resolve(widgetObject.dir, 'content/widgets.scss'),
                    scssString = scssTransformation.widgetsToSass(widgetObject.name, compoundXML.Widgets, childInfos); 
                writeFile(scssTargetPath, scssString);
                
                let sassCss = sass.renderSync({
                    data: scssString,
                    outputStyle: 'compressed',
                    includePaths: [modulePath.resolve(buildCfg.corePath + '/css/libs')]
                });
                // widgets_css.xml and widget.css with id replaced by placeholder
                writeCssFiles(sassCss.css.toString(), widgetObject);

                // base and default scss files
                // position of this call is crucial, as widgetInfo will be changed in later steps (width and height are removed from "normal" properties)
                let baseScssTargetPath = widgetObject.metaClassPath + '_base.scss';
                let baseScssString = defaultStyleTransformation.createBaseScss(widgetInfo.name, widgetInfo);
                writeFile(baseScssTargetPath, baseScssString);

                let defaultScssTargetPath = widgetObject.metaClassPath + '_default.scss';
                let defaultScssString = defaultStyleTransformation.createDefaultScss(widgetInfo.name, baseScssString);
                writeFile(defaultScssTargetPath, defaultScssString);

                let defaultCssTargetPath = widgetObject.metaClassPath + '_default.sass.css';
                let defaultCss = sass.renderSync({
                    data: defaultScssString,
                    outputStyle: 'compressed',
                    includePaths: [modulePath.resolve(buildCfg.corePath + '/css/libs')]
                });
                writeFile(defaultCssTargetPath, defaultCss.css);

                returnValue = widgetObject;
            } catch (err) {
                if (buildCfg.reportFile) {
                    deleteWidget(widgetObject);
                }
                throw err;
            }
        });
        return returnValue;
    }

    function _createContent(compoundXML, widgetObject) {
        let content = { 
            $: {
                id: widgetObject.name,
                width: widgetObject.commonProps.width,
                height: widgetObject.commonProps.height,
                xmlns: 'http://www.br-automation.com/iat2015/contentDefinition/v2',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            Widgets: compoundXML.Widgets 
        };
        var contentXML = xmlConvert.js2xml({
            Content: content
        });
        return { xml: '<?xml version="1.0" encoding="utf-8"?>\n' + contentXML, obj: content };
    }

    function writeFile(path, content) {
        if (debug) {
            grunt.log.writeln(('write ' + path).cyan);
        }
        grunt.file.write(path, content);
    }

    function deleteFile(path, options) {
        if (grunt.file.exists(path)) {
            grunt.file.delete(path, options);
        }
    }

    function createWidgetHTML(templateHTML, ancestorObject, widgetObject) {
        return templateHTML.replace(ancestorObject.qualifiedName, widgetObject.qualifiedName);
    }

    function createWidgetStyle(template, widgetObject, commonProps) {
        var newFile = template.replace('__WIDGET_NAME__', widgetObject.type);
        newFile = newFile.replace('__WIDTH__', commonProps.width);
        newFile = newFile.replace('__HEIGHT__', commonProps.height);

        return newFile;
    }

    function createStyleXML(superStyle, widgetObject) {
        // set default values if they exist in compoundWidget
        for (var i = 0; i < superStyle.styleProperties.StyleProperty.length; i += 1) {
            var prop = superStyle.styleProperties.StyleProperty[i]['$'],
                propName = prop['name'];
            if (widgetObject.commonProps !== undefined && widgetObject.commonProps[propName] !== undefined && ['top', 'left', 'zIndex'].indexOf(propName) === -1) {
                prop.default = widgetObject.commonProps[propName];
                prop.owner = widgetObject.type;
            }
        }
        var styleXML = xmlConvert.js2xml({
            StyleProperties: superStyle.styleProperties
        });

        return styleXML;
    }

    function createAncestorObject(corePath) {
        var obj = {
            type: 'system.widgets.CompoundWidget'
        };
        obj.metaDir = modulePath.resolve(corePath, 'system/widgets/CompoundWidget/meta');
        obj.name = obj.type.substring(obj.type.lastIndexOf('.') + 1);
        obj.filePath = Utils.className2Path(obj.type);
        obj.qualifiedName = Utils.className2Path(obj.type, false, true);
        obj.dir = modulePath.resolve(corePath, 'system/widgets/CompoundWidget');
        return obj;
    }

    function removeNonPublic(widgetInfo, types) {
        var i;

        if (types.indexOf('properties') !== -1 && Array.isArray(widgetInfo.properties)) {
            for (i = widgetInfo.properties.length - 1; i >= 0; i -= 1) {
                var property = widgetInfo.properties[i];
                if (property.public === false) {
                    widgetInfo.properties.splice(i, 1);
                }
            }
        }
        if (types.indexOf('methods') !== -1 && Array.isArray(widgetInfo.methods)) {
            for (i = widgetInfo.methods.length - 1; i >= 0; i -= 1) {
                var method = widgetInfo.methods[i];
                if (method.public === false) {
                    widgetInfo.methods.splice(i, 1);
                }
            }
        }
        if (types.indexOf('events') !== -1 && Array.isArray(widgetInfo.events)) {
            for (i = widgetInfo.events.length - 1; i >= 0; i -= 1) {
                var event = widgetInfo.events[i];
                if (event.public === false) {
                    widgetInfo.events.splice(i, 1);
                }
            }
        }
    }

    function createWidgetFile(widgetInfo, json2xml, stylablePropsXML, propertyGroupsObj) {

        // remove not_styleable properties from normal properties
        if (Array.isArray(widgetInfo.properties)) {

            for (var i = widgetInfo.properties.length - 1; i >= 0; i -= 1) {
                var property = widgetInfo.properties[i];
                if (property.cssProp === true) {
                    widgetInfo.properties.splice(i, 1);
                } else {
                    if (property.setAction) {
                        delete property.setAction;
                    }
                    if (property.getAction) {
                        delete property.getAction;
                    }
                }

            }
        }

        // generate xml from widgetInfo
        var xml = json2xml.convert(widgetInfo, {
            prettify: {
                enable: true
            }
        });

        // adding styleable properties and propertyGroups to xml
        var groupXml = xmlConvert.js2xml({
            PropertyGroups: propertyGroupsObj
        });

        var insertIndex = xml.lastIndexOf('</Widget>');
        xml = xml.substring(0, insertIndex) + ((propertyGroupsObj) ? groupXml + '\n' : '') + stylablePropsXML + '\n' + xml.substring(insertIndex);

        if (Array.isArray(widgetInfo.eventBindings) && Array.isArray(widgetInfo.eventBindings[0].EventBinding)) {
            var eventBindingXML = xmlConvert.js2xml({
                EventBindings: widgetInfo.eventBindings[0]
            });
            insertIndex = xml.lastIndexOf('</Widget>');
            xml = xml.substring(0, insertIndex) + eventBindingXML + '\n' + xml.substring(insertIndex);
        }
        return xml;

    }

    function deleteWidget(widgetObject) {
        deleteFile(widgetObject.dir, { force: true });
        // remove lib dir also if its empty
        let libDir = widgetObject.dir.substring(0, widgetObject.dir.lastIndexOf(widgetObject.name));
        if (grunt.file.expand(`${libDir}*/*.js`).length === 0) {
            deleteFile(libDir, { force: true });
        }
        // remove type from list of widgets for postProcess
        let obj = grunt.config.get('compoundWidgets');
        if (obj) {
            delete obj[widgetObject.type.replace(/\./g, '_')];
            grunt.config.set('compoundWidgets', obj); 
        }
    }

    function writeCssFiles(widgetCss, compoundWidget) {
        let idRegex = new RegExp('#' + compoundWidget.name + '_', 'g');
        let contentCSS = widgetCss.replace(idRegex, '#{ID_PREFIX}');
        writeFile(modulePath.resolve(compoundWidget.dir, 'content/widgets_css.xml'), '<?xml version="1.0" encoding="utf-8"?><style>' + contentCSS + '</style>');
        writeFile(modulePath.resolve(compoundWidget.dir, 'content/widgets.css'), contentCSS); 
    }

    module.exports = builder;

})();
