define([
    'brease/core/BaseWidget',
    'brease/events/BreaseEvent',
    'brease/decorators/CultureDependency',
    'brease/decorators/MeasurementSystemDependency',
    'widgets/brease/AlarmLine/libs/utils/EditorBehavior',
    'widgets/brease/AlarmLine/libs/config/Config',
    'widgets/brease/AlarmLine/libs/config/InitState',
    'widgets/brease/AlarmLine/libs/view/AlarmLineView/AlarmLineView',
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineMainReducer',
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineMainActions',
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineConfigReducer/AlarmLineConfigAction',
    'widgets/brease/common/libs/external/redux',
    'widgets/brease/common/libs/redux/middleware/DataHandler/DataHandlerMiddleware',
    'widgets/brease/common/libs/redux/reducers/DataHandler/DataHandlerActions',
    'widgets/brease/common/libs/redux/reducers/Status/StatusActions',
    'widgets/brease/common/MpLinkHandler/libs/MpLinkHandler',
    'widgets/brease/common/ErrorHandling/libs/CommissioningErrorHandler',
    'widgets/brease/TableWidget/libs/ConfigBuilder',
    'widgets/brease/AlarmLine/libs/utils/Dialogue',
    'brease/decorators/DragAndDropCapability',
    'brease/enum/Enum',
    'widgets/brease/common/libs/BreaseResizeObserver',
    'brease/decorators/ContentActivatedDependency',
    'widgets/brease/common/DragDropProperties/libs/DroppablePropertiesEvents'
], function (SuperClass, BreaseEvent, CultureDependency, MeasurementSystemDependency,
    EditorBehavior, Config, InitState, AlarmLineView,
    AlarmLineReducer, AlarmLineAction, AlarmLineConfigAction,
    Redux, DataHandlerMiddleware, DataHandlerActions, StatusActions,
    MpLinkHandler, ErrorHandler, ConfigBuilder, ConfigDialogue, dragAndDropCapability, Enum, BreaseResizeObserver, contentActivatedDependency) {

    'use strict';

    /**
        * @class widgets.brease.AlarmLine
        * @author malmbergj
        *
        * @mixins widgets.brease.common.DragDropProperties.libs.DroppablePropertiesEvents
        *
        * #Description
        * AlarmLine
        * @extends brease.core.BaseWidget
        * @requires widgets.brease.TextInput
        * @requires widgets.brease.Label
        * @requires widgets.brease.NumericInput
        * @requires widgets.brease.CheckBox
        * @requires widgets.brease.DateTimeInput
        * @requires widgets.brease.Image
        * @requires widgets.brease.Rectangle
        * @requires widgets.brease.DropDownBox
        * @requires widgets.brease.GenericDialog
        * @requires widgets.brease.TableWidget
        * @requires widgets.brease.AlarmList
        * @requires widgets.brease.AlarmLineStyle
        * @iatMeta studio:isContainer
        * true
        *
        * @iatMeta studio:visible
        * true
        *
        * @iatMeta category:Category
        * Data,Alarm
        * 
        * @iatMeta description:short
        * Widget for only displaying one alarm at the time in a header constellation, connected to the MpAlarmXCore
        * @iatMeta description:de
        * Widget, um nur einen Alarm in einem Kopfzeilenformat anzuzeigen, das mit dem MpAlarmXCore verbunden ist
        * @iatMeta description:en
        * Widget for only displaying one alarm at the time in a header constellation, connected to the MpAlarmXCore
        * 
        */

    /**
        * @property {WidgetList} children=["widgets.brease.AlarmLineItem"]
        * @inheritdoc  
        */

    var defaultSettings = Config,
        WidgetClass = SuperClass.extend(function AlarmLine() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),
        p = WidgetClass.prototype;

    /**
        * @method init
        * initialisation method called by the BaseWidget
        */
    p.init = function () {

        this.internal = {
            alarmChanged: false
        };

        //Calculate init state
        var initState = InitState.calculateInitState(this.settings, this.isEnabled(), this.isVisible());
        //Create store
        this.store = Redux.createStore(AlarmLineReducer, initState, Redux.applyMiddleware(DataHandlerMiddleware.childrenInitialized(this)));
        //Create View
        this._setUpView();
        //Collect all the children first - necessary???
        this._collectChildren();

        this.observer = new BreaseResizeObserver(this.elem, this._bind('redraw'));
        document.body.addEventListener(BreaseEvent.THEME_CHANGED, this._bind('redraw'));

        //Initialize superclass
        SuperClass.prototype.init.apply(this, arguments);

        if (brease.config.editMode) {
            this.elem.classList.add('iatd-outline');
            this.editorBehavior = new EditorBehavior(this);
            this.elem.addEventListener('AlarmLineTypeChanged', this._bind('getChildrenData'));
            this.elem.addEventListener(BreaseEvent.WIDGET_STYLE_PROPERTIES_CHANGED, this._bind('getChildrenData'));

            this.editorBehavior.initialize();
            this.observer.init();
        } else {
            this.cb = new ConfigBuilder();
            this.errorHandler = new ErrorHandler(this);

            if (this.settings.filterConfiguration.length > 0) {
                this.setFilterConfiguration(this.settings.filterConfiguration);
            }
            if (this.settings.styleConfiguration.length > 0) {
                this.setStyleConfiguration(this.settings.styleConfiguration);
            }
            this.setFormat(this.settings.format);
            this.linkHandler = new MpLinkHandler(this);
            document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, this._bind('_contentActivatedHandler'));
        }
    };

    /**
        * @method _setUpView
        * @private
        * method used to initialize the view, should only be called by the init function
        */
    p._setUpView = function () {
        this.alarmLineView = new AlarmLineView(this.store, this.el, this);
        //Subscribe master view to the store
        this.store.subscribe(this.alarmLineView.render.bind(this.alarmLineView));
    };

    /**
        * @method _collectChildren
        * @private
        * method used to initialize the children, calls the middleware designated for children collection, should only be called by the init function
        */
    p._collectChildren = function () {
        var dhAction = DataHandlerActions.collectChildren();
        this.store.dispatch(dhAction);
    };

    p.redraw = function () {
        if (this.isVisible()) {
            this.alarmLineView.render();
        }
    };

    /**
        * @method childrenInitializedHandler
        * method used by the DataHandler middlware during initialization
        */
    p.childrenInitializedHandler = function () {
        this.getChildrenData();
    };

    /**
        * @method childrenAdded
        * @param {Object} e event as created by the editor
        * method used by the DataHandler middlware when a new child is added in the editor
        */
    p.childrenAdded = function (e) {
        var dhAction = DataHandlerActions.childrenAdded(e, this);
        this.store.dispatch(dhAction);

        this.getChildrenData();
    };

    /**
        * @method childrenRemoved
        * @param {Object} e event as created by the editor
        * method used by the DataHandler middlware when a child is removed in the editor
        */
    p.childrenRemoved = function (e) {
        var dhAction = DataHandlerActions.childrenRemoved(e, this);
        this.store.dispatch(dhAction);

        this.getChildrenData();
    };

    /**
        * @method getChildrenData
        * collects information from all child widgets, retrieves the width and the column type and stores in 
        * the redux store.
        */
    p.getChildrenData = function () {
        var items = [], storedItems = this.store.getState().dataHandler;
        this.settings.childrenList = storedItems.childrenList;

        for (var i = 0; i < storedItems.childrenIdList.length; i += 1) {
            var child = brease.callWidget(storedItems.childrenIdList[i], 'widget');
            items.push({
                type: child.getShortColumnType(),
                width: child.getWidth(),
                elem: child.elem
            });
            this.settings.config.columns.push({ 'data': items[i].type });
            this.settings.childrenList[i].settings.text = storedItems.childrenList[i].settings.filterText;
        }
        //Due to the TableWidgets needing one extra hidden item for 
        // sorting , the AlarmLine must also push an extra hidden 
        // item into the list
        this.settings.config.columns.push({ type: 'hidden', width: 0 });

        var configAction = AlarmLineConfigAction.childrenConfigChanged(items);
        this.store.dispatch(configAction);
    };

    /**
        * @method _setHeight
        * @private
        * forces an update of the children when the height in the editor is changed. Also calls the superclass
        */
    p._setHeight = function () {
        SuperClass.prototype._setHeight.apply(this, arguments);
        if (brease.config.editMode) {
            this.updateChildrenInEditor();
        }
    };

    /**
        * @method _setWidth
        * @private
        * forces an update of the children when the width in the editor is changed. Also calls the superclass
        */
    p._setWidth = function () {
        SuperClass.prototype._setWidth.apply(this, arguments);
        if (brease.config.editMode) {
            this.updateChildrenInEditor();
        }
    };

    /**
        * @method updateChildrenInEditor
        * dispatches an action to redux updating the values of all children
        */
    p.updateChildrenInEditor = function () {
        var editorAction = AlarmLineAction.updateChildren();
        this.store.dispatch(editorAction);
    };

    /**
        * @method setImagePrefix
        * Sets imagePrefix
        * @param {DirectoryPath} imagePrefix
        */
    p.setImagePrefix = function (imagePrefix) {
        this.settings.imagePrefix = imagePrefix;

        var prefixAction = AlarmLineAction.updateImagePrefix(imagePrefix);
        this.store.dispatch(prefixAction);
    };

    /**
        * @method getImagePrefix
        * Returns imagePrefix
        * @return {DirectoryPath}
        */
    p.getImagePrefix = function () {
        return this.store.getState().alarm.imagePrefix;
    };

    /**
        * @method setEllipsis
        * Sets ellipsis
        * @param {Boolean} ellipsis
        */
    p.setEllipsis = function (ellipsis) {
        this.settings.ellipsis = ellipsis;
        var prefixAction = AlarmLineAction.updateTextSettings({ ellipsis: ellipsis });
        this.store.dispatch(prefixAction);
    };

    /**
        * @method getEllipsis
        * Returns ellipsis
        * @return {Boolean}
        */
    p.getEllipsis = function () {
        return this.store.getState().text.textSettings.ellipsis;
    };

    /**
        * @method setWordWrap
        * Sets wordWrap
        * @param {Boolean} wordWrap
        */
    p.setWordWrap = function (wordWrap) {
        this.settings.wordWrap = wordWrap;
        var prefixAction = AlarmLineAction.updateTextSettings({ wordWrap: wordWrap });
        this.store.dispatch(prefixAction);
    };

    /**
        * @method getWordWrap
        * Returns wordWrap
        * @return {Boolean}
        */
    p.getWordWrap = function () {
        return this.store.getState().text.textSettings.wordWrap;
    };

    /**
        * @method setMultiLine
        * Sets multiLine
        * @param {Boolean} multiLine
        */
    p.setMultiLine = function (multiLine) {
        this.settings.multiLine = multiLine;
        var action = AlarmLineAction.updateTextSettings({ multiLine: multiLine });
        this.store.dispatch(action);
    };

    /**
        * @method getMultiLine 
        * Returns multiLine.
        * @return {Boolean}
        */
    p.getMultiLine = function () {
        return this.store.getState().text.textSettings.multiLine;
    };

    /**
        * @method setImageSuffix
        * Sets imageSuffix
        * @param {ImageType} imageSuffix
        */
    p.setImageSuffix = function (imageSuffix) {
        this.settings.imageSuffix = imageSuffix;

        var suffixAction = AlarmLineAction.updateImageSuffix(imageSuffix);
        this.store.dispatch(suffixAction);
    };

    /**
        * @method getImageSuffix
        * Returns imageSuffix
        * @return {ImageType}
        */
    p.getImageSuffix = function () {
        return this.store.getState().alarm.imageSuffix;
    };

    /**
        * @method setImageActive
        * Sets imageActive
        * @param {ImagePath} imageActive
        */
    p.setImageActive = function (imageActive) {
        this.settings.imageActive = imageActive;

        var activeAction = AlarmLineAction.updateActiveImage(imageActive);
        this.store.dispatch(activeAction);
    };

    /**
        * @method getImageActive
        * Returns imageActive
        * @return {ImagePath}
        */
    p.getImageActive = function () {
        return this.store.getState().alarm.imageActive;
    };

    /**
        * @method setImageActiveAcknowledged
        * Sets imageActiveAcknowledged
        * @param {ImagePath} imageActiveAcknowledged
        */
    p.setImageActiveAcknowledged = function (imageActiveAcknowledged) {
        this.settings.imageActiveAcknowledged = imageActiveAcknowledged;

        var activeAcknowledgedAction = AlarmLineAction.updateActiveAcknowledged(imageActiveAcknowledged);
        this.store.dispatch(activeAcknowledgedAction);
    };

    /**
        * @method getImageActiveAcknowledged
        * Returns imageActiveAcknowledged
        * @return {ImagePath} imageActiveAcknowledged
        */
    p.getImageActiveAcknowledged = function () {
        return this.store.getState().alarm.imageActiveAcknowledged;
    };

    /**
        * @method setImageInactive
        * Sets imageInactive
        * @param {ImagePath} imageInactive
        */
    p.setImageInactive = function (imageInactive) {
        this.settings.imageInactive = imageInactive;

        var inactiveAction = AlarmLineAction.updateInactiveImage(imageInactive);
        this.store.dispatch(inactiveAction);
    };

    /**
        * @method getImageInactive
        * Returns imageInactive
        * @return {ImagePath}
        */
    p.getImageInactive = function () {
        return this.store.getState().alarm.imageInactive;
    };

    /**
        * @method setSortOrder
        * Sets the alarmLineType
        * @param {brease.enum.SortDirection} sortOrder
        */
    p.setSortOrder = function (sortOrder) {
        this.settings.sortOrder = sortOrder;
        var alAction = AlarmLineAction.sortConfigChanged(sortOrder);
        this.store.dispatch(alAction);
    };

    /**
        * @method getSortOrder
        * Sets the alarmLineType
        * @return {brease.enum.SortDirection} 
        */
    p.getSortOrder = function () {
        return this.store.getState().alarm.sort;
    };

    /**
        * @method setFormat
        * Sets format
        * @param {String} format
        */
    p.setFormat = function (format) {
        if (format !== undefined) {
            if (brease.language.isKey(format) === false) {
                this.settings.format = format;
                this.settings.formatKey = undefined;

                var datetimeAction = AlarmLineAction.updateFormat(format);
                this.store.dispatch(datetimeAction);
            } else {
                this.setFormatKey(brease.language.parseKey(format));
            }
        }
    };

    /**
        * @method getFormat 
        * Returns format.
        * @return {String}
        */
    p.getFormat = function () {
        return this.store.getState().alarm.format;
    };

    /**
        * @method setFormatKey 
        * Sets the format key and stores it.
        * @param {String} key
        */
    p.setFormatKey = function (key) {
        //console.debug(WidgetClass.name + '[id=' + this.elem.id + '].setTextKey:', key);
        if (key !== undefined) {
            this.settings.formatKey = key;
            this.setCultureDependency(true);
            var format = brease.language.getTextByKey(this.settings.formatKey);
            if (format !== 'undefined key') {
                this.settings.format = format;

                var datetimeAction = AlarmLineAction.updateFormat(format);
                this.store.dispatch(datetimeAction);
            } else {
                console.iatWarn(this.elem.id + ': Format textKey not found: ' + key);
            }
        } else {
            this.settings.formatKey = undefined;
            console.iatInfo(this.elem.id + ': The text key is not valid : ' + key);
        }
    };

    /**
        * @method sendConfiguration  
        * @param {String} type
        * Serializes a the filter and sends it down to the server.
        */
    p.sendConfiguration = function (type) {
        switch (type) {
            case Enum.MappTableConfigurationType.Styling:
                this.settings.styleConfiguration = this.cb.serialize('style', this.settings.config.style, this.elem.id);
                this.sendValueChange({ 'styleConfiguration': this.settings.styleConfiguration });
                this.updateStyle();
                break;
            default:
                this.settings.filterConfiguration = this.cb.serialize('filter', this.settings.config.filter, this.elem.id);
                this.sendValueChange({ 'filterConfiguration': this.settings.filterConfiguration });
                this.updateFilter();
        }

    };

    /**
        * @method updateFilter 
        * Dispatches a filter configuration changed action to Redux updating the store
        */
    p.updateFilter = function () {
        var filterAction = AlarmLineAction.filterConfigChanged(this.settings.config.filter);
        this.store.dispatch(filterAction);
    };

    /**
    * @method updateStyle 
    * Dispatches a styke configuration changed action to Redux updating the store
    */
    p.updateStyle = function () {
        var styleAction = AlarmLineAction.styleConfigChanged(this.settings.config.style);
        this.store.dispatch(styleAction);
    };

    /**
        * @method setFilterConfiguration
        * Sets filterConfiguration
        * @param {String} filterConfiguration
        */
    p.setFilterConfiguration = function (filterConfiguration) {
        this.settings.filterConfiguration = filterConfiguration;
        this.settings.config.filter = this.cb.parse('filter', filterConfiguration, this.elem.id);
        this.updateFilter();
    };

    /**
        * @method getFilterConfiguration
        * Returns filterConfiguration
        * @return {String}
        */
    p.getFilterConfiguration = function () {
        return this.cb.serialize('filter', this.store.getState().alarm.filter); //this.settings.config.filter?
    };

    /**
    * @method setStyleConfiguration
    * Sets styleConfiguration
    * @param {String} styleConfiguration
    */
    p.setStyleConfiguration = function (styleConfiguration) {
        this.settings.styleConfiguration = styleConfiguration;
        this.settings.config.style = this.cb.parse('style', styleConfiguration, this.elem.id);
        this.updateStyle();
    };

    /**
    * @method getStyleConfiguration
    * Returns styleConfiguration
    * @return {String}
    */
    p.getStyleConfiguration = function () {
        return this.cb.serialize('style', this.store.getState().alarm.style); //this.settings.config.filter?
    };

    /**
        * @method setMpLink
        * Data is received from 
        * @param {MpComIdentType} telegram
        */
    p.setMpLink = function (telegram) {
        this.linkHandler.incomingMessage(telegram);
    };

    /**
        * @method getMpLink
        * At initialization it is called, it may not be called later
        * @return {Object}
        */
    p.getMpLink = function () {
        return this.settings.mpLink;
    };

    /**
        * @method _updateData
        * @private
        * Callback function for the mpLinkHandler, decides what to do with the information it has recieved
        * @param {String} message
        * @param {Object} telegram
        */
    p._updateData = function (message, telegram) {
        if (!message.includes('Error')) {
            switch (telegram.methodID) {
                case 'GetUpdateCount':
                    this.getData();
                    break;
                case 'GetCategoryList':
                    var catAction = AlarmLineAction.updateCategories($.extend(true, [], _.uniq(telegram.data)));
                    this.store.dispatch(catAction);
                    break;
                case 'GetAlarmList':
                    //Update data
                    var dataAction = AlarmLineAction.updateData(telegram.data);
                    this.store.dispatch(dataAction);
                    break;
                case 'SetAcknowledge':
                    if (telegram.response === 'OK') {
                        this.getData();
                    }
                    break;
                default:
                    console.log(telegram.data);
            }
        } else {
            this._onErrorHandler(telegram.error.code);
        }
    };

    /**
        * @method setData
        * Sends a setter telegram to the backend with the provided data
        * @param {Object} telegram
        * @param {String} telegram.methodID method name to be called in the backend
        * @param {Object} telegram.data json object as described in the widget communication document
        * @param {Object} telegram.parameter json object as described in the widget communication document, most often consists of the name parameter with elem Id of the widget
        */
    p.setData = function (telegram) {
        this.linkHandler.sendDataAndProvideCallback(telegram.methodID, this._updateData, telegram.data, telegram.parameter);
    };

    /**
        * @method getData
        * Sends a getter telegram to the backend to retrieve the latest alarmlist
        */
    p.getData = function () {
        this.linkHandler.sendRequestAndProvideCallback('GetAlarmList', this._updateData);
    };

    /**
        * @method getCategories
        * Sends a getter telegram to the backend to retrieve the list of available categories
        */
    p.getCategories = function () {
        this.linkHandler.sendRequestAndProvideCallback('GetCategoryList', this._updateData);
    };

    /**
        * @method _onErrorHandler
        * @private
        * @param {Integer} result 
        * Triggers an event which is dispatched to the backend with the error number passed to the function
        */
    p._onErrorHandler = function (result) {
        if (brease.config.editMode) { return; }

        /**
            * @event OnError
            * @iatStudioExposed
            * Fired when mapp Component sends an Error.
            * @param {Integer} result
            */
        var onErrorEv = this.createEvent('OnError', { result: result });
        onErrorEv.dispatch();
    };

    /**
        * @method _convertItem
        * @private
        * @param {Object} item The item that makes up an entire alarm as passed by the backend
        * @param {String} item.ad1 Additional Information 1
        * @param {String} item.ad2 Additional Information 2
        * @param {String} item.cat Category
        * @param {Integer} item.cod Code
        * @param {Integer} item.ins Instance Id
        * @param {String} item.mes Message
        * @param {String} item.nam Name
        * @param {String} item.sco Scope
        * @param {Integer} item.sev Severity
        * @param {Integer} item.sta State
        * @param {String} item.tim Timestamp
        * @returns {Object} the alarm converted into a more readable object
        * Converts an item from what a compressed version used to save bandwidth when transferred from the backend to a more readable version that a user easily can interpret
        */
    p._convertItem = function (item) {
        var newItem = {
            additionalInfo1: item.ad1,
            additionalInfo2: item.ad2,
            category: item.cat,
            code: item.cod,
            instanceID: item.ins,
            message: item.mes,
            name: item.nam,
            scope: item.sco,
            severity: item.sev,
            state: item.sta,
            timestamp: item.tim
        };

        return newItem;
    };

    /**
        * @method _getCurrentItem
        * @private
        * @returns {Object} the currently displayed alarm in the AlarmLine
        * Gets the currently displayed alarm, converts it into a readable version of it and passes it back
        */
    p._getCurrentItem = function () {
        return this._convertItem(this.store.getState().alarm.currAlarmOrig);
    };

    /**
        * @method alarmChangedHandler
        * Triggers an event which is dispatched to the backend when there is a different alarm displayed
        * Not a private function as the view class has to be able to reach this function.
        */
    p.alarmChangedHandler = function () {
        var item = this._getCurrentItem();
        /**
            * @event AlarmChanged
            * @iatStudioExposed
            * Fired when a new alarm is triggered to the AlarmLine
            * @param {String} additionalInfo1
            * @param {String} additionalInfo2
            * @param {String} category
            * @param {Integer} code
            * @param {Integer} instanceID
            * @param {String} message
            * @param {String} name
            * @param {String} scope
            * @param {Integer} severity
            * @param {Integer} state
            * @param {String} timestamp
            */
        this.internal.alarmChanged = true;
        var clickEv = this.createEvent('AlarmChanged', item);
        clickEv.dispatch();
    };

    /**
        * @method _itemClickHandler
        * @private
        * Triggers an event which is dispatched to the backend when the AlarmLine is clicked
        */
    p._itemClickHandler = function (e) {
        if (this.isDisabled) return;
        var item = this._getCurrentItem();
        /**
            * @event ItemClick
            * @iatStudioExposed
            * Fired when a row is clicked on.
            * @param {String} additionalInfo1
            * @param {String} additionalInfo2
            * @param {String} category
            * @param {Integer} code
            * @param {Integer} instanceID
            * @param {String} message
            * @param {String} name
            * @param {String} scope
            * @param {Integer} severity
            * @param {Integer} state
            * @param {String} timestamp
            * @param {String} horizontalPos horizontal position of click in pixel i.e '10px'
            * @param {String} verticalPos vertical position of click in pixel i.e '10px'
            */
        var clickEv = this.createMouseEvent('ItemClick', item, e);
        clickEv.dispatch();
    };

    /**
        * @method _itemDoubleClickHandler
        * @private
        * Triggers an event which is dispatched to the backend when the AlarmLine is double clicked
        */
    p._itemDoubleClickHandler = function (e) {
        if (this.isDisabled) return;
        var item = this._getCurrentItem();
        /**
            * @event ItemDoubleClick
            * @iatStudioExposed
            * Fired when a row is double clicked on.
            * @param {String} additionalInfo1
            * @param {String} additionalInfo2
            * @param {String} category
            * @param {Integer} code
            * @param {Integer} instanceID
            * @param {String} message
            * @param {String} name
            * @param {String} scope
            * @param {Integer} severity
            * @param {Integer} state
            * @param {String} timestamp
            * @param {String} horizontalPos horizontal position of click in pixel i.e '10px'
            * @param {String} verticalPos vertical position of click in pixel i.e '10px'
            */
        var clickEv = this.createMouseEvent('ItemDoubleClick', item, e);
        clickEv.dispatch();
    };

    /* Actions */
    /**
        * @method acknowledge
        * @iatStudioExposed
        * Acknowledge currently selected alarm
        */
    p.acknowledge = function () {
        if (this.isDisabled) { return; }

        var telegram = {
            'request': 'Set',
            'methodID': 'SetAcknowledge',
            'parameter': {
                'ins': this.store.getState().alarm.alarm.ins,
                'name': this.elem.id
            }
        };
        this.setData(telegram);
    };

    /**
        * @method showAlarmByInstanceId
        * Sets the value of which instance id should be shown
        * @iatStudioExposed
        * @param {UInteger} value
        */
    p.showAlarmByInstanceId = function (value) {
        var insIdAction = AlarmLineAction.showSelection({ 'ins': value });
        this.store.dispatch(insIdAction);
    };

    /**
        * @method showAlarmByCode
        * Sets the value of which alarm code should be shown
        * @iatStudioExposed
        * @param {UInteger} value
        */
    p.showAlarmByCode = function (value) {
        var codeAction = AlarmLineAction.showSelection({ 'cod': value });
        this.store.dispatch(codeAction);
    };

    /**
        * @method showAlarmByName
        * Sets the value of which alarm code should be shown
        * @iatStudioExposed
        * @param {String} value
        */
    p.showAlarmByName = function (value) {
        var nameAction = AlarmLineAction.showSelection({ 'nam': value });
        this.store.dispatch(nameAction);
    };

    /**
        * @method showDefault
        * Removes any selection made by the showAlarmByName, showAlarmByCode or showAlarmByInstanceId.
        * @iatStudioExposed
        */
    p.showDefault = function () {
        var nameAction = AlarmLineAction.showSelection({ 'res': -1 });
        this.store.dispatch(nameAction);
    };

    /**
        * @method showFirst
        * @iatStudioExposed
        * Displays the previous alarm that is possible to display given sorting and filtering settings
        * @return {Boolean} returns whether the action was successful or not
        */
    p.showFirst = function () {
        this._restoreAlarmChanged();
        var firstAlarmAction = AlarmLineAction.firstAlarm();
        this.store.dispatch(firstAlarmAction);
        return this._alarmChanged();
    };

    /**
        * @method showPrevious
        * @iatStudioExposed
        * Displays the previous alarm that is possible to display given sorting and filtering settings
        * @return {Boolean} returns whether the action was successful or not
        */
    p.showPrevious = function () {
        this._restoreAlarmChanged();
        var prevAlarmAction = AlarmLineAction.previousAlarm();
        this.store.dispatch(prevAlarmAction);
        return this._alarmChanged();
    };

    /**
        * @method showNext
        * @iatStudioExposed
        * Displays the next alarm that is possible to display given sorting and filtering settings
        * @return {Boolean} returns whether the action was successful or not
        */
    p.showNext = function () {
        this._restoreAlarmChanged();
        var nextAlarmAction = AlarmLineAction.nextAlarm();
        this.store.dispatch(nextAlarmAction);
        return this._alarmChanged();
    };

    /**
        * @method showLast
        * @iatStudioExposed
        * Displays the previous alarm that is possible to display given sorting and filtering settings
        * @return {Boolean} returns whether the action was successful or not
        */
    p.showLast = function () {
        this._restoreAlarmChanged();
        var lastAlarmAction = AlarmLineAction.lastAlarm();
        this.store.dispatch(lastAlarmAction);
        return this._alarmChanged();
    };

    /**
        * @method _alarmChanged
        * @private
        * checks the return value of the actions first-, previous-, next-, lastAlarm and returns whether the operation was successful or not.
        * @return {Boolean} returns whether the action was successful or not
        */
    p._alarmChanged = function () {
        if (this.internal.alarmChanged) {
            this.internal.alarmChanged = false;
            return true;
        }

        return false;
    };

    /**
        * @method _restoreAlarmChanged
        * @private
        * restores the value that checks whether the actions first-, previous-, next-, lastAlarm and returns a successful operation or not.
        */
    p._restoreAlarmChanged = function () {
        this.internal.alarmChanged = false;
    };

    /**
        * @method openConfiguration
        * Open the filter part of the configuration dialogue
        * @iatStudioExposed
        * @param {MappTableConfigurationType} type (Supported types: Filtering)
        */
    p.openConfiguration = function (type) {
        if (this.isDisabled) { return; }
        this.settings.categories = this.store.getState().alarm.categories;
        this.configDialogue = new ConfigDialogue(this);
        switch (type) {
            case 'Filtering':
                this.configDialogue.open(Enum.MappTableConfigurationType.Filtering);
                break;

            case 'Styling':
                this.configDialogue.open(Enum.MappTableConfigurationType.Styling);
                break;
            default:
                console.iatWarn('Unsupported configuration type for the AlarmLine!');
        }
    };

    /**
        * @method _contentActivatedHandler
        * @private
        * method that is called when the content activate event is triggered. Sets up the initial communication with the backend, subscribing to the
        * GetUpdateCount method and retriving the category list.
        */
    p._contentActivatedHandler = function (e) {
        if (e.detail.contentId === this.settings.parentContentId && this) {
            document.body.removeEventListener(BreaseEvent.CONTENT_ACTIVATED, this._bind('_contentActivatedHandler'));
            if ((this.bindings === undefined || this.bindings['mpLink'] === undefined) && !brease.config.preLoadingState) {
                this._setMissingBindingErrorMsg();
            }
            this.linkHandler.subscribeWithCallback('GetUpdateCount', this._updateData);
            this.getCategories();
        }
    };

    /**
        * @method _contentDeactivatedHandler
        * @private
        * method that is called to unsubscribe to the GetUpdateCount method, called primarily by the suspend and dispose methods.
        */
    p._contentDeactivatedHandler = function () {
        if (!brease.config.editMode) {
            this.linkHandler.unSubscribe('GetUpdateCount');
        }
    };

    /**
        * @method _setMissingBindingErrorMsg
        * @private
        * method that is used to set a warning div over the widget incase the mplink binding is missing, used as "commissioning of the widget".
        */
    p._setMissingBindingErrorMsg = function () {
        this.errorHandler.requiredBindingMissing('mpLink');
    };

    /**
        * @method cultureChangeHandler
        * method called by the CultureDependency decorator. 
        */
    p.cultureChangeHandler = function () {
        if (this.settings.formatKey) {
            this.setFormatKey(this.settings.formatKey);
        }
        this.getData();
    };

    /**
        * @method measurementSystemChangeHandler
        * method called by the CultureDependency decorator. 
        */
    p.measurementSystemChangeHandler = function (e) {
        this.cultureChangeHandler(e);
    };

    p.contentActivatedHandler = function () {
        if (this.observer.initialized) {
            this.observer.wake();
        } else {
            this.observer.init();
        }
    };

    /**
        * @method setVisible
        * @iatStudioExposed
        * Sets the state of property «visible»
        * @param {Boolean} value
        */
    p.setVisible = function (value) {
        if (!brease.config.editMode) {
            SuperClass.prototype.setVisible.apply(this, arguments);
            var visibleAction = StatusActions.changeVisible(value);
            this.store.dispatch(visibleAction);
        }
    };

    p._visibleHandler = function () {
        this.redraw();
    };

    /**
        * @method getVisible
        * method to get the visibility state of the widget, read from the store not base widget 
        */
    p.getVisible = function () {
        return this.store.getState().status.visible;
    };

    /**
        * @method setEnable
        * @iatStudioExposed
        * Sets the state of property «enable»
        * @param {Boolean} value
        */
    p.setEnable = function (value) {
        if (!brease.config.editMode) {
            var visibleAction = StatusActions.changeEnable(value);
            this.store.dispatch(visibleAction);
            SuperClass.prototype.setEnable.apply(this, arguments);
        }
    };

    /**
        * @method getEnable
        * method to get the enable state of the widget, read from the store not base widget 
        */
    p.getEnable = function () {
        return this.store.getState().status.enabled;
    };

    // Functions to dispose, wake and suspend the widget

    /**
    * @method onBeforeDispose
    * calls the _contentDeactivateHandler to unsubscribe from the backend, updates the Redux state and finally updates the superclass method dispose 
    */
    p.onBeforeDispose = function () {
        this._contentDeactivatedHandler();
        SuperClass.prototype.onBeforeDispose.apply(this, arguments);
    };

    p.dispose = function () {
        this.observer.dispose();
        document.body.removeEventListener(BreaseEvent.THEME_CHANGED, this._bind('redraw'));
        document.body.removeEventListener(BreaseEvent.CONTENT_ACTIVATED, this._bind('_contentActivatedHandler'));
        var activeAction = StatusActions.changeActive(false);
        this.store.dispatch(activeAction);
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    /**
    * @method wake
    * calls the updates the Redux state and finally updates the superclass method suspend 
    */
    p.wake = function () {
        this.observer.wake();
        document.body.addEventListener(BreaseEvent.THEME_CHANGED, this._bind('redraw'));
        document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, this._bind('_contentActivatedHandler'));
        var activeAction = StatusActions.changeActive(true);
        this.store.dispatch(activeAction);
        SuperClass.prototype.wake.apply(this, arguments);
    };

    /**
    * @method onBeforeSuspend
    * calls the _contentDeactivateHandler to unsubscribe from the backend, updates the Redux state and finally updates the superclass method suspend 
    */
    p.onBeforeSuspend = function () {
        this._contentDeactivatedHandler();
        SuperClass.prototype.onBeforeSuspend.apply(this, arguments);
    };

    p.suspend = function () {
        this.observer.suspend();
        document.body.removeEventListener(BreaseEvent.THEME_CHANGED, this._bind('redraw'));
        var activeAction = StatusActions.changeActive(false);
        this.store.dispatch(activeAction);
        this.linkHandler.reset();
        SuperClass.prototype.suspend.apply(this, arguments);
    };

    return contentActivatedDependency.decorate(dragAndDropCapability.decorate(MeasurementSystemDependency.decorate(CultureDependency.decorate(WidgetClass, true), true), false), true);
});
