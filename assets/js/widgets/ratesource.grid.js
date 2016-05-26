/**
 * JS file for visax extra
 *
 * Copyright 2013 by Bob Ray <http://bobsguides.com>
 * Created on 04-13-2013
 *
 * visax is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * visax is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * visax; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 * @package visax
 */
/* These are for LexiconHelper:
 $modx->lexicon->load('visax:default');
 include 'visax.class.php'
 */

visax.grid.Ratesources = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config, {
        url: visax.config.connectorUrl,
        baseParams: {
            action: 'mgr/ratesource/getlist',
            thread: config.thread
        },
        pageSize: 300,
        fields: [
            { name: 'id', sortType: Ext.data.SortTypes.asInt }, { name: 'name', sortType: Ext.data.SortTypes.asUCString }, { name: 'category', sortType: Ext.data.SortTypes.asUCString }, { name: 'description' }
        ],
        paging: true,
        autosave: false,
        remoteSort: false,
        autoExpandColumn: 'description',
        cls: 'x-grid-panel',
        sm: this.sm,
        columns: [this.sm, {
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            width: 50
        }, {
            header: _('name'),
            dataIndex: 'name',
            sortable: true,
            width: 100
        }, {
            header: _('category'),
            dataIndex: 'category',
            sortable: true,
            width: 120
        }, {
            header: _('description'),
            dataIndex: 'description',
            sortable: false,
            width: 300
        }],
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            showPreview: true,
            getRowClass: function(rec, ri, p) {
                var cls = 'visax-row';

                if (this.showPreview) {
                    return cls + ' visax-resource-expanded';
                }
                return cls + ' visax-resource-collapsed';
            }
        },
        tbar: [{
            text: 'Bulk Actions',
            menu: this.getBatchMenu()
        }, { xtype: 'tbspacer', width: 200 }, {
            xtype: 'button',
            id: 'visax-ratesources-reload',
            text: 'reload',
            listeners: {
                'click': { fn: this.reloadRatesources, scope: this }
            }
        }]
    });
    visax.grid.Ratesources.superclass.constructor.call(this, config);
};
Ext.extend(visax.grid.Ratesources, MODx.grid.Grid, {
    reloadRatesources: function() {
        this.getStore().baseParams = {
            action: 'mgr/ratesource/getList',
            orphanSearch: 'modRatesource'
        };

        this.getBottomToolbar().changePage(1);
        this.refresh();

    },
    _showMenu: function(g, ri, e) {
        e.stopEvent();
        e.preventDefault();
        this.menu.record = this.getStore().getAt(ri).data;
        if (!this.getSelectionModel().isSelected(ri)) {
            this.getSelectionModel().selectRow(ri);
        }
        this.menu.removeAll();

        var m = [];
        if (this.menu.record.menu) {
            m = this.menu.record.menu;
            if (m.length > 0) {
                this.addContextMenuItem(m);
                this.menu.show(e.target);
            }
        } else {
            var z = this.getBatchMenu();

            for (var zz = 0; zz < z.length; zz++) {
                this.menu.add(z[zz]);
            }
            this.menu.show(e.target);
        }
    },
    getSelectedAsList: function() {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i = 0; i < sels.length; i++) {
            cs += ',' + sels[i].data.id;
        }
        cs = Ext.util.Format.substr(cs, 1);
        return cs;
    },
    changeCategory: function(btn, e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        var r = { ids: cs };
        if (!this.changeCategoryWindow) {
            this.changeCategoryWindow = MODx.load({
                xtype: 'visax-ratesource-window-change-category',
                record: r,
                listeners: {
                    'success': {
                        fn: function(r) {
                            // this.refresh();
                            var sels = this.getSelectionModel().getSelections();
                            var cat = Ext.getCmp('visax-ratesource-category-combo').lastSelectionText;
                            var s = this.getStore();
                            for (var i = 0; i < sels.length; i = i + 1) {
                                var id = sels[i].get('id');
                                var ri = id;
                                var record = s.getById(ri);
                                record.set("category", cat);
                                record.commit();
                            }
                            this.getSelectionModel().clearSelections(false);
                        },
                        scope: this
                    }
                }
            });
        }
        this.changeCategoryWindow.setValues(r);
        this.changeCategoryWindow.show(e.target);
        return true;
    },
    ratesourceRemove: function() {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;
        MODx.msg.confirm({
            title: _('visax.delete'),
            text: _('visax.confirm_delete'),
            url: this.config.url,
            params: {
                action: 'mgr/ratesource/remove',
                ids: cs
            },
            listeners: {
                'success': {
                    fn: function(r) {
                        // this.refresh();
                        var sels = this.getSelectionModel().getSelections();
                        if (sels.length <= 0) return false;
                        var s = this.getStore();
                        for (var i = 0; i < sels.length; i = i + 1) {

                            var id = sels[i].get('id');
                            var ri = id;
                            var record = s.getById(ri);
                            s.remove(record);
                        }
                    },
                    scope: this
                },
                'failure': {
                    fn: function(r) {
                        MODx.msg.alert();
                    },
                    scope: this
                }
            }
        });
        return true;
    },
    getBatchMenu: function() {
        var bm = [];
        bm.push({
            text: _('new_category'),
            handler: this.changeCategory,
            scope: this
        }, '-', {
            text: _('remove_ratesource') + '(s)',
            handler: this.ratesourceRemove,
            scope: this
        });
        return bm;
    }
});
Ext.reg('visax-grid-ratesource', visax.grid.Ratesources);


visax.window.ChangeCategory = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('new_category'),
        url: visax.config.connectorUrl,
        baseParams: {
            action: 'mgr/ratesource/changecategory'
        },
        width: 400,
        fields: [{
            xtype: 'hidden',
            name: 'ratesources'
        }, {
            xtype: 'modx-combo-category',
            id: 'visax-ratesource-category-combo',
            fieldLabel: _('category'),
            name: 'category',
            hiddenName: 'category',
            anchor: '90%'
        }]
    });
    visax.window.ChangeCategory.superclass.constructor.call(this, config);
};
Ext.extend(visax.window.ChangeCategory, MODx.Window);
Ext.reg('visax-ratesource-window-change-category', visax.window.ChangeCategory);
