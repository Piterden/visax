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
            action: 'mgr/person/getlist'
                // thread: config.thread
        },
        pageSize: 30,
        fields: [
            { name: 'id', sortType: Ext.data.SortTypes.asInt },
            { name: 'session', sortType: Ext.data.SortTypes.asInt },
            { name: 'firstname', sortType: Ext.data.SortTypes.asUCString },
            { name: 'sirname', sortType: Ext.data.SortTypes.asUCString },
            { name: 'patronymic' },
            { name: 'birth_date', sortType: Ext.data.SortTypes.asDate },
            { name: 'phone', sortType: Ext.data.SortTypes.asUCString },
            { name: 'desired_time', sortType: Ext.data.SortTypes.asDate },
            { name: 'mother_fio' },
            { name: 'mother_address' },
            { name: 'mother_phone' },
            { name: 'father_fio' },
            { name: 'father_address' },
            { name: 'father_phone' },
            { name: 'trip_target', sortType: Ext.data.SortTypes.asUCString },
            { name: 'visa_type', sortType: Ext.data.SortTypes.asUCString },
            { name: 'prev_surnames' },
            { name: 'marital_status' },
            { name: 'registration_region', sortType: Ext.data.SortTypes.asUCString },
            { name: 'registration_address' },
            { name: 'residential_address' },
            { name: 'employment' },
            { name: 'empl_function' },
            { name: 'empl_address' },
            { name: 'empl_phone' },
            { name: 'last_visa' },
            { name: 'last_visa_scan' },
            { name: 'passport_scan' },
            { name: 'price', sortType: Ext.data.SortTypes.asInt }
        ],
        paging: true,
        autosave: false,
        remoteSort: false,
        autoExpandColumn: 'sirname',
        cls: 'x-grid-panel',
        sm: this.sm,
        columns: [this.sm, {
            header: 'ID',
            dataIndex: 'id',
            sortable: true,
            width: 20
        }, {
            header: _('visax.firstname'),
            dataIndex: 'firstname',
            sortable: true,
            width: 200
        }, {
            header: _('visax.sirname'),
            dataIndex: 'sirname',
            sortable: true,
            width: 200
        }, {
            header: _('visax.birth_date'),
            dataIndex: 'birth_date',
            sortable: true,
            width: 50
        }, {
            header: _('visax.phone'),
            dataIndex: 'phone',
            sortable: false,
            width: 50
        }, {
            header: _('visax.trip_target'),
            dataIndex: 'trip_target',
            sortable: true,
            width: 50
        }, {
            header: _('visax.visa_type'),
            dataIndex: 'visa_type',
            sortable: true,
            width: 50
        }, {
            header: _('visax.registration_region'),
            dataIndex: 'registration_region',
            sortable: true,
            width: 50
        }, {
            header: _('visax.price'),
            dataIndex: 'price',
            sortable: true,
            width: 50
        }],
        listeners: {
            cellcontextmenu: function(grid, row, cell, e) {
                this._showMenu(grid, row, e);
            },
            rowDblClick: function(grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updatePerson(grid, e, row);
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
            handler: this.createPerson,
            scope: this
        }, '-', {
            text: _('visax.import'),
            handler: this.importPerson,
            scope: this
        }, '-', {
            text: _('visax.remove'),
            handler: this.removePerson,
            scope: this
        });
        return bm;
    },
    getCellActionsMenu: function() {
        var bm = [];
        bm.push({
            text: _('visax.edit'),
            handler: this.updatePerson,
            scope: this
        }, '-', {
            text: _('visax.remove'),
            handler: this.removePerson,
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
    updatePerson: function(btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        } else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/person/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function(r) {
                        var w = MODx.load({
                            xtype: 'visax-window-update-person',
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
    createPerson: function(btn, e) {
        var w = MODx.load({
            xtype: 'visax-window-create-person',
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
    importPerson: function() {

    },
    removePerson: function() {
        // var list = this.getSelectedAsList();
        var row = this.getSelectionModel().getSelected(),
            id = row.id;
        if (id === false) return false;
        MODx.msg.confirm({
            title: id.length > 1 ? _('visax.remove_many') : _('visax.remove'),
            text: id.length > 1 ? _('visax.remove_many_confirm') : _('visax.remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/person/remove',
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
Ext.reg('visax-grid-person', visax.grid.Countries);
