define([
    'brease/core/Class'
], function (SuperClass) {

    'use strict';

    /** 
     * @class widgets.brease.AlarmLine.libs.reducer.AlarmLineAction
     * Class for storing all actions for the reducer to be used.
     */

    /**
     * @method previousAlarm
     * @return {Object} type: String
     */
    
    /**
     * @method nextAlarm
     * @return {Object} type: String
     */
    
    /**
     * @method lastAlarm
     * @return {Object} type: String
     */
    
    /**
     * @method firstAlarm
     * @return {Object} type: String
     */
    
    /**
     * @method filterConfigChanged
     * @param {Array} filter new filter configuration to be used
     * @return {Object} type: String, filter: new filter configuration
     */

    /**
     * @method styleConfigChanged
     * @param {Array} style new style configuration to be used
     * @return {Object} type: String, style: new style configuration
     */

    /**
     * @method sortConfigChanged
     * @param {String} sort string describing the new sorting to be used (descending/ascending)
     * @return {Object} type: String, sort: new sort direction
     */
    
    /**
     * @method updateData
     * @param {Array} data data sent by the backend to be processed by the reducer before going to the AlarmLineView
     * @return {Object} type: String, data: data from backend
     */
    
    /**
     * @method updateFormat
     * @return {Object} type: String
     */
    
    /**
     * @method showSelection
     * @param {Object} obj object containing information about which type of selection is to be made, can be one of three below
     * @param {UInteger} obj.ins if selection is made with instanceId
     * @param {UInteger} obj.cod if selection is made with code
     * @param {String} obj.nam if selection is made with name
     * @return {Object} type: String
     */
    
    /**
     * @method updateChildren
     * @return {Object} type: String
     */
    
    /**
     * @method updateInactiveImage
     * @param {String} image image path to the image that is to be used together with alarms of the type Inactive
     * @return {Object} type: String, image: String
     */
    
    /**
     * @method updateActiveImage
     * @param {String} image image path to the image that is to be used together with alarms of the type Active
     * @return {Object} type: String, image: String
     */
    
    /**
     * @method updateActiveAcknowledged
     * @param {String} image image path to the image that is to be used together with alarms of the type ActiveAcknowledged
     * @return {Object} type: String, image: String
     */
    
    /**
     * @method updateImagePrefix
     * @param {String} prefix image prefix (ImageDirectory) to be used toghether with the category. (see Enum.ImageDirectory)
     * @return {Object} type: String, prefix: Enum.ImageDirectory
     */
    
    /**
     * @method updateImageSuffix
     * @param {String} suffix image suffix to be used toghether with the category. (see Enum.ImageType)
     * @return {Object} type: String, prefix: Enum.ImageType
     */
    
    /**
     * @method updateCategories
     * @param {String[]} cats list of categories available as passed by the backend
     * @return {Object} type: String, categories: list of categories
     */

    var AlarmLineActions = {
        PREVIOUS_ALARM: 'PREVIOUS_ALARM',
        previousAlarm: function previousAlarm() {
            return {
                type: AlarmLineActions.PREVIOUS_ALARM
            };
        },
        NEXT_ALARM: 'NEXT_ALARM',
        nextAlarm: function nextAlarm() {
            return {
                type: AlarmLineActions.NEXT_ALARM
            };
        },
        LAST_ALARM: 'LAST_ALARM',
        lastAlarm: function lastAlarm() {
            return {
                type: AlarmLineActions.LAST_ALARM
            };
        },
        FIRST_ALARM: 'FIRST_ALARM',
        firstAlarm: function firstAlarm() {
            return {
                type: AlarmLineActions.FIRST_ALARM
            };
        },
        // When the filter configuration has changed
        FILTER_CONFIG_CHANGED: 'FILTER_CONFIG_CHANGED',
        filterConfigChanged: function filterConfigChanged(filter) {
            return {
                type: AlarmLineActions.FILTER_CONFIG_CHANGED,
                filter: filter
            };
        },
        // When the style configuration has changed
        STYLE_CONFIG_CHANGED: 'STYLE_CONFIG_CHANGED',
        styleConfigChanged: function styleConfigChanged(style) {
            return {
                type: AlarmLineActions.STYLE_CONFIG_CHANGED,
                style: style
            };
        },
        // When the sorting configuration has changed
        SORT_CONFIG_CHANGED: 'SORT_CONFIG_CHANGED',
        sortConfigChanged: function sortConfigChanged(sort) {
            return {
                type: AlarmLineActions.SORT_CONFIG_CHANGED,
                sort: sort
            };
        },
        // When new data arrives from the backend
        UPDATE_DATA: 'UPDATE_DATA',
        updateData: function updateData(data) {
            return {
                type: AlarmLineActions.UPDATE_DATA,
                data: data
            };
        },
        // Updates when the datetime format has changed
        UPDATE_DATETIME_FORMAT: 'UPDATE_DATETIME_FORMAT',
        updateFormat: function updateFormat(f) {
            return {
                type: AlarmLineActions.UPDATE_DATETIME_FORMAT,
                format: f
            };
        },
        // Updates when the ShowByCode/ value has updated
        UPDATE_SHOW_BY_SELECTION: 'UPDATE_SHOW_BY_SELECTION',
        showSelection: function showSelection(obj) {
            return {
                type: AlarmLineActions.UPDATE_SHOW_BY_SELECTION,
                obj: obj
            };
        },
        UPDATE_CHILDREN: 'UPDATE_CHILDREN',
        updateChildren: function updateChildren() {
            return {
                type: AlarmLineActions.UPDATE_CHILDREN
            };
        },
        UPDATE_INACTIVE_IMAGE: 'UPDATE_INACTIVE_IMAGE',
        updateInactiveImage: function updateInactiveImage(image) {
            return {
                type: AlarmLineActions.UPDATE_INACTIVE_IMAGE,
                image: image
            };
        },
        UPDATE_ACTIVE_IMAGE: 'UPDATE_ACTIVE_IMAGE',
        updateActiveImage: function updateActiveImage(image) {
            return {
                type: AlarmLineActions.UPDATE_ACTIVE_IMAGE,
                image: image
            };
        },
        UPDATE_ACTIVE_ACK_IMAGE: 'UPDATE_ACTIVE_ACK_IMAGE',
        updateActiveAcknowledged: function updateActiveAcknowledged(image) {
            return {
                type: AlarmLineActions.UPDATE_ACTIVE_ACK_IMAGE,
                image: image
            };
        },
        UPDATE_IMAGE_PREFIX: 'UPDATE_IMAGE_PREFIX',
        updateImagePrefix: function updateImagePrefix(prefix) {
            return {
                type: AlarmLineActions.UPDATE_IMAGE_PREFIX,
                prefix: prefix
            };
        },
        UPDATE_IMAGE_SUFFIX: 'UPDATE_IMAGE_SUFFIX',
        updateImageSuffix: function updateImageSuffix(suffix) {
            return {
                type: AlarmLineActions.UPDATE_IMAGE_SUFFIX,
                suffix: suffix
            };
        },
        UPDATE_CATEGORIES: 'UPDATE_CATEGORIES',
        updateCategories: function updateCategories(cats) {
            return {
                type: AlarmLineActions.UPDATE_CATEGORIES,
                categories: cats
            };
        }
    };

    return AlarmLineActions;

});
