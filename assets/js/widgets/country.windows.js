visax.window.CreateCountry = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'visax-window-create-country';
    }
    Ext.applyIf(config, {
        title: _('visax.create_el'),
        width: 550,
        autoHeight: true,
        layout: 'anchor',
        url: visax.config.connectorUrl,
        action: 'mgr/country/create',
        fields: [{
            xtype: 'hidden',
	        id: config.id + '-id',
            name: 'id'
        }, {
            xtype: 'textfield',
            fieldLabel: _('visax.name'),
            name: 'name',
            id: config.id + '-name',
            anchor: '99%',
            allowBlank: false,
            inputValue: 0
        }, {
            xtype: 'textfield',
            fieldLabel: _('visax.key'),
            name: 'key',
            id: config.id + '-key',
            anchor: '99%',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: _('visax.sign'),
            name: 'sign',
            id: config.id + '-sign',
            anchor: '33%',
            allowBlank: false
        }, {
            xtype: 'numberfield',
            boxLabel: _('visax.rank'),
            name: 'rank',
            id: config.id + '-rank',
            anchor: '33%',
            allowBlank: true
            // inputValue: 0
        }, {
            xtype: 'xcheckbox',
            fieldLabel: _('visax.public'),
            name: 'public',
            id: config.id + '-public',
            checked: false,
            anchor: '33%',
            allowBlank: true,
            inputValue: 1
        }],
        keys: [{
            key: Ext.EventObject.ENTER,
            shift: true,
            fn: function() {
                this.submit();
            },
            scope: this
        }]
    });
    visax.window.CreateCountry.superclass.constructor.call(this, config);
};
Ext.extend(visax.window.CreateCountry, MODx.Window);
Ext.reg('visax-window-create-country', visax.window.CreateCountry);


visax.window.UpdateCountry = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'visax-window-update-country';
    }
    Ext.applyIf(config, {
        title: _('visax_update_el'),
        action: 'mgr/country/update',
        buttons: [{
            text: config.cancelBtnText || _('cancel'),
            scope: this,
            handler: function() { this.hide(); }
        }, {
            text: config.saveBtnText || _('save'),
            scope: this,
            handler: function() { this.submit(false); }
        }, {
            text: config.saveBtnText || _('save_and_close'),
            cls: 'primary-button',
            scope: this,
            handler: this.submit
        }]
    });
    visax.window.UpdateCountry.superclass.constructor.call(this, config);
};
Ext.extend(visax.window.UpdateCountry, visax.window.CreateCountry);
Ext.reg('visax-window-update-country', visax.window.UpdateCountry);


// visax.window.CountryUpdate = function(config) {
//     config = config || {};
//     Ext.applyIf(config, {
//         title: _('visax.edit'),
//         url: visax.config.connectorUrl,
//         baseParams: {
//             action: 'mgr/country/update'
//         },
//         width: 400,
//         fields: [{
//             xtype: 'hidden',
//             name: 'countries'
//         }, {
//             xtype: 'modx-combo-category',
//             id: 'visax-country-category-combo',
//             fieldLabel: _('visax.category'),
//             name: 'category',
//             hiddenName: 'category',
//             anchor: '90%'
//         }]
//     });
//     visax.window.CountryUpdate.superclass.constructor.call(this, config);
// };
// Ext.extend(visax.window.CountryUpdate, MODx.Window);
// Ext.reg('visax-window-update-country', visax.window.CountryUpdate);
