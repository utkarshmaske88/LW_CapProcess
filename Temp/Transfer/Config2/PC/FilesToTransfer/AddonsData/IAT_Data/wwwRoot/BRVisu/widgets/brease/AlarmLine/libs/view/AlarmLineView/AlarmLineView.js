define([
    'brease/events/BreaseEvent',
    'brease/core/Utils',
    'brease/helper/Scroller',
    'widgets/brease/common/libs/redux/view/ImageView/ImageView',
    'widgets/brease/common/libs/redux/view/TextView/TextView',
    'widgets/brease/common/libs/redux/view/HTMLView/HTMLView'
], function (BreaseEvent, Utils, Scroller, ImageView, TextView, HTMLView) {

    'use strict';

    /** 
     * @class widgets.brease.AlarmLine.libs.view.AlarmLineView
     * @extends core.javascript.Object
     */

    /**
     * @method AlarmLineView
     * constructor to create a new AlarmLineView
     * @param {Object} store 
     * @param {HTMLElement} parent 
     * @param {Object} widget 
     */
    var AlarmLineView = function (store, parent, widget) {
        this.el = parent;
        this.store = store;
        this.widget = widget;
        this.render();
    };

    var p = AlarmLineView.prototype;

    /**
     * @method render
     * method called that renders and re-renders the entire view of the AlarmLine
     */
    p.render = function render() {

        var state = this.store.getState();
        var headerWrapper = this.dispose();
        //console.log(state.alarm.styleName, state.alarm.oldStyleName);
        _handleClasses(this.el, state);
        if (state.status.visible && state.status.active && state.alarm.alarm.ins !== undefined) {

            if (state.alarm.oldAlarm.ins !== state.alarm.alarm.ins) {
                this.widget.alarmChangedHandler();
            }

            var headerItems = this.widget.el.children('.scrollWrapper').children('[data-brease-widget]').detach();
            headerWrapper.append(headerItems);
            
            if (brease.config.editMode) {
                this.scrollHeaderWrapper = $('<div class="scrollHeadWrapper scrollWrapper"/>').append(headerWrapper);
            }

            var itemWrapper = $('<div class="AlarmLineWrapper" style="height:100%;" />'),
                items = state.alarmConfiguration.items;

            this.scrollWrapper = $('<div class="scrollWrapper"/>');
            //for each alarmline item, append their type of view to the module
            for (var i = 0; i < items.length; i += 1) {
                var itemType = items[i].type,
                    itemWidth = items[i].width,
                    itemElem = items[i].elem,
                    itemProps = {};

                if (Utils.isPercentageValue(itemWidth)) {
                    itemWidth = Utils.getPercentageWidth(itemWidth, this.widget.elem);
                    // sync AlarmLineItem width
                    itemElem.style.width = itemWidth + 'px';
                }
                switch (itemType) {
                    case 'cat':
                    case 'sta':
                        itemProps = {
                            image: state.alarm.alarm[itemType],
                            notStyleable: true
                        };
                        this.itemView = new ImageView(itemProps, itemWrapper);
                        this.itemView.el.width(itemWidth);
                        this.itemView.el.children().css('max-height', '100%');
                        break;
                    case 'ad1':
                    case 'ad2':
                        itemProps = {
                            selected: false,
                            textSettings: state.text.textSettings,
                            html: state.alarm.alarm[itemType]
                        };
                        this.htmlView = new HTMLView(itemProps, itemWrapper);
                        this.htmlView.el.width(itemWidth);
                        break;
                    default:
                        itemProps = {
                            selected: false,
                            textSettings: state.text.textSettings,
                            text: state.alarm.alarm[itemType]
                        };
                        this.itemView = new TextView(itemProps, itemWrapper);
                        this.itemView.el.width(itemWidth);
                        break;
                    
                }
                itemWrapper.append(this.itemView);
            }
            itemWrapper.on(BreaseEvent.DBL_CLICK, this.widget._bind('_itemDoubleClickHandler'));
            itemWrapper.on(BreaseEvent.CLICK, this.widget._bind('_itemClickHandler'));
            //append the itemWrapper to the scrollbar 
            this.scrollWrapper.append(itemWrapper);
            this.el.append(this.scrollWrapper);

            if (brease.config.editMode) {
                this.el.append(this.scrollHeaderWrapper);
            }

            this._addScroller();
        }
    };

    /**
     * @method _addScroller
     * @private
     * adds the scrollers to the item- and headerWrapper so that the whole widget is scrollable.
     */
    p._addScroller = function () {
        this.scroller = Scroller.addScrollbars(this.scrollWrapper[0], { 
            scrollbars: 'custom', 
            mouseWheel: true, 
            tap: true, 
            scrollY: false, 
            scrollX: true, 
            freeScroll: true 
        });

        if (brease.config.editMode) {
            this.scrollerHead = Scroller.addScrollbars(this.scrollHeaderWrapper[0], {
                mouseWheel: true,
                scrollY: false,
                scrollX: true,
                scrollbars: false,
                probeType: 3
            });
            this.scrollerHead.on('scroll', _.bind(this._scrollLink, this));
        }
    };

    /**
     * @method _scrollLink
     * @private
     * links the headerScroller with the itemScroller, useful for the editor.
     */
    p._scrollLink = function () {
        this.scroller.scrollTo(this.scrollerHead.x, 0, 0);
    };

    /**
     * @method dispose
     * method that disposes the entire view. Calls _handleHeaderData before removing header items
     */
    p.dispose = function dispose() {
        this.removeEventListeners();
        if (this.scrollWrapper) {
            if (this.scroller) {
                this.scroller.destroy();
                this.scroller = null;
            }
            this.scrollWrapper.detach();
            this.scrollWrapper = null;
        }

        var itemWrapper = this._handleHeaderData();

        if (this.scrollHeaderWrapper && brease.config.editMode) {
            if (this.scrollerHead) {
                this.scrollerHead.destroy();
                this.scrollerHead.off('scroll', _.bind(this._scrollLink, this));
                this.scrollerHead = null;
            }
            this.scrollHeaderWrapper.detach();
            this.scrollHeaderWrapper = null;
        }
        return itemWrapper;
    };

    /**
     * @method _handleHeaderData
     * @private
     * retrieves all header elements from the widget so it doesn't lose information inbetween redraws.
     */
    p._handleHeaderData = function () {
        var children = this.widget.el.find('.AlarmLineHeaderWrapper').children();
        this.widget.el.find('.AlarmLineHeaderWrapper').detach();
        var itemWrapper = $('<div class="container AlarmLineHeaderWrapper" style="height:100%;"/>').append(children);
        if (brease.config.editMode) {
            itemWrapper.css('height', this.widget.el.height());
        }

        return itemWrapper;
    };

    /**
     * @method removeEventListeners
     * method to remove all event listeners attached to the widget. called before a redraw
     */
    p.removeEventListeners = function () {
        this.el.children().off(BreaseEvent.DBL_CLICK, this.widget._bind('_itemDoubleClickHandler'));
        this.el.children().off(BreaseEvent.CLICK, this.widget._bind('_itemClickHandler'));
    };
    // apply css classes depending on the style configuration
    function _handleClasses(el, state) {
        if (state.alarm.styleName && state.alarm.styleName !== state.alarm.oldStyleName) {
            el.addClass('breaseAlarmLine container breaseAlarmLineStyle widgets_brease_AlarmLineStyle_style_' + state.alarm.styleName).removeClass('widgets_brease_AlarmLineStyle_style_' + state.alarm.oldStyleName);
        } else if (state.alarm.styleName !== state.alarm.oldStyleName) {
            el.addClass('breaseAlarmLine container').removeClass('breaseAlarmLineStyle widgets_brease_AlarmLineStyle_style_' + state.alarm.oldStyleName);
        } else {
            el.addClass('breaseAlarmLine container');
        }
    }
    return AlarmLineView;
});
