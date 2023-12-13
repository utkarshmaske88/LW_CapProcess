define([
    'brease/enum/Enum'
], function (Enum) {

    'use strict';

    /**
    * @class widgets.brease.AlarmLine.libs.config.Config
    * @extends core.javascript.Object
    * @override widgets.brease.AlarmLine
    */

    /**
     * @cfg {Boolean} ellipsis=false
     * @iatStudioExposed
     * @iatCategory Behavior
     * If true, overflow of text is symbolized with an ellipsis. This option has no effect if wordWrap = true.
     */

    /**
     * @cfg {Boolean} wordWrap=true
     * @iatStudioExposed
     * @iatCategory Behavior
     * when true, text will wrap when necessary.
     */

    /**
     * @cfg {Boolean} multiLine=true
     * @iatStudioExposed
     * @iatCategory Behavior
     * When true, more than one line is possible. Text will wrap when necessary (wordWrap=true) or at line breaks (\n).
     * If false, text will never wrap to the next line. The text continues on the same line.
     */

    /**
    * @cfg {DirectoryPath} imagePrefix=''
    * @iatStudioExposed
    * @iatCategory Appearance
    * Path to the image used for the images in the category. The image names have to specifed in the backend at the MpAlarmX. See help for more information.
    */

    /**
    * @cfg {ImageType} imageSuffix='.png'
    * @iatStudioExposed
    * @iatCategory Appearance
    * File extension used for the images in the category. The image names have to specifed in the backend at the MpAlarmX. See help for more information.
    */

    /**
    * @cfg {ImagePath} imageActive=''
    * @iatStudioExposed
    * @iatCategory Appearance
    * Path to the image used for state "Active / Not-Acknowledged". If no image is defined, a predefined image will be used.
    */

    /**
    * @cfg {ImagePath} imageActiveAcknowledged=''
    * @iatStudioExposed
    * @iatCategory Appearance
    * Path to the image used for state "Active / Acknowledged". If no image is defined, a predefined image will be used.
    */

    /**
    * @cfg {ImagePath} imageInactive=''
    * @iatStudioExposed
    * @iatCategory Appearance
    * Path to the image used for state "Inactive / Not-Acknowledged". If no image is defined, a predefined image will be used.
    */
   
    /**
    * @cfg {brease.enum.SortDirection} sortOrder='descending'
    * @iatStudioExposed
    * @iatCategory Appearance
    * Display the alarm in the AlarmLine with the name given if it exists in the dataset after it has been filtered.
    */
    
    /**
    * @cfg {MpComIdentType} mpLink=''
    * @iatStudioExposed
    * @bindable
    * @not_projectable
    * @iatCategory Data
    * Link to a MpAlarmX component
    */

    /**
    * @cfg {String} filterConfiguration=''
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * configuration used to set the filter for the AlarmLine, see the AlarmList for an example. Exact same string can be used for both AlarmList and AlarmLine.
    */

    /**
    * @cfg {String} styleConfiguration=''
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * configuration used to set the style for the AlarmLine, see the AlarmList for an example. Exact same string can be used for both AlarmList and AlarmLine.
    */

    /**
    * @cfg {String} format='F'
    * @localizable
    * @iatStudioExposed
    * @iatCategory Appearance
    * @bindable
    * Specifies the format of the time shown in the input field. This is either a format string (ee.g. "HH:mm") or a pattern ("F").
    */

    return {
        childrenIdList: [],
        childrenList: [],
        ellipsis: false,
        wordWrap: true,
        multiLine: true,
        sortOrder: Enum.SortDirection.DESC,
        format: 'F',
        formatKey: '',
        filterConfiguration: '',
        styleConfiguration: '',
        imagePrefix: '',
        imageSuffix: '.png',
        imageActive: '',
        imageInactive: '',
        imageActiveAcknowledged: '',
        mpLink: '',
        type: 'AlarmLine',
        config: {
            columnTypes: {
                ad1: 'str',
                ad2: 'str',
                cat: 'int',
                cod: 'int',
                ins: 'int',
                mes: 'str',
                nam: 'str',
                sco: 'str',
                sev: 'int',
                sta: 'int',
                tim: 'date'
            },
            columns: [],
            filter: [],
            style: []
        }
    };
});
