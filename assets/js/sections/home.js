/**
 * JS file for visax extra
 *
 * @package visax
 */

/* These are for LexiconHelper:
 $modx->lexicon->load('visax:default');
 include 'visax.class.php'
 */

Ext.onReady(function() {
    MODx.load({ xtype: 'visax-page-home' });
});

visax.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
            xtype: 'visax-panel-home',
            renderTo: 'visax-panel-home-div'
        }]
    });
    visax.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(visax.page.Home, MODx.Component);
Ext.reg('visax-page-home', visax.page.Home);
