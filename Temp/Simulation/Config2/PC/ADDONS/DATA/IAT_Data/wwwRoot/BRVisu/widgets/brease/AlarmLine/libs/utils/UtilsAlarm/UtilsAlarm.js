define([
    'brease/helper/DateFormatter',
    'brease/enum/Enum'
], function (DateFormatter, Enum) {

    'use strict';

    /**
    * @class widgets.brease.AlarmLine.libs.utils.UtilsAlarm
    * @extends core.javascript.Object
    */

    var UtilsAlarm = {
        categories: []
    };

    /**
     * @method sort
     * takes an array of the data and the sorting criteria. Preprocess the data by sorting the data accoridng to the sorting criteria and returning the sorted Array
     * @param {Array} data
     * @param {String} sort
     * @return {Array}
     */
    UtilsAlarm.sort = function (data, sort) {
        var sortedData = data.slice().sort(function (a, b) {
            switch (sort) {
                case Enum.SortDirection.ASC:
                    return a.ins - b.ins;
                case Enum.SortDirection.SASC:
                    if (a.sta > b.sta) return 1;
                    if (a.sta < b.sta) return -1;
                    if (a.sev < b.sev) return -1;
                    if (a.sev > b.sev) return 1;
                    return a.ins - b.ins;
                case Enum.SortDirection.SDESC:
                    if (a.sta > b.sta) return 1;
                    if (a.sta < b.sta) return -1;
                    if (b.sev < a.sev) return -1;
                    if (b.sev > a.sev) return 1;
                    return b.ins - a.ins;
                default:
                    return b.ins - a.ins;
            }
        });

        return sortedData;
    };

    /**
     * @method getCategories
     * Deprecated as the backend sends all categories available. Iterates through the process data and retrieves all the Categories in the dataset. Used by the Filtering Dialog
     * @return {Array}
     */
    UtilsAlarm.getCategories = function () {
        return UtilsAlarm.categories;
    };

    /**
     * @method setCategories
     * The Utils class must have all categories available for the Filtering Dialog
     * @param {Array} categories
     */
    UtilsAlarm.setCategories = function (categories) {
        UtilsAlarm.categories = categories;
    };

    /**
     * @method filter
     * takes an array of the data and the filter array. Preprocess the data by filtering out entries. Entries that fit the filter criteria are returned in an Array
     * @param {Array} data
     * @param {Array} filter
     * @return {Array}
     */
    UtilsAlarm.filter = function (data, filter, sort, code, format) {
        if (data === undefined || data === null) { return; }

        var filteredData = data.filter(function (row) {
            if (filter === undefined || filter === null) { return data; }
            var accVal = (filter.length === 0), accAnd = true;
            for (var i = 0; i < filter.length; i += 1) {
                var fil = filter[i];

                var vals = UtilsAlarm._getComparativeAndOriginalValue(fil, row, format), origVal = vals[1], compVal = vals[0];
                var val = UtilsAlarm._getFilterStatement(origVal, fil.opVal, compVal);

                //Filter out if nested and is to be applied
                if (fil.ext) {
                    val = !!((val & UtilsAlarm._getNestedFilterStatement(fil.extCompVal, origVal, UtilsAlarm._getStatus(row['sta']))));
                }

                //Split between whether we are in an 'OR' or 'AND' filter
                if (fil.logVal === 1 || fil.logical === '' || fil.logVal === 2) {
                    accVal = accVal || (accAnd && val);
                    accAnd = true;
                } else if (fil.logVal === 0) {
                    accAnd = accAnd && val;
                }

            }
            return accVal;
        });

        var sortedData = this.sort(filteredData, sort);
        var uniqueData = this.uniqueAlarm(sortedData, code);

        return uniqueData;
    };
    /**
     * @method style
     * takes the currently displayed data and the styling criteria. Preprocess the data accoridng to the styling criteria and returning the style to apply
     * returns an empty string if the data does not match the styling criteria
     * @param {Object} data
     * @param {Array} arrStyleConfig
     * @return {String}
     */
    UtilsAlarm.style = function (data, arrStyleConfig) {
        var styleName = '',
            severity = data ? data.sev : undefined,
            state = data ? data.sta : undefined,
            styleConfig;
        arrStyleConfig = Array.isArray(arrStyleConfig) ? arrStyleConfig : [];
        for (var i = 0; i < arrStyleConfig.length; i += 1) {
            styleConfig = arrStyleConfig[i];
            // compare alarm state either equal to config or config uses any state
            if (state === styleConfig.statePos || styleConfig.statePos === 5) {
                styleName = _getStyleFromConfig(severity, styleConfig);
                // config found
                if (styleName.length > 0) {
                    break;
                }
            } else {
                continue;
            }

        }
        //console.log(data, styleConfig, styleName);
        return styleName;
    };
    /**
     * @method _getComparativeAndOriginalValue
     * @private
     * takes an array of the data and the filter array. Preprocess the data by filtering out entries. Entries that fit the filter criteria are returned in an Array
     * @param {Object} fil the filter configuration of the file
     * @param {Number|String|Date} fil.comp comparative value of the filter, i.e. the value we want to compare the values in the table with
     * @param {String} fil.data the type of column we are looking at. This can be either of tim, nam, sta, ad1, ad2 etc.Object
     * @param {Object} row is all the data the row consists of.
     * @return {Array}
     */
    UtilsAlarm._getComparativeAndOriginalValue = function (fil, row, format) {
        var compVal, origVal;
        //Check if we are looking at time
        if (fil.data === 'tim') {
            compVal = UtilsAlarm._fixTimestamp(fil.comp.split('Z')[0], format);
            origVal = UtilsAlarm._fixTimestamp(row.tim, format);
        } else if (fil.data === 'sta') {
            compVal = fil.comp;
            origVal = UtilsAlarm._getStatus(row[fil.data]);
        } else if (fil.data === 'cat') {
            compVal = UtilsAlarm.categories[fil.comp];
            origVal = row[fil.data];
        } else {
            compVal = fil.comp;
            origVal = row[fil.data];
        }

        return [compVal, origVal];
    };

    /**
     * @method _getStatus
     * @protected
     * @deprecated
     * retrieves a nested number from the an already created div tag.
     * Deprecated as the table should always pass non processed data here
     * @param {String} sta the filter configuration of the file
     * @return {String}
     */
    UtilsAlarm._getStatus = function (sta) {
        if (typeof (sta) === 'string') {
            var s = sta.match(/>\d</);
            return parseInt(sta[s.index + 1], 10);
        }

        return sta;
    };

    /**
     * @method _getNestedFilterStatement
     * @protected
     * figures out if a value, when nested, should be returned as true or false.
     * @param {Integer} active shows wether the alarm has a nested active caluse or not. 1 = active alarm, 0 = non active alarm
     * @param {Integer} val not used
     * @param {Integer} sta Status of the alarm passed.
     * @return {Boolean}
     */
    UtilsAlarm._getNestedFilterStatement = function (active, val, sta) {
        if (active === 0 && (sta === 1 || sta === 2)) {
            return true;
        } else if (active === 1 && (sta === 3 || sta === 4)) {
            return true;
        }

        return false;
    };

    /**
     * @method _getFilterStatement
     * @protected
     * takes the original value, an operator and a comparative value and figures out if these parameters combined return true or false
     * @param {Number|String|Date} origVal original value, value passed from the table. What will be compared to.
     * @param {Integer} op operator, can either be !==, ===, <, <=, >, >=, 'contains' or 'does not contain', however converted to numbers stretching from 0 - 7, representing each a state.
     * @param {Number|String|Date} compVal the value (from the filter) that will be used to compare the table values to.
     * @return {Boolean}
     */
    UtilsAlarm._getFilterStatement = function (origVal, op, compVal) {
        var retValRow;

        if (origVal instanceof Date) {
            origVal = origVal.getTime();
            compVal = compVal.getTime();
        }

        if (typeof origVal === 'number') {
            compVal = parseInt(compVal);
        }

        switch (op) {
            case 0:
                retValRow = (origVal !== compVal);
                break;

            case 1:
                retValRow = (origVal === compVal);
                break;

            case 2:
                retValRow = (origVal < compVal);
                break;

            case 3:
                retValRow = (origVal <= compVal);
                break;

            case 4:
                retValRow = (origVal > compVal);
                break;

            case 5:
                retValRow = (origVal >= compVal);
                break;

            case 6:
                retValRow = (typeof (origVal) !== 'string') ? false : (origVal.indexOf(compVal) !== -1);
                break;

            case 7:
                retValRow = (typeof (origVal) !== 'string') ? false : (origVal.indexOf(compVal) === -1);
                break;

            default:
                retValRow = true;
        }
        return retValRow;
    };

    /**
     * @method _fixTimestamp
     * @private
     * takes the a string representing a timestamp and turns it into a JavaScript datetime object that can be used to filter on timestamp
     * @param {String} tim Date represented as a string value as passed by the server. Should be on format YYYY-MM-DDThh:mm:ssZ (ISO8601)
     * @return {Date}
     */
    UtilsAlarm._fixTimestamp = function (tim, f) {
        var d = new Date(tim);

        if (f.indexOf('f') !== -1) {
            //eslint-disable-next-line no-self-assign
            d = d;
        } else if (f.indexOf('s') !== -1 || f.indexOf('T') !== -1) {
            d.setMilliseconds(0);
        } else if (f.indexOf('m') !== -1 || (f.indexOf('t') !== -1 && f.length === 1)) {
            d.setMilliseconds(0);
            d.setSeconds(0);
        } else if (f.indexOf('H') !== -1 || f.indexOf('h') !== -1) {
            d.setMilliseconds(0);
            d.setSeconds(0);
            d.setMinutes(0);
        } else if (f.indexOf('d') !== -1 || f.indexOf('D') !== -1 || (f.indexOf('M') !== -1 && f.length === 1)) {
            d.setMilliseconds(0);
            d.setSeconds(0);
            d.setMinutes(0);
            d.setHours(0);
        } else if (f.indexOf('M') !== -1 || f.indexOf('Y') !== -1) {
            d.setMilliseconds(0);
            d.setSeconds(0);
            d.setMinutes(0);
            d.setHours(0);
            d.setDate(0);
        } else if (f.indexOf('y') !== -1) {
            d.setMilliseconds(0);
            d.setSeconds(0);
            d.setMinutes(0);
            d.setHours(0);
            d.setDate(0);
            d.setMonth(0);
        }
        return d;
    };

    /**
     * @method formatTimestampOfAlarm
     * Function takes an alarm and a timestamp format, formats the timestamp of the alarm and returns it
     * @param {Object} alarm
     * @param {String} format
     * @return {Object} the returned object is alarm with the timestamp formatted
     */
    UtilsAlarm.formatTimestampOfAlarm = function (a, format) {
        if (a === undefined) { return {}; }

        var alarm = $.extend(true, {}, a);

        var d = new Date(alarm.tim.substring(0, 23));
        DateFormatter.format(d, format, function (result) {
            alarm.tim = result;
        });
        return alarm;
    };

    /**
     * @method fixAlarmImages
     * Adds the images on the alarm from the properties set by the settings
     * @param {Object} alarm alarm that is to be manipulated 
     * @param {Object} state the entire state object
     * @param {String} state.imagePrefix path to the directory of where all category images are stored
     * @param {String} state.imageSuffix image type 
     * @param {String} state.imageActive path to the image used if an alarm is of status active
     * @param {String} state.imageActiveAcknowledged path to the image used if an alarm is of status active acknowledged
     * @param {String} state.imageInactive path to the image used if an alarm is of status inactive
     * @returns {Object} the returned object is alarm with the images to be displayed
     */
    UtilsAlarm.fixAlarmImages = function (a, state) {
        if (a === undefined) { return {}; }
        var alarm = $.extend(true, {}, a);

        if (brease.config.editMode) {
            alarm.cat = 'widgets/brease/AlarmLine/assets/' + alarm.cat + '.svg';
        } else {
            alarm.cat = state.imagePrefix + alarm.cat + state.imageSuffix;
        }
        switch (alarm.sta) {
            case 1:
                alarm.sta = (state.imageActive === '') ? 'widgets/brease/AlarmList/assets/act_nack.svg' : state.imageActive;
                break;
            case 2:
                alarm.sta = (state.imageActiveAcknowledged === '') ? 'widgets/brease/AlarmList/assets/act_ack.svg' : state.imageActiveAcknowledged;
                break;
            case 3:
                alarm.sta = (state.imageInactive === '') ? 'widgets/brease/AlarmList/assets/nact_nack.svg' : state.imageInactive;
                break;
            default:
                alarm.sta = '';
        }
        return alarm;
    };

    /**
     * @method uniqueAlarm
     * Function takes a list of alarms (filtered and sorted), the current position and also the unique value of an alarm to be shown. Returns a match if the unique 
     * value exists in the data set, else an empty object. If the unique value is an empty object it returns the alarm on the position given by the position parameter.
     * @param {Object[]} alarmlist
     * @param {Object} unique
     * @return {Object}
     */
    UtilsAlarm.uniqueAlarm = function (alarmlist, unique) {
        if (Object.keys(unique).length === 0 && unique.constructor === Object) {
            return alarmlist;
        }

        var key = Object.keys(unique)[0], uniqueAlarms = [];

        if (unique[key] === undefined || (unique[key] === -1 && key === 'res')) {
            return alarmlist;
        }

        for (var j = 0; j < alarmlist.length; j += 1) {
            if (alarmlist[j][key] === unique[key]) {
                uniqueAlarms.push(alarmlist[j]);
            }
        }
        return uniqueAlarms;
    };
    // compares style configurations and returns the configured
    // style if the severity matches the conditions otherwise it returns an empty string
    function _getStyleFromConfig(severity, styleConfig) {
        var severityConfig = styleConfig.sevOneUse << 0 ^ styleConfig.sevTwoUse << 1,
            styleName = 'style' + styleConfig.namePos; // name of the style defined in the config
        switch (severityConfig) {
            case 1: // sevOneUse
                styleName = UtilsAlarm._getFilterStatement(severity, styleConfig.sevOnePos, styleConfig.sevOne) ? styleName : '';
                break;
            case 2: // sevTwoUse
                styleName = UtilsAlarm._getFilterStatement(severity, styleConfig.sevTwoPos, styleConfig.sevTwo) ? styleName : '';
                break;
            case 3: // sevOneUse and sevTwoUse
                // AND condition
                if (styleConfig.sevTwoOp === 0) {
                    styleName = UtilsAlarm._getFilterStatement(severity, styleConfig.sevOnePos, styleConfig.sevOne) &&
                        UtilsAlarm._getFilterStatement(severity, styleConfig.sevTwoPos, styleConfig.sevTwo) ? styleName : '';
                } else { // OR condition
                    styleName = UtilsAlarm._getFilterStatement(severity, styleConfig.sevOnePos, styleConfig.sevOne) ||
                        UtilsAlarm._getFilterStatement(severity, styleConfig.sevTwoPos, styleConfig.sevTwo) ? styleName : '';
                }
                break;
            default: // no severity conditions => return styleName from config
        }
        return styleName;
    }
    return UtilsAlarm;

});
