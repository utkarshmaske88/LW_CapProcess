define([
    'widgets/brease/TableWidget/libs/Dialogue',
    'widgets/brease/AlarmList/libs/FilterSettings',
    'widgets/brease/AlarmList/libs/StylingSettings',
    'widgets/brease/AlarmLine/libs/utils/DialogueTexts',
    'widgets/brease/TableWidget/libs/TextRetriever'
], function (SuperClass, Filter, Style, Texts, TextRetriever) {
    
    'use strict';

    /** 
     * @class widgets.brease.AlarmLine.libs.utils.Dialogue
     * Class for handling the setting up of the Configuration Dialogue.
     * For the AlarmLine it is only possible to open the filter configuration
     * as there is no need to style individual alarms when only one is displayed at the time,
     * and the sorting is done via other methods.
     */

    /**
     * @method constructor
     * constructor to set up the class Dialogue used by the AlarmLine
     */
    var DialogueClass = SuperClass.extend(function Dialogue() {
            SuperClass.apply(this, arguments);
        }, null),

        p = DialogueClass.prototype;

    /**
     * @method initialize
     * @param {String} type which type of dialog should be instantiated 
     * @param {String} lang the language to be used
     * @returns {Object}
     */
    p.initialize = function (type) {
        switch (type) {
            case 'filter':
                this.filter = new Filter(this.dialog, this.widget, this.actualLang, this.widget.settings.categories, Texts[this.lang][type]);
                break;
            case 'style':
                this.style = new Style(this.dialog, this.widget, this.actualLang, Texts[this.lang][type]);
                break;
        }
        this._initializeEmptyDialogConfig(Texts[this.lang][type].title);
        return this.config;
    };
    
    /**
     * @method setUpTexts
     * This method will set up all text keys necessary to instantiate the dialogue
     * @param {Promise} def a deferred object used to retrieve the texts from the asynchronous function
     * @param {String} lang the language currently in use
     * @param {String} fallbackLang the fallback language to use if current language is missing
     * @param {String} type the type of the Dialog window, valid values are filter, style or order
     */
    p.setUpTexts = function (def, lang, fallbackLang, type) {
        this.texts = TextRetriever.getTexts(lang, Texts[fallbackLang], 'AlarmLine', type, this, def);
    };

    return DialogueClass;
});
