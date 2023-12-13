define([], function () {
    'use strict';
    function DialogueTexts() {
        return {
            en: {
                filter: {
                    title: 'Configuration dialog to filter alarms',
                    col: 'Column',
                    op: 'Operator',
                    val: 'Value',
                    state: 'and state is',
                    act: 'active',
                    inact: 'inactive',
                    actack: 'active acknowledged',
                    inactack: 'inactive acknowledged',
                    and: 'and',
                    or: 'or'
                },
                style: {
                    title: 'Configuration dialogue to style alarms',
                    style: 'Set style',
                    state: 'if alarm is',
                    act: 'active',
                    inact: 'inactive',
                    actack: 'active acknowledge',
                    any: 'any',
                    sev: 'and severity condition',
                    and: 'and',
                    or: 'or'
                }
            },
            de: {
                filter: {
                    title: 'Konfigurationsdialog zum Filtern von Alarmen',
                    col: 'Spalte',
                    op: 'Operator',
                    val: 'Wert',
                    state: 'und Status ist',
                    and: 'und',
                    or: 'oder',
                    act: 'aktiv',
                    inact: 'inaktiv',
                    actack: 'aktiv bestätigt',
                    inactack: 'inaktiv bestätigt'
                },
                style: {
                    title: 'Konfigurationsdialog zum Stylen von Alarmen',
                    style: 'Style festlegen',
                    state: 'wenn Alarm ist',
                    act: 'aktiv',
                    inact: 'inaktiv',
                    actack: 'aktiv bestätigt',
                    any: 'alle',
                    sev: 'und Schweregrad ist',
                    and: 'und',
                    or: 'oder'
                }
            }
        };
    }
    
    return new DialogueTexts();
});
