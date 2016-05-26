visax.utils.renderBoolean = function(value, props, row) {
    return value ? String.format('<span class="green">{0}</span>', _('yes')) : String.format('<span class="red">{0}</span>', _('no'));
};
