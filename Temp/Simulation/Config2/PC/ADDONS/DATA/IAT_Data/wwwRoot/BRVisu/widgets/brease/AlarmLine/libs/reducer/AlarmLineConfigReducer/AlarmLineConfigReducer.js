define([
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineConfigReducer/AlarmLineConfigAction'
], function (AlarmLineActions) {

    'use strict';

    var AlarmLineConfigReducer = function AlarmLineConfigReducer(state, action) {
        if (state === undefined) {
            return null;
        }
        switch (action.type) {
            case AlarmLineActions.CHILDREN_CONFIG_CHANGED: 
                state.items = action.items;
                return state;
        }

        return state;
    };

    return AlarmLineConfigReducer;

});
