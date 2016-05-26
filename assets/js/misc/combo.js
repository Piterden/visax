visax.combo.Country = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'country',
        hiddenName: 'country',
        displayField: 'name',
        valueField: 'id',
        fields: ['id', 'name', 'sign'],
        pageSize: 10, // Количество результатов на странице
        url: visax.config.connectorUrl,
        editable: true, // Комбо можно редактировать, то есть - искать страны
        allowBlank: true, // Можно оставлять пустым
        emptyText: _('visax_country_combo_placeholder'), // Текст по умолчанию
        baseParams: { // Данные для отправки процессору
            action: 'mgr/country/getlist'
        }, // Шаблон оформления, похоже на Smarty
        tpl: new Ext.XTemplate('' + '<tpl for="."><div class="visax-list-item">' + '<span><small>({id})</small> <b>{sign}</b> ({name})</span><br/>' + '</div></tpl>', {
            compiled: true
        }), // Какой элемент является селекторо. То есть, выбор будет при клике на этот элемент
        itemSelector: 'div.visax-list-item',
        //lazyRender: true,
    });
    visax.combo.Country.superclass.constructor.call(this, config);
	console.log(this);
};
Ext.extend(visax.combo.Country, MODx.combo.ComboBox);
Ext.reg('visax-combo-country', visax.combo.Country);

visax.combo.Currency = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'currency',
        hiddenName: 'currency',
        displayField: 'name',
        valueField: 'id',
        fields: ['id', 'name', 'sign'],
        pageSize: 10, // Количество результатов на странице
        url: visax.config.connectorUrl, // Используем родной процессор MODX
        editable: true, // Комбо можно редактировать, то есть - искать страны
        allowBlank: true, // Можно оставлять пустым
        emptyText: _('visax_currency_combo_placeholder'), // Текст по умолчанию
        baseParams: { // Данные для отправки процессору
            action: 'mgr/currency/getlist'
        }, // Шаблон оформления, похоже на Smarty
        tpl: new Ext.XTemplate('' + '<tpl for="."><div class="visax-list-item">' + '<span><small>({id})</small> <b>{sign}</b> ({name})</span><br/>' + '</div></tpl>', {
            compiled: true
        }), // Какой элемент является селекторо. То есть, выбор будет при клике на этот элемент
        itemSelector: 'div.visax-list-item',
        //lazyRender: true,
    });
    visax.combo.Currency.superclass.constructor.call(this, config);
	console.log(this);
};
Ext.extend(visax.combo.Currency, MODx.combo.ComboBox);
Ext.reg('visax-combo-currency', visax.combo.Currency);
