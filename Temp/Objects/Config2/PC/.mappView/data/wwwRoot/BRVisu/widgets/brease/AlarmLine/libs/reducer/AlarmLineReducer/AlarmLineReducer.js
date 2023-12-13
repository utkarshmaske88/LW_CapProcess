define([
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineReducer/AlarmLineAction',
    'widgets/brease/AlarmLine/libs/utils/UtilsAlarm/UtilsAlarm',
    'brease/helper/DateFormatter'
], function (AlarmLineActions, UtilsAlarm, DateFormatter) {

    'use strict';

    var AlarmLineReducer = function AlarmLineReducer(state, action) {
        if (state === undefined) {
            return null;
        }
        state.oldAlarm = state.alarm;
        state.oldStyleName = typeof state.styleName === 'string' ? state.styleName.slice(0) : '';
        switch (action.type) {
            case AlarmLineActions.FIRST_ALARM:
                state.position = 0;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;

            case AlarmLineActions.PREVIOUS_ALARM:
                state.position -= (state.position === 0) ? 0 : 1;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;

            case AlarmLineActions.NEXT_ALARM:
                state.position += (state.position === state.preprocessedData.length - 1) ? 0 : 1;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;
                
            case AlarmLineActions.LAST_ALARM:
                state.position = state.preprocessedData.length - 1;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;
                
            case AlarmLineActions.SORT_CONFIG_CHANGED:
                state.sort = action.sort;
                //state.categories = UtilsAlarm.getCategories(state.data);
                state.preprocessedData = UtilsAlarm.filter(state.data, state.filter, state.sort, state.code, state.format);
                state.position = 0;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;

            case AlarmLineActions.FILTER_CONFIG_CHANGED: 
                state.filter = action.filter;
                //state.categories = UtilsAlarm.getCategories(state.data);
                state.preprocessedData = UtilsAlarm.filter(state.data, state.filter, state.sort, state.code, state.format);
                state.position = 0;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;

            case AlarmLineActions.STYLE_CONFIG_CHANGED:
                state.style = action.style;
                //state.categories = UtilsAlarm.getCategories(state.data);
                state.preprocessedData = UtilsAlarm.filter(state.data, state.filter, state.sort, state.code, state.format);
                state.position = 0;
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;

            case AlarmLineActions.UPDATE_SHOW_BY_SELECTION: 
                state.code = action.obj;
                state.position = 0;
                state.preprocessedData = UtilsAlarm.filter(state.data, state.filter, state.sort, state.code, state.format);
                state.currAlarmOrig = state.preprocessedData[state.position];
                state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                return state;

            case AlarmLineActions.UPDATE_DATA:
                //Process data in some way so that we only receive the data we want
                if (action.data !== undefined && action.data.length > 0) {
                    state.data = action.data;
                    //state.categories = UtilsAlarm.getCategories(state.data);
                    state.preprocessedData = UtilsAlarm.filter(state.data, state.filter, state.sort, state.code, state.format);
                    state.position = 0;
                    state.currAlarmOrig = state.preprocessedData[state.position];
                    state.styleName = UtilsAlarm.style(state.currAlarmOrig, state.style);
                    state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                    state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                    
                } else {
                    state.alarm = {};
                    state.data = [];
                    state.preprocessedData = [];
                    state.currAlarmOrig = {};
                    state.styleName = '';
                }
                return state;

            case AlarmLineActions.UPDATE_DATETIME_FORMAT:
                state.format = action.format;
                if (state.currAlarmOrig !== undefined && state.currAlarmOrig.tim !== undefined) {
                    var d = new Date(state.currAlarmOrig.tim.substring(0, 23));
                    DateFormatter.format(d, action.format, function (result) {
                        state.alarm.tim = result;
                    });
                }
                return state;
            
            case AlarmLineActions.UPDATE_CHILDREN:
                return state;
                
            case AlarmLineActions.UPDATE_INACTIVE_IMAGE:
                state.imageInactive = action.image;
                return state;
    
            case AlarmLineActions.UPDATE_ACTIVE_IMAGE:
                state.imageActive = action.image;
                return state;

            case AlarmLineActions.UPDATE_ACTIVE_ACK_IMAGE:
                state.imageActiveAcknowledged = action.image;
                return state;

            case AlarmLineActions.UPDATE_IMAGE_PREFIX:
                state.imagePrefix = action.prefix;
                return state;
    
            case AlarmLineActions.UPDATE_IMAGE_SUFFIX:
                state.imageSuffix = action.suffix;
                return state;

            case AlarmLineActions.UPDATE_CATEGORIES:
                state.categories = action.categories;
                UtilsAlarm.setCategories(state.categories);
                return state;

            case '@@redux/INIT':
                if (brease.config.editMode) {
                    state.categories = UtilsAlarm.getCategories(state.data);
                    state.preprocessedData = UtilsAlarm.filter(state.data, state.filter, state.sort, state.code);
                    state.currAlarmOrig = state.preprocessedData[state.position];
                    state.alarm = UtilsAlarm.formatTimestampOfAlarm(state.preprocessedData[state.position], state.format);
                    state.alarm = UtilsAlarm.fixAlarmImages(state.alarm, state);
                } else {
                    state.data = [];
                }
                return state;
            default:
                return state;
        
        }
    };

    return AlarmLineReducer;

});
