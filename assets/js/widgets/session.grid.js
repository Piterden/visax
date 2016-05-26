/* These are for LexiconHelper:
 $modx->lexicon->load('visax:default');
 include 'visax.class.php'
 */

visax.grid.Sessions = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config, {
        url: visax.config.connectorUrl,
        baseParams: {
            action: 'mgr/session/getlist'
        },
        pageSize: 300,
        fields: [
            { name: 'id', sortType: Ext.data.SortTypes.asInt },
            { name: 'currency', sortType: Ext.data.SortTypes.asUCString },
            { name: 'country', sortType: Ext.data.SortTypes.asUCString },
            { name: 'phone', sortType: Ext.data.SortTypes.asUCString },
            { name: 'email', sortType: Ext.data.SortTypes.asUCString },
            { name: 'createdon', sortType: Ext.data.SortTypes.asDate },
            { name: 'editedon', sortType: Ext.data.SortTypes.asDate },
            // { name: 'persons_count' },
            { name: 'url_hash' },
            { name: 'state', sortType: Ext.data.SortTypes.asUCString }
        ],
        paging: true,
        autosave: false,
        remoteSort: false,
        autoExpandColumn: 'name',
        cls: 'x-grid-panel',
        sm: this.sm,
        columns: [this.sm, {
            header: 'ID',
            dataIndex: 'id',
            sortable: true,
            width: 20
        }, {
            header: _('visax.currency'),
            dataIndex: 'currency',
            sortable: true,
            width: 200
        }, {
            header: _('visax.country'),
            dataIndex: 'country',
            sortable: true,
            width: 200
        }, {
            header: _('visax.phone'),
            dataIndex: 'phone',
            sortable: true,
            width: 50
        }, {
            header: _('visax.email'),
            dataIndex: 'email',
            sortable: true,
            width: 50
        }, {
            header: _('createdon'),
            dataIndex: 'createdon',
            sortable: true,
            width: 50
        }, {
            header: _('editedon'),
            dataIndex: 'editedon',
            sortable: true,
            width: 50
        }, {
            header: _('visax.persons_count'),
            dataIndex: 'persons_count',
            sortable: false,
            width: 50
        }, {
            header: _('visax.url_hash'),
            dataIndex: 'url_hash',
            sortable: false,
            width: 50
        }, {
            header: _('visax.state'),
            dataIndex: 'state',
            sortable: true,
            width: 50
        }],
        listeners: {
            cellcontextmenu: function(grid, row, cell, e) {
                this._showMenu(grid, row, e);
            },
            rowDblClick: function(grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateSession(grid, e, row);
            }
        },
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            showPreview: true,
            getRowClass: function(rec, ri, p) {
                var cls = 'grid-with-buttons';

                if (this.showPreview) {
                    return cls + ' x-grid3-row-expanded';
                }
                return cls + ' x-grid3-row-collapsed';
            }
        },
        tbar: [{
            text: _('visax.actions'),
            menu: this.getActionsMenu()
        }]
    });
    visax.grid.Sessions.superclass.constructor.call(this, config);
};
Ext.extend(visax.grid.Sessions, MODx.grid.Grid, {
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
            handler: this.createSession,
            scope: this
        }, '-', {
            text: _('visax.import'),
            handler: this.importSession,
            scope: this
        }, '-', {
            text: _('visax.remove'),
            handler: this.removeSession,
            scope: this
        });
        return bm;
    },
    getCellActionsMenu: function() {
        var bm = [];
        bm.push({
            text: _('visax.edit'),
            handler: this.updateSession,
            scope: this
        }, '-', {
            text: _('visax.remove'),
            handler: this.removeSession,
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
    updateSession: function(btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        } else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/session/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function(r) {
                        var w = MODx.load({
                            xtype: 'visax-window-update-session',
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
    createSession: function(btn, e) {
        var w = MODx.load({
            xtype: 'visax-window-create-session',
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
    importSession: function() {

    },
    removeSession: function() {
        // var list = this.getSelectedAsList();
        var row = this.getSelectionModel().getSelected(),
            id = row.id;
        if (id === false) return false;
        MODx.msg.confirm({
            title: id.length > 1 ? _('visax.remove_many') : _('visax.remove'),
            text: id.length > 1 ? _('visax.remove_many_confirm') : _('visax.remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/session/remove',
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
Ext.reg('visax-grid-session', visax.grid.Sessions);
