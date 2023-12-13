define([
    'brease/core/BaseWidget',
    'brease/decorators/LanguageDependency' 
], function (
    SuperClass, languageDependency
) {

    'use strict';

    /**
    * @class widgets.brease.WebViewer
    * #Description
    * Displays HTML Pages coming from an external source, defaults to the SDM
    * @breaseNote 
    * @extends brease.core.BaseWidget
    *
    * @iatMeta studio:license
    * licensed
    * @iatMeta category:Category
    * Media
    * @iatMeta category:IO
    * Output
    * @iatMeta category:Operation
    * Touch,Mouse
    * @iatMeta category:Appliance
    * Text
    * @iatMeta category:Performance
    * Low,Medium,High
    * @iatMeta description:short
    * HTML Content Viewer
    * @iatMeta description:de
    * Zeigt HTML Seiten an, die von einer externen Quelle kommen.
    * @iatMeta description:en
    * Displays HTML pages coming from an external source
    */

    /**
    * @htmltag examples
    * ##Configuration examples:  
    *
    *     <div id="WebViewer1" data-brease-widget="widgets/brease/WebViewer"></div>
    *     <div id="WebViewer1" data-brease-widget="widgets/brease/WebViewer" data-brease-options="{''}"></div>
    *
    */

    /**
    * @cfg {String} host=''
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * Hostname or IP of the server the data is to be pulled from. If this is 
    * left blank this field will default to value of the source of where the
    * application is running.
    *
    *  Common explanation of host, port, path and query:
    *
    *  Property specification of the URL. URL is the Uniform Resource Locator
    *  where the webpage's address is given. It is written on the format of:
    * 
    *  http://[host][:port][/path][?query]
    *         
    *  an example to break down the B&amp;R homepage URL as following to add 
    *  to the properties:
    *
    * https://www.br-automation.com/en/search/?stype=0&amp;key=mapp%20View
    * 
    * explanation:
    *  -here the host is: www.br-automation.com
    *  -the port is by default 80, and can thus be left at default.
    *  -the path is: /en/search/
    *  -the query is: stype=0&amp;key=mapp%20View
    */

    /**
    * @cfg {Number} port=80
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * Port of the server, default value is 80.
    */

    /**
    * @cfg {String} path='sdm'
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * The path of the URL, this is what comes after the port (if given) or after
    * the domain. E.g.: in the url www.example.com/this/is/the/path/
    * The path field would have to be 'this/is/the/path/'
    */

    /**
    * @cfg {String} query=''
    * @iatStudioExposed
    * @iatCategory Data
    * @bindable
    * The query of a URL is the parameters after the &amp; , also known as the
    * GET-parameters. These should be specified as following:
    * 
    * single parameter: param=value
    * multiple parameters: param1=value&param2=value&param3=value
    */

    /**
    * @cfg {String} src=''
    * @iatStudioExposed
    * @iatCategory Data
    * @bindable
    * @localizable
    * Here the url from the browser can be copied and pasted into, and the
    * webpage will be displayed.
    *
    * The src can be used to specify the entire URL at once on the format:
    *
    * http://[host][:port][/path][?query]
    *
    * E.g.: https://www.br-automation.com/en/search/?stype=0&amp;key=mapp%20View
    *
    * Port 80 is standard for the web and thus doesn't have to be added.
    */

    /**
    * @cfg {Boolean} useURL= true
    * @iatStudioExposed
    * @iatCategory Behavior
    * @bindable
    * This option toggles between using the Properties (host, port, path AND 
    * query) and the src-property. If true the four properties together will
    * be used to create the url, else the src-option will be used.
    *
    * By default, the URL-properties are used and if not altered these will
    * direct the user to the SDM of the source.
    */

    /**
    * @cfg {String} zoomMode='original'
    * @iatCategory Behavior
    * @bindable
    * Zoom mode as options in layout areas: original, contain, cover
    */

    /**
    * @cfg {Boolean} busy=false
    * @iatStudioExposed
    * @iatCategory Behavior
    * @bindable
    * @not_projectable
    * @readonly
    * Request not yet completed.
    */

    var defaultSettings = {
            host: '',
            port: 80,
            path: 'sdm',
            query: '',
            src: '',
            useURL: true,
            zoomMode: 'contain',
            busy: false
        },

        WidgetClass = SuperClass.extend(function WebViewer() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseWebViewer');
        }

        if (brease.config.editMode) {
            _addEditorSVG(this);
        } else {
            _addIFrame(this);
            _urlInit(this);
        }

        SuperClass.prototype.init.call(this);
    };

    /**
    * @method setUseURL
    * @iatStudioExposed
    * Sets the value of the option for selecting the source displayed in the widget.
    * @param {Boolean} value
    */
    p.setUseURL = function (value) {
        this.settings.useURL = value;
        this.reload();
    };

    /**
    * @method getUseURL
    * Returns the value of the option for selecting the source displayed in the widget.
    * @return {Boolean} 
    */
    p.getUseURL = function () {
        return this.settings.useURL;
    };

    /**
    * @method setHost
    * @iatStudioExposed
    * Sets the host, as in hostname or ip-address.
    * @param {String} value
    */
    p.setHost = function (value) {
        this.settings.host = value;
        this.reload();
    };

    /**
    * @method getHost
    * Gets the host, as in hostname or ip-address.
    * @return {String} host
    */
    p.getHost = function () {
        return this.settings.host;
    };

    /**
    * @method setPort
    * @iatStudioExposed
    * Sets the port.
    * @param {Number} value
    */
    p.setPort = function (value) {
        this.settings.port = value;
        this.reload();
    };

    /**
    * @method getPort
    * Returns the port.
    * @return {Number} port
    */
    p.getPort = function () {
        return this.settings.port;
    };

    /**
    * @method setPath
    * @iatStudioExposed
    * Sets the path.
    * @param {String} value
    */
    p.setPath = function (value) {
        this.settings.path = value;
        this.reload();
    };

    /**
    * @method getPath
    * Returns the path.
    * @return {String} path
    */
    p.getPath = function () {
        return this.settings.path;
    };

    /**
    * @method setQuery
    * @iatStudioExposed
    * Sets the query.
    * @param {String} value
    */
    p.setQuery = function (value) {
        this.settings.query = value;
        this.reload();
    };

    /**
    * @method getQuery
    * Returns the query.
    * @return {String} query
    */
    p.getQuery = function () {
        return this.settings.query;
    };

    /**
    * @method setSrc
    * @iatStudioExposed
    * Sets the src.
    * @param {String} value
    * @paramMeta value:localizable=true
    */
    p.setSrc = function (value) {
        this.settings.src = value;
        this.reload();
    };

    /**
    * @method getSrc
    * Returns the src.
    * @return {String} src
    */
    p.getSrc = function () {
        return this.settings.src;
    };

    /**
    * @method setSrcKey
    * Sets the srcKey.
    * @param {String} srcKey
    */
    p.setSrcKey = function (srcKey) {
        this.settings.srcKey = srcKey;
        this.setLangDependency(true);
        this.reload();
    };

    /**
    * @method getSrcKey
    * Returns the srcKey.
    * @return {String} srcKey
    */
    p.getSrcKey = function () {
        return this.settings.srcKey;
    };

    /**
    * @method setZoomMode
    * Sets the zoomMode.
    * @param {String} zoomMode
    */
    p.setZoomMode = function (zoomMode) {
        this.settings.zoomMode = zoomMode;
    };

    /**
    * @method getZoomMode
    * Returns the zoomMode.
    * @return {String} zoomMode
    */
    p.getZoomMode = function () {
        return this.settings.zoomMode;
    };

    /**
    * @method setBusy
    * Sets the busy.
    * @param {String} busy
    */
    p.setBusy = function (busy) {
        this.settings.busy = busy;
    };

    /**
    * @method getBusy
    * Returns the busy status.
    * @return {String} busy
    */
    p.getBusy = function () {
        return this.settings.busy;
    };

    p.langChangeHandler = function (e) {
        if (this.settings.srcKey !== undefined) {
            this.setSrc(brease.language.getText(this.settings.srcKey), true);
        }
    };

    /**
     * @method reload
     * @iatStudioExposed
     * Reloads the configured src/url of the widget.
     */
    p.reload = function () {
        if (this.deferredIFrameUpdate) {
            window.clearTimeout(this.deferredIFrameUpdate);
        }
        this.deferredIFrameUpdate = _.defer(this._bind('updateUrl'));
    };

    p.updateUrl = function () {
        _buildUrl(this);
        _checkWebsiteAvailability(this);
        this.settings.busy = true;
        this.submitChanges();
    };

    /**
    * @event Click
    */
    p._clickHandler = function (e) {
        SuperClass.prototype._clickHandler.apply(this, arguments);
    };

    p._destinationReachableHandler = function () {
        this.iframeEl.attr('src', this.buildUrl);
        this.iframeEl.one('load', this._bind('_iFrameLoadedHandler'));
    };

    p._destinationUnRechableHandler = function (status) {
        this.iframeEl.attr('src', this.buildUrl);
        this.iframeEl.one('load', _.bind(this._iFrameErrorHandler, this, status));
    };

    p._iFrameLoadedHandler = function () {
        //_applyZoomMode(this);
        this.settings.busy = false;
        this.submitChanges();
    };

    p._iFrameErrorHandler = function (status, e) {
        this.settings.busy = false;
        this.submitChanges();
    };

    p.submitChanges = function () {
        this.sendValueChange({ busy: this.getBusy() });
    };

    p.dispose = function () {
        if (this.urlTest) {
            this.urlTest.abort();
        }
        if (!brease.config.editMode) {
            this.iframeEl.off();
        }
        if (this.deferredIFrameUpdate) {
            window.clearTimeout(this.deferredIFrameUpdate);
        }
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    //Private

    function _buildUrl(widget) {
        var url,
            s = widget.settings;

        if (s.useURL === true) {

            s.host = (s.host === '' || s.host === undefined) ? location.hostname : s.host;
            // check if s.host starts with 'http*://' and ends with '/'
            s.host = s.host.replace(/http.*\/\//, '').replace(/\/$/, '');

            s.port = (s.port === 0 || s.host === undefined) ? location.port : s.port;

            s.path = (s.path[0] === '/') ? s.path : '/' + s.path;
            //s.query = (s.query[0] === '?' || s.query !== '' || s.query !== undefined) ? s.query : '?' + s.query;
            s.query = (s.query.search(/^\?/) === 0 || s.query === '') ? s.query : ('?' + s.query);

            url = location.protocol + '//' + s.host + ':' + s.port + s.path;
            url += (s.query === '' || s.query === undefined) ? '' : s.query;
        } else {
            url = s.src;
        }

        widget.buildUrl = url;
    }

    function _addIFrame(widget) {
        widget.iframeEl = $('<iframe>');
        widget.el.append(widget.iframeEl);
    }

    function _checkWebsiteAvailability(widget) {

        if (widget.urlTest) {
            widget.urlTest.abort();
        }

        widget._destinationReachableHandler();
    }

    // eslint-disable-next-line no-unused-vars
    function _applyZoomMode(widget) {

        var iFrameHtmlEl = widget.iframeEl.find('<body>').parent(),
            iFrameContentSize = {},
            scaleFactor = { x: 0, y: 0 };

        iFrameContentSize.height = iFrameHtmlEl.height();
        iFrameContentSize.width = iFrameHtmlEl.width();

        switch (widget.settings.zoomMode) {
            case 'original':
                //no scaling applied in mode original
                break;
            case 'contain':
                if (iFrameContentSize.height > iFrameContentSize.width) {
                    scaleFactor.y = widget.settings.height / iFrameContentSize.height;
                    scaleFactor.x = scaleFactor.y;
                } else {
                    scaleFactor.x = widget.settings.width / iFrameContentSize.width;
                    scaleFactor.y = scaleFactor.x;
                }
                break;
            case 'cover':
                if (iFrameContentSize.height < iFrameContentSize.width) {
                    scaleFactor.y = widget.settings.height / iFrameContentSize.height;
                    scaleFactor.x = scaleFactor.y;
                } else {
                    scaleFactor.x = widget.settings.width / iFrameContentSize.width;
                    scaleFactor.y = scaleFactor.x;
                }
                break;
        }

        iFrameHtmlEl.css({ 'transform-origin': '0,0,0', 'transform': 'scale(' + scaleFactor.x + ',' + scaleFactor.y + ')' });

    }

    function _urlInit(widget) {
        if (widget.settings.src !== undefined) {
            if (brease.language.isKey(widget.settings.src) === false) {
                widget.setSrc(widget.settings.src);
            } else {
                widget.setSrcKey(brease.language.parseKey(widget.settings.src), false);
                widget.langChangeHandler();
            }
        }

    }

    function _addEditorSVG(widget) {
        //widget.el.css('background-image', 'url("widgets/brease/WebViewer/assets/Remote2.svg")');
        var editorImage = "<div class='editorImage'>",
            editorImageId = widget.elem.id + '_EditorImage';

        widget.el.append(editorImage);
        $('#' + widget.elem.id).children('div').attr('id', editorImageId).css('background-image', 'url("widgets/brease/WebViewer/assets/Remote2.svg")');
    }

    return languageDependency.decorate(WidgetClass, false);

});
