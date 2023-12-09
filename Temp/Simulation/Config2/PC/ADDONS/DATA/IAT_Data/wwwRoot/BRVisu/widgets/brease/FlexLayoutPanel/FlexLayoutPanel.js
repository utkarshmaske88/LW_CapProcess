define([
    'brease/core/ContainerWidget', 
    'brease/enum/Enum'
], function (SuperClass, Enum) {

    'use strict';

    /**
    * @class widgets.brease.FlexLayoutPanel
    * @extends brease.core.ContainerWidget
     * @iatMeta studio:license
     * licensed
    * @iatMeta studio:isContainer
    * true
    * @iatMeta category:Category
    * Container
    * @iatMeta description:short
    * Container Widget
    * @iatMeta description:de
    * Bereich in dem definierte Widgets für eine dynamische Größenanpassung platziert werden können
    * @iatMeta description:en
    * Area in which defined widgets can be placed for dynamic sizing
    */

    /**
     * @property {WidgetList} children=["widgets.brease.FlexLayoutPanel", "widgets.brease.Button", "widgets.brease.TextOutput", "widgets.brease.Label", "widgets.brease.Image", "widgets.brease.LoginInfo", "widgets.brease.DateTimeOutput", "widgets.brease.NumericOutput", "widgets.brease.NumericInput", "widgets.brease.ProgressBar", "widgets.brease.TextInput", "widgets.brease.DateTimeInput", "widgets.brease.Login", "widgets.brease.DropDownBox", "widgets.brease.ListBox", "widgets.brease.Ellipse", "widgets.brease.Rectangle", "widgets.brease.RadioButtonGroup", "widgets.brease.ButtonBar", "widgets.brease.NavigationBar", "widgets.brease.Navigation", "widgets.brease.QRViewer", "widgets.brease.BasicSlider", "widgets.brease.LinearGauge", "widgets.brease.RangeSlider", "widgets.brease.PieChart", "widgets.brease.RadialGauge", "widgets.brease.AlarmList", "widgets.brease.AlarmHistory", "widgets.brease.AuditList", "widgets.brease.UserList", "widgets.brease.AlarmLine", "widgets.brease.Timeline", "widgets.brease.XYJoystick", "widgets.brease.Joystick", "widgets.brease.ImageList", "widgets.brease.TextPicker", "widgets.brease.TextPad", "widgets.brease.Paper", "widgets.brease.XYChart", "widgets.brease.OnlineChartHDA", "widgets.brease.BarChart", "widgets.brease.StackedBarChart", "widgets.brease.VideoPlayer", "widgets.brease.PDFViewer", "widgets.brease.VncViewer", "widgets.brease.MotionPad", "widgets.brease.WebViewer"]
     * @inheritdoc  
     */

    /**
     * @cfg {String} tooltip=''
     * @hide
     */

    /**
     * @method showTooltip
     * @hide
     */

    var defaultSettings = {
            childPositioning: Enum.ChildPositioning.relative //needed in order to sort children in the content editor
        },
        WidgetClass = SuperClass.extend(function FlexLayoutPanel() {
            SuperClass.apply(this, arguments);
        }, defaultSettings, true),
        p = WidgetClass.prototype;

    p.init = function init() {
        if (this.settings.omitClass === true) {
            this.elem.classList.remove('breaseFlexLayoutPanel');
        } else {
            this.addInitialClass('breaseFlexLayoutPanel');
        }
        if (brease.config.editMode === true) {
            this.addInitialClass('iatd-outline');
        }
        SuperClass.prototype.init.apply(this, arguments);
    };
    return WidgetClass;

});
