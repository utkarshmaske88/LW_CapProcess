define([
    'brease/core/BaseWidget'
], function (
    SuperClass
) {

    'use strict';

    /**
    * @class widgets.brease.AlarmLineStyle
    * #Description
    * AlarmLineStyle - abstract widget to set styles in the AlarmLine
    * Text can be language dependent.
    * @breaseNote 
    * @extends brease.core.BaseWidget
    * @iatMeta studio:visible
    * false
    * @abstract
    */

    var WidgetClass = SuperClass.extend(function AlarmLineStyle() {
        SuperClass.apply(this, arguments);
    }, false);

    return WidgetClass;

});
