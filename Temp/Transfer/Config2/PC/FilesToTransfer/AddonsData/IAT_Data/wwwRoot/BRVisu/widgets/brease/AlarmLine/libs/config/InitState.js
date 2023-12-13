define([], function () {

    'use strict';

    var InitState = {};

    /** 
     * @class widgets.brease.AlarmLine.libs.config.InitState
     * static class for 
     */

    /**
     * @method calculateInitState
     * @static
     * @param {Object} settings settings (JavaScript object described below)
     * @param {String} settings.format format (use Brease formatting for timestamps)
     * @param {String} settings.sortOrder sortOrder either descending or ascending (defualt: descending)
     * @param {String} settings.imageActive imageActive - path to where the image of an active alarm icon is stored
     * @param {String} settings.imageActiveAcknowledged imageActiveAcknowledged - path to where the image of an active acknowledged alarm icon is stored
     * @param {String} settings.imageInactive imageInactive - path to where the image of an inactive alarm icon is stored
     * @param {String} settings.imagePrefix imagePrefix - the prefix, i.e. the path to the directory, of where the category icons are stored 
     * @param {String} settings.imageSuffix imageSuffix - the suffix of the image (i.e. the type - use brease ImageType), default: '.png'
     * @param {Boolean} settings.multiLine multiline - if true multiline is used, false not used
     * @param {Boolean} settings.wordWrap wordwrap - if true wordwrap is used, false not
     * @param {Boolean} settings.ellipsis ellipsis true for using ellipsis (...) false for not
     * @param {String|Integer} settings.width width (either passed as '30px' or 30)
     * @param {String|Integer} settings.height height (either passed as '30px' or 30)
     * @param {Boolean} enabled enabled - true for enabled, false for disabled
     * @param {Boolean} visible visisble - true for visible and false for invisible
     * @return {Object}
     */

    InitState.calculateInitState = function (settings, enabled, visible) {
        
        var initState = {};

        initState.alarmConfiguration = {
            items: []
        };
        
        initState.alarm = {
            alarm: {},
            code: -1,
            position: 0,
            data: [{
                ins: 0,
                cod: 20000,
                nam: 'Alarm1',
                mes: 'This is also a mocked alarm and in no way real',
                sco: 560,
                sev: 100,
                sta: 3,
                tim: '1970-01-01T00:01:00Z',
                ad1: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                ad2: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
                cat: 'cat2'
            }, {
                ins: 1, 
                cod: 20000,
                nam: 'Alarm2',
                mes: 'This is a mocked alarm and in no way real',
                sco: 140,
                sev: 200,
                sta: 2,
                tim: '1970-01-01T00:01:00Z',
                ad1: 'Here you can add some additional information for this alarm if you want to. You can do it in the MapAlarmX configuration under Additional Information 1.',
                ad2: 'Here you can add some more additional information for this alarm if you want to. You can do it in the MapAlarmX configuration under Additional Information 2.',
                cat: 'cat1'
            }],
            preprocessedData: [],
            categories: [],
            format: settings.format,
            filter: [], //'[{"value":"30","conditionType":"<","columnType":"ins","useAlarmState":false,"alarmState":0}]',
            style: [],
            styleName: '',
            sort: settings.sortOrder,
            imageActive: (settings.imageActive.length > 0) ? settings.imageActive : 'widgets/brease/AlarmList/assets/act_nack.svg',
            imageActiveAcknowledged: (settings.imageActiveAcknowledged.length > 0) ? settings.imageActiveAcknowledged : 'widgets/brease/AlarmList/assets/act_ack.svg',
            imageInactive: (settings.imageInactive.length > 0) ? settings.imageInactive : 'widgets/brease/AlarmList/assets/nact_nack.svg',
            imagePrefix: settings.imagePrefix,
            imageSuffix: settings.imageSuffix
        };

        initState.text = {
            text: 'Test',
            textSettings: {
                multiLine: settings.multiLine,
                wordWrap: settings.wordWrap,
                ellipsis: settings.ellipsis
            }
        };

        initState.status = {
            enabled: enabled,
            visible: visible,
            active: true
        };

        initState.size = {
            height: settings.height,
            width: settings.width
        };

        initState.dataHandler = {
            childrenInitialized: false,
            childrenList: [],
            childrenIdList: []
        };

        return initState;
    };

    return InitState;

});
