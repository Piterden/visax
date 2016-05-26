visax.window.CreateSession = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'visax-window-create-session';
    }
    Ext.applyIf(config, {
        title: _('visax.create_el'),
        width: 550,
        autoHeight: true,
        layout: 'anchor',
        url: visax.config.connectorUrl,
        action: 'mgr/session/create',
        fields: [{
            xtype: 'hidden',
	        id: config.id + '-id',
            name: 'id'
        }, {
            xtype: 'visax-combo-country',
            fieldLabel: _('visax.country'),
            name: 'country',
            id: config.id + '-country',
            anchor: '50%',
            allowBlank: true,
            defaultValue: 0
        }, {
            xtype: 'visax-combo-currency',
            fieldLabel: _('visax.currency'),
            name: 'currency',
            id: config.id + '-currency',
            anchor: '50%',
            allowBlank: true,
            defaultValue: 0
        }, {
            xtype: 'textfield',
            fieldLabel: _('visax.phone'),
            name: 'phone',
            id: config.id + '-phone',
            anchor: '50%',
            allowBlank: true
        }, {
            xtype: 'textfield',
            fieldLabel: _('visax.email'),
            name: 'email',
            id: config.id + '-email',
            anchor: '50%',
            allowBlank: false
        }, {
            xtype: 'xdatetime',
            fieldLabel: _('visax.createdon'),
            name: 'createdon',
            id: config.id + '-createdon',
            anchor: '50%',
            allowBlank: true
        }, {
            xtype: 'xdatetime',
            fieldLabel: _('visax.editedon'),
            name: 'editedon',
            id: config.id + '-editedon',
            anchor: '50%',
            allowBlank: true
        }, {
            xtype: 'numberfield',
            boxLabel: _('visax.persons_count'),
            name: 'persons_count',
            id: config.id + '-persons_count',
            anchor: '20%',
            allowBlank: true
        }, {
            xtype: 'statictextfield',
            boxLabel: _('visax.url_hash'),
            name: 'url_hash',
            id: config.id + '-url_hash',
            anchor: '100%'
        }, {
            xtype: 'radiogroup',
            fieldLabel: _('visax.state'),
            name: 'state',
            id: config.id + '-state',
            allowBlank: true
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
    visax.window.CreateSession.superclass.constructor.call(this, config);
};
Ext.extend(visax.window.CreateSession, MODx.Window);
Ext.reg('visax-window-create-session', visax.window.CreateSession);


visax.window.UpdateSession = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'visax-window-update-session';
    }
    Ext.applyIf(config, {
        title: _('visax.create_el'),
        action: 'mgr/session/update',
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
    visax.window.UpdateSession.superclass.constructor.call(this, config);
};
Ext.extend(visax.window.UpdateSession, visax.window.CreateSession);
Ext.reg('visax-window-update-session', visax.window.UpdateSession);


// visax.window.SessionUpdate = function(config) {
//     config = config || {};
//     Ext.applyIf(config, {
//         title: _('visax.session_edit'),
//         url: visax.config.connectorUrl,
//         baseParams: {
//             action: 'mgr/session/update'
//         },
//         width: 400,
//         fields: [{
//             xtype: 'hidden',
//             name: 'sessions'
//         }, {
//             xtype: 'modx-combo-category',
//             id: 'visax-session-category-combo',
//             fieldLabel: _('visax.category'),
//             name: 'category',
//             hiddenName: 'category',
//             anchor: '90%'
//         }]
//     });
//     visax.window.SessionUpdate.superclass.constructor.call(this, config);
// };
// Ext.extend(visax.window.SessionUpdate, MODx.Window);
// Ext.reg('visax-window-update-session', visax.window.SessionUpdate);
