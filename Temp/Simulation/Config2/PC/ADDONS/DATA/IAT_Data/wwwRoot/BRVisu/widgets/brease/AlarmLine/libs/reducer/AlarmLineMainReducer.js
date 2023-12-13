define([
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineReducer/AlarmLineReducer',
    'widgets/brease/AlarmLine/libs/reducer/AlarmLineConfigReducer/AlarmLineConfigReducer',
    'widgets/brease/common/libs/redux/reducers/Text/TextReducer',
    'widgets/brease/common/libs/redux/reducers/Image/ImageReducer',
    'widgets/brease/common/libs/redux/reducers/Status/StatusReducer',
    'widgets/brease/common/libs/redux/reducers/Size/SizeReducer',
    'widgets/brease/common/libs/redux/reducers/List/ListReducer',
    'widgets/brease/common/libs/redux/reducers/Style/StyleReducer',
    'widgets/brease/common/libs/redux/reducers/DataHandler/DataHandlerReducer',
    'widgets/brease/common/libs/external/redux'
], function (AlarmLineReducer, AlarmLineConfigReducer, TextReducer, ImageReducer, StatusReducer, SizeReducer, ListReducer, StyleReducer, DataHandler, Redux) {

    'use strict';

    return Redux.combineReducers({
        alarmConfiguration: AlarmLineConfigReducer,
        alarm: AlarmLineReducer,
        text: TextReducer,
        items: ListReducer,
        image: ImageReducer,
        status: StatusReducer,
        size: SizeReducer,
        style: StyleReducer,
        dataHandler: DataHandler
    });

});
