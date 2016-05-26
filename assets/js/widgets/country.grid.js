/* These are for LexiconHelper:
 $modx->lexicon->load('visax:default');
 include 'visax.class.php'
 */

visax.grid.Countries = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config, {
        url: visax.config.connectorUrl,
        baseParams: {
            action: 'mgr/country/getlist'
                // thread: config.thread
        },
        pageSize: 300,
        fields: [
            { name: 'id', sortType: Ext.data.SortTypes.asInt },
            { name: 'name', sortType: Ext.data.SortTypes.asUCString },
            { name: 'key', sortType: Ext.data.SortTypes.asUCString },
            { name: 'sign', sortType: Ext.data.SortTypes.asUCString },
            { name: 'rank' },
            { name: 'public', sortType: Ext.data.SortTypes.asInt },
        ],
        paging: true,
        autosave: false,
        remoteSort: false,
        autoExpandColumn: 'name',
        cls: 'x-grid-panel',
        sm: this.sm,
        columns: [this.sm,
            { header: 'ID', dataIndex: 'id', sortable: true, width: 20 },
            { header: _('visax.name'), dataIndex: 'name', sortable: true, width: 200 },
            { header: _('visax.key'), dataIndex: 'key', sortable: true, width: 200 },
            { header: _('visax.sign'), dataIndex: 'sign', sortable: true, width: 50 },
            { header: _('visax.rank'), dataIndex: 'rank', sortable: false, width: 50 },
            { header: _('visax.public'), dataIndex: 'public', sortable: true, width: 50 }
        ],
        listeners: {
            cellcontextmenu: function(grid, row, cell, e) {
                this._showMenu(grid, row, e);
            },
            rowDblClick: function(grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateCountry(grid, e, row);
            }
        },
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            showPreview: false,
            getRowClass: function(rec, ri, p) {
                var cls = 'visax-row';

                if (this.showPreview) {
                    return cls + ' visax-resource-expanded';
                }
                return cls + ' visax-resource-collapsed';
            }
        },
        tbar: [{
            text: _('visax.actions'),
            menu: this.getActionsMenu()
        }]
    });
    visax.grid.Countries.superclass.constructor.call(this, config);
};
Ext.extend(visax.grid.Countries, MODx.grid.Grid, {
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
            var z = this.getCellActionsMenu();

            for (var zz = 0; zz < z.length; zz++) {
                this.menu.add(z[zz]);
            }
            this.menu.show(e.target);
        }
    },
    getActionsMenu: function() {
        var bm = [];
        bm.push({
            text: _('visax.create'),
            handler: this.createCountry,
            scope: this
        }, '-', {
            text: _('visax.import'),
            handler: this.importCountry,
            scope: this
        }, '-', {
            text: _('visax.remove'),
            handler: this.removeCountry,
            scope: this
        });
        return bm;
    },
    getCellActionsMenu: function() {
        var bm = [];
        bm.push({
            text: _('visax.edit'),
            handler: this.updateCountry,
            scope: this
        }, '-', {
            text: _('visax.remove'),
            handler: this.removeCountry,
            scope: this
        });
        return bm;
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
    updateCountry: function(btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        } else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/country/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function(r) {
                        var w = MODx.load({
                            xtype: 'visax-window-update-country',
                            id: Ext.id(),
                            record: r,
                            listeners: {
                                success: {
                                    fn: function() {
                                        this.refresh();
                                    },
                                    scope: this
                                }
                            }
                        });
                        w.reset();
                        w.setValues(r.object);
                        w.show(e.target);
                    },
                    scope: this
                }
            }
        });
    },
    createCountry: function(btn, e) {
        var w = MODx.load({
            xtype: 'visax-window-create-country',
            id: Ext.id(),
            listeners: {
                success: {
                    fn: function() {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });
        w.reset();
        // w.setValues({blocked: false});
        w.show(e.target);
    },
    importCountry: function() {

    },
    removeCountry: function() {
        // var list = this.getSelectedAsList();
        var row = this.getSelectionModel().getSelected(),
            id = row.id;
        if (id === false) return false;
        MODx.msg.confirm({
            title: id.length > 1 ? _('visax.remove_many') : _('visax.remove'),
            text: id.length > 1 ? _('visax.remove_many_confirm') : _('visax.remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/country/remove',
                id: id,
                primaryKey: 'id'
            },
            listeners: {
                success: {
                    fn: function(r) {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });
        return true;
    }
});
Ext.reg('visax-grid-country', visax.grid.Countries);
