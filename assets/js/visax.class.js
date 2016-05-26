/**
* JS file for visax extra
*
* @package visax
*/

var visax = function (config) {
    config = config || {};
    visax.superclass.constructor.call(this, config);
};
Ext.extend(visax, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}
});
Ext.reg('visax', visax);

var visax = new visax();
