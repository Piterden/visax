/**
 * JS file for visax extra
 *
 * @package visax
 */

/* These are for LexiconHelper:
 $modx->lexicon->load('visax:default');
 include 'visax.class.php'
 */

visax.panel.Home = function(config) {
    config = config || {};
    Ext.apply(config, {
        border: false,
        baseCls: 'modx-formpanel',
        items: [{
            html: '<h2>' + 'visax' + '</h2>',
            border: false,
            cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs',
            bodyStyle: 'padding: 10px',
            defaults: { border: false, autoHeight: true },
            border: true,
            stateful: true,
            stateId: 'visax-home-tabpanel',
            stateEvents: ['tabchange'],
            getState: function() {
                return { activeTab: this.items.indexOf(this.getActiveTab()) };
            },
            items: [{
                title: _('visax.persons'),
                defaults: { autoHeight: true },
                items: [{
                    html: _('visax.persons_desc'),
                    border: false,
                    bodyStyle: 'padding: 10px'
                }, {
                    xtype: 'visax-grid-person',
                    preventRender: true
                }]
            }, {
                title: _('visax.sessions'),
                defaults: { autoHeight: true },
                items: [{
                    html: _('visax.sessions_desc'),
                    border: false,
                    bodyStyle: 'padding: 10px'
                }, {
                    xtype: 'visax-grid-session',
                    preventRender: true
                }]
            }, {
                title: _('visax.countries'),
                defaults: { autoHeight: true },
                items: [{
                    html: '<p>' + _('visax.countries_desc') + '</p>',
                    border: false,
                    bodyStyle: 'padding: 10px'
                }, {
                    xtype: 'visax-grid-country',
                    preventRender: true
                }]
            }/*, {
                title: _('visax.currencies'),
                defaults: { autoHeight: true },
                items: [{
                    html: '<p>' + 'Demo only . . . grid will change, but no real action is taken' + '</p>',
                    border: false,
                    bodyStyle: 'padding: 10px'
                }, {
                    xtype: 'visax-grid-currency',
                    preventRender: true
                }]
            }, {
                title: _('visax.rates'),
                defaults: { autoHeight: true },
                items: [{
                    html: '<p>' + 'Demo only . . . grid will change, but no real action is taken' + '</p>',
                    border: false,
                    bodyStyle: 'padding: 10px'
                }, {
                    xtype: 'visax-grid-rate',
                    preventRender: true
                }]
            }, {
                title: _('visax.rate_sources'),
                defaults: { autoHeight: true },
                items: [{
                    html: '<p>' + 'Demo only . . . grid will change, but no real action is taken' + '</p>',
                    border: false,
                    bodyStyle: 'padding: 10px'
                }, {
                    xtype: 'visax-grid-source',
                    preventRender: true
                }]
            }*/]
        }]
    });
    visax.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(visax.panel.Home, MODx.Panel);
Ext.reg('visax-panel-home', visax.panel.Home);
