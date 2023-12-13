define([
    'widgets/brease/common/libs/redux/reducers/Text/TextActions',
    'widgets/brease/common/libs/redux/reducers/Image/ImageActions',
    'widgets/brease/common/libs/redux/reducers/Status/StatusActions',
    'widgets/brease/common/libs/redux/reducers/Size/SizeActions',
    'widgets/brease/common/libs/redux/reducers/List/ListActions',
    'widgets/brease/common/libs/redux/reducers/Style/StyleActions',
    './AlarmLineReducer/AlarmLineAction'
], function (TextActions, ImageActions, StatusActions, SizeActions, ListActions, StyleActions, AlarmLineAction) {

    'use strict';

    var AlarmLineActions = _.assign({}, TextActions, ImageActions, StatusActions, SizeActions, ListActions, StyleActions, AlarmLineAction);

    return AlarmLineActions;

});
