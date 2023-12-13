define([
    'brease/core/BaseWidget',
    'brease/events/BreaseEvent',
    'brease/enum/Enum',
    'brease/core/Types'], 
function (SuperClass, BreaseEvent, Enum, Types) {

    'use strict';

    /**
     * @class widgets.brease.AlarmLineItem
     * @extends brease.core.BaseWidget
     * @iatMeta studio:visible
     * true
     *
     * @iatMeta category:Category
     * Data
     *
     * @iatMeta description:short
     * AlarmLineItem, widget used to set the columns wanted to be shown in the Alarmline
     * @iatMeta description:de
     * Das AlarmLineItem-Widget stellt eine Spalte im AlarmLine-Widget dar
     * @iatMeta description:en
     * AlarmLineItem, widget used to set the columns wanted to be shown in the Alarmline
     */

    /**
     * @cfg {StyleReference} style='default'
     * @hide
     */

    /**
     * @cfg {Boolean} enable=true
     * @hide 
     */

    /**
     * @cfg {Boolean} visible=true
     * @hide
     */

    /**
     * @cfg {Integer} tabIndex=-1
     * @hide
     */

    /**
     * @cfg {RoleCollection} permissionView
     * @hide
     */

    /**
     * @cfg {RoleCollection} permissionOperate
     * @hide
     */

    /**
     * @cfg {String} filterText=''
     * @localizable
     * @iatStudioExposed
     * @iatCategory Appearance 
     * text for the Label
     */

    /**
     * @cfg {String} tooltip=''
     * @iatStudioExposed
     * @hide 
     */

    /**
     * @method showTooltip
     * @hide
     */

    /**
     * @method setEnable
     * @hide
     */

    /**
     * @method setVisible
     * @hide
     */

    /**
     * @method setStyle
     * @hide
     */

    /**
     * @property {WidgetList} parents=["widgets.brease.AlarmLine"]
     * @inheritdoc  
     */
    
    /**
     * @event Click
     * Fired when element is clicked on.
     * @hide
     * @param {String} origin id of widget that triggered this event
     */

    /**
     * @event DisabledClick
     * @hide
     */
    
    /**
     * @event EnableChanged
     * @hide
     */
    
    /**
     * @event VisibleChanged
     * @hide
     */

    /**
    * @method focus
    * @hide
    */
   
    /**
    * @event FocusIn
    * @hide
    */

    /**
    * @event FocusOut
    * @hide
    */

    /**
     * @cfg {brease.enum.AlarmListItemType} columnType='message'
     * @iatStudioExposed
     * @iatCategory Behavior
     * Type the Alarmlist column will display
     */

    var defaultSettings = {
            filterText: '',
            filterTextKey: '',
            text: '',
            columnType: Enum.AlarmListItemType.mes
        },

        WidgetClass = SuperClass.extend(function AlarmLineItem() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        SuperClass.prototype.init.call(this);
        this.el.addClass('breaseAlarmLineItem');
        
        this.elem.addEventListener(BreaseEvent.WIDGET_READY, this._bind('_widgetReadyHandler'));
        this.el.off(BreaseEvent.CLICK, this._bind('_clickHandler'));
    };

    // override method called in BaseWidget.init
    p._initEditor = function () {
        var widget = this;
        widget.designer.options = {
            isRelocatable: false
        };
        require(['widgets/brease/AlarmLineItem/libs/EditorHandles'], function (EditorHandles) {
            var editorHandles = new EditorHandles(widget);
            widget.getHandles = function () {
                return editorHandles.getHandles();
            };
            widget.designer.getSelectionDecoratables = function () {
                return editorHandles.getSelectionDecoratables();
            };
            widget.dispatchEvent(new CustomEvent(BreaseEvent.WIDGET_EDITOR_IF_READY, { bubbles: true }));
        });
    };

    /**
     * @method setFilterText
     * sets the visible filterText
     * @param {String} filterText The new filterText
     */
    p.setFilterText = function (filterText) {
        if (filterText !== undefined) {
            if (brease.language.isKey(filterText) === false) {
                this.updateText(filterText);
            } else {
                this.setFilterTextKey(brease.language.parseKey(filterText));
            }
        }
    };

    /**
     * @method getFilterText
     * gets the visible filterText
     * @return {String} filterText
     */
    p.getFilterText = function () {
        return this.settings.filterText;
    };

    /**
     * @method setFilterTextKey
     * set the filterText
     * @param {String} key The new filterText
     */
    p.setFilterTextKey = function (key) {
        if (key !== undefined) {
            this.settings.filterTextKey = key;
            this.updateText(brease.language.getTextByKey(this.settings.filterTextKey));
        }
    };

    /**
     * @method getFilterTextKey
     * get the textkey
     */
    p.getFilterTextKey = function () {
        return this.settings.filterTextKey;
    };
    
    /**
     * @method updateText
     * Updates the settings object and DOM element
     */
    p.updateText = function (text) {
        if (text !== null) {
            // No need to escape text as the jquery text method does not allow code injection
            this.settings.filterText = Types.parseValue(text, 'String');
            this.settings.text = this.settings.filterText;
        }
    };

    /**
     * @method setColumnType
     * Sets columnType
     * @param {brease.enum.AlarmListItemType} columnType
     */
    p.setColumnType = function (columnType) {
        this.settings.columnType = columnType;
        var event = new CustomEvent('AlarmLineTypeChanged', { detail: { columnType: Enum.AlarmListItemType.getKeyForValue(columnType) }, bubbles: true, cancelable: true });
        this.dispatchEvent(event);
    };

    /**
     * @method getColumnType 
     * Returns columnType.
     * @return {brease.enum.AlarmListItemType}
     */
    p.getColumnType = function () {
        return this.settings.columnType;
    };

    p.getShortColumnType = function () {
        return Enum.AlarmListItemType.getKeyForValue(this.settings.columnType);
    };

    p.getWidth = function () {
        return this.settings.width;
    };

    p.updateImage = function (img) {
        this.el.find('.ordering').attr('src', img);
    };

    /* Handler */
    p._widgetReadyHandler = function (e) {
        if (e.target.id === this.elem.id) {
            // console.log('Widget -> ' + this.elem.id + ' ready!');
            this.elem.removeEventListener(BreaseEvent.WIDGET_READY, this._bind('_widgetReadyHandler'));
        }
    };
    /* Editor Size change */
    p.widthUpdate = function (newWidth) {
        var event = new CustomEvent('AlarmLineTypeChanged', { detail: { id: this.elem.id, newWidth: newWidth }, bubbles: true, cancelable: true });
        // console.log('New header width: ', newWidth);
        this.dispatchEvent(event);
    };

    return WidgetClass;

});
