define([
    'brease/core/Class'
], function (SuperClass) {

    'use strict';

    /** 
     * @class widgets.brease.AlarmLine.libs.reducer.AlarmLineConfigAction
     * Class for storing all actions for the reducer to be used.
     */

    /**
     * @method childrenConfigChanged
     * @return {Object[]} items
     */

    var AlarmLineConfigActions = {
        CHILDREN_CONFIG_CHANGED: 'CHILDREN_CONFIG_CHANGED',
        childrenConfigChanged: function childrenConfigChanged(items) {
            return {
                type: AlarmLineConfigActions.CHILDREN_CONFIG_CHANGED,
                items: items
            };
        }
    };

    return AlarmLineConfigActions;

});
