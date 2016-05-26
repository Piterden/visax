var // @vars
    $$userSessionsStore, // session storage
    $$personsStore, // persons for current session storage
    winResizeEv, // event id
    timeoutID, // save timeout id

    /**
     * Lexicon helper
     * @param  {string} langKey
     * @return {string} localized value
     */
    _ = function(langKey) {
        return visax.lexicon[langKey] || langKey;
    },

    /**
     * Capitalize word
     * @param  {string} word    Word
     * @param  {bool} onlyFirst Return only first letter with dot
     * @return {string}         Capitalized
     */
    _C = function(word, onlyFirst) {
        if (!word) return '';
        word = word.toLowerCase();
        return (!onlyFirst) ? word[0].toUpperCase() + word.slice(1) + ' ' : word[0].toUpperCase() + '. ';
    },

    /**
     * After person updated
     * @param  {number} response
     * @return {void}
     */
    person_updated = function(data) {
        $$('visaForm').setDirty(!data.success);
    },

    updatePersons = function() {
        var $formStmt = $$('visaForm'),
            allValues = $formStmt.getValues(),
            id = allValues.id,
            index = $$('visaList').getIndexById(id),
            $propTable = $$('personProps' + index);

        $$personsStore.updateItem(id, $formStmt.getDirtyValues());
        $propTable.bind($formStmt);
    },

    /**
     * Initialize step 2 - main order form
     * @param  {number} id of current session
     * @return {void}
     */
    initStep2 = function(id) {
        var $modal = $$('sessions_list'),
            $personsList = $$('visaList'),
            $singlePersonForm = $$('visaForm'),
            recentPersIndex = selectRecentPerson(id),
            recentPersId = $$personsStore.getIdByIndex(recentPersIndex),
            persons = $$userSessionsStore.getItem(id).persons,
            $prevSurList = $$('prevSurList'),

            /**
             * Toggle person in form by click on list item
             * @param  {number} newId oldId newIdx oldIdx
             * @return {void}
             */
            togglePerson = function(newId, oldId, newIdx, oldIdx) {
                var dirtyVals = $singlePersonForm.getDirtyValues();
                $$personsStore.updateItem(oldId, dirtyVals);

            };

        if ($modal !== undefined) $modal.close();

        // Binding stores to each other
        $personsList.sync($$personsStore);
        $$personsStore.addBind($personsList);
        $singlePersonForm.bind($personsList);

        $personsList.select(recentPersIndex);
        $$userSessionsStore.setCursor(id);
        $$personsStore.refreshCursor();
        $$userSessionsStore.refreshCursor();

        // Update multifield
        $prevSurList.updatePrevSirnamesList(recentPersId);

        /**
         * Persons list item click handler (side bar step 2)
         * @param  {number} newId
         * @return {number} id of event
         */
        $personsList.attachEvent('onItemClick', function(newId) {
            var oldId = this.getSelectedId(),
                oldIdx = this.getIndexById(oldId),
                newIdx = this.getIndexById(newId);
            if (newId == oldId) return false;

            if ($singlePersonForm.isDirty()) {
                togglePerson(newId, oldId, newIdx, oldIdx);
            }
            $prevSurList.updatePrevSirnamesList(newId);
        });

        $personsList.attachEvent('onSelectChange', function(id) {
            $prevSurList.updatePrevSirnamesList(id);
        });

        $prevSurList.attachEvent("onAfterEditStop", function(state, editor) {
            if (state.value != state.old) {
                this.updatePrevSirnamesStr();
            }
        });

        /**
         * Handling 'onkeyup' native DOM event
         * @param  (HTML_Node, event, handler, this)
         * @return event id
         */
        webix.event($singlePersonForm.getNode(), "keyup", function(e) {
            if ($singlePersonForm.isDirty()) {
                clearTimeout(timeoutID);

                // Timeout before live save is run
                timeoutID = webix.delay(updatePersons, $singlePersonForm, [], 400);
            }
        }, { master: $$('visaForm') });

        //var listTopOffset = $personsList.$view.getBoundingClientRect().top;
        // document.getElementsByTagName('body')[0].addEventListener('scroll', function(e) {
        //     var sbwNode = $$('sideBarWrap').$view;
        //     if (sbwNode.getBoundingClientRect().top < 0 && !sbwNode.classList.contains('top-fixed')) {
        //         sbwNode.classList.add('top-fixed');
        //     } else if (sbwNode.getBoundingClientRect().top >= 0 && sbwNode.classList.contains('top-fixed')) {
        //         sbwNode.classList.remove('top-fixed');
        //     }
        // });
    },

    /**
     * Init step 3
     * @param  {object} session
     * @param  {array} persons
     * @return {void}
     */
    initStep3 = function(session, persons) {
        var $sessionPS = $$('sessionProps');

        $sessionPS.setValues(session);
        $sessionPS.show();

        for (var i = 0; i < persons.length; i++) {
            var person = persons[i],
                elems = [{
                    label: _C(person.sirname) + _C(person.firstname) + _C(person.patronymic),
                    type: 'label'
                }];

            for (var key in person) {
                if (person.hasOwnProperty(key)) {
                    var val = person[key] || _('empty'),
                        el = { label: _(key), type: "text", id: key, value: val };
                    if (key == 'birth_date' || key == 'desired_time') {
                        el.type = "date";
                        el.format = webix.i18n.parseFormatStr;
                    }
                    elems.push(el);
                }
            }

            $$('vertScroll').getBody().addView({
                view: "property",
                id: "personProps" + i,
                editable: false,
                height: "auto",
                elements: elems,
                nameWidth: 300
            });
        }

        $$('vertScroll').adjust();
        $$('Step3').adjust();
    },

    /**
     * [new_session description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    new_session = function(data) {
        var session = data.results,
            persons = session.persons;
        // mainWrapper.hideProgress();
        $$userSessionsStore.add(session, session.id);
        $$personsStore.clearAll();
        $$personsStore.parse(persons);

        initStep2(session.id);

        $$('tabbar').setValue('Step2');
        $$('Step2').enable();

        initStep3(session, persons);
    },

    /**
     * [load_session description]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    load_session = function(id) {
        var session = $$userSessionsStore.getItem(id),
            persons = session.persons;
        mainWrapper.hideProgress();
        $$personsStore.clearAll();
        $$personsStore.parse(persons);

        initStep2(session.id);

        $$('tabbar').setValue('Step2');
        $$('Step2').enable();

        initStep3(session, persons);
    },

    /**
     * [show_modal description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    show_modal = function(data) {
        if (typeof data == 'string') data = JSON.parse(data);
        var sessions = data.results,
            email = sessions[0].email,
            persons = [],
            formFields = $$('Step1').getValues();

        // mainWrapper.hideProgress();
        $$userSessionsStore.parse(sessions);

        webix.ui({
            view: "window",
            id: "sessions_list",
            move: true,
            resize: true,
            position: "center",
            height: 600,
            head: {
                view: "toolbar",
                cols: [
                    { view: "label", label: _('sess_list') + " " + email, gravity: 5 },
                    { view: "button", label: _('close'), align: "right", gravity: 1, click: "$$('sessions_list').close();" }
                ]
            },
            body: {
                width: 800,
                rows: [{
                    view: "treetable",
                    select: "row",
                    // editable: true,
                    autowidth: true,
                    scheme: {
                        $init: function(obj) {
                            obj.data = obj.persons;
                            for (var key in obj.data) {
                                if (obj.data.hasOwnProperty(key)) {
                                    obj.data[key].id = obj.id + '.' + obj.data[key].id;
                                    obj.data[key].session = obj.id;
                                }
                            }
                        },
                    },
                    columns: [
                        { id: "id", header: _('id'), adjust: "data", fillspace: true, template: "{common.treetable()} <span class='text-right'>#id#</span>" },
                        { id: "country_name", header: _('country_name'), fillspace: true },
                        { id: "persons_count", header: _('persons_count'), adjust: "header" },
                        { id: "createdon", header: _('createdon'), format: webix.i18n.longDateFormatStr, adjust: "header" },
                        { id: "editedon", header: _('editedon'), format: webix.i18n.longDateFormatStr, adjust: "header" },
                        { id: "state", header: _('state'), adjust: "data", fillspace: true }, {
                            id: "edit",
                            header: _('actions'),
                            template: function(obj, common) {
                                return '<span class="editBtn" title="' + _('return_filling') + '">' + common.editIcon(obj, common) + '</span><span class="infoBtn" title="' + _('show_persons') + '"></span>';
                            }
                        }
                    ],
                    data: $$userSessionsStore,
                    onClick: {
                        editBtn: function(e, id, trg) {
                            webix.confirm({
                                title: _('load_sess'),
                                ok: _('ok'),
                                cancel: _('cancel'),
                                text: _('load_confirm'),
                                callback: function(yes) {
                                    if (yes) {
                                        mainWrapper.showProgress({
                                            type: "icon",
                                            delay: 3000
                                        });
                                        load_session(id);
                                    }
                                }
                            });
                        }
                    },
                }, {
                    cols: [{}, {
                        view: "button",
                        gravity: 2,
                        value: _('new_sess_start'),
                        type: "form",
                        click: function() {
                            formFields.step = 'force';
                            mainWrapper.showProgress({ type: "icon", delay: 3000 });
                            webix.ajax().post(getAjaxUrl('session', 'create'), formFields, ajaxCallback);
                        }
                    }, {}]
                }]
            }
        }).show();
    },

    /**
     * Generate URL helper
     * @param  {[type]} model  [description]
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    getAjaxUrl = function(model, action) {
        return visax.web_connector_url + "?action=" + model + "/" + action;
    },

    /**
     * AJAX Callback handler
     * @param  {[type]} resp [description]
     * @return {[type]}      [description]
     */
    ajaxCallback = function(resp) {
        data = JSON.parse(resp);
        if (data.success) {
            mainWrapper.hideProgress();
            return window[data.message](data);
        }
        return webix.message({
            type: "error",
            text: data.message,
            expire: 5000
        });
    },

    /**
     * Select person in loaded session helper
     * @param  {number} s_id session id
     * @return {number}      person id
     */
    selectRecentPerson = function(s_id) {
        return 1;
    },

    getPersonsLimit = function() {
        var mp = Number(visax.max_persons),
            optArr = [];
        for (var i = 1; i <= mp; i++) {
            optArr.push({ id: i, value: i });
        }
        return optArr;
    },

    /**
     * Adding drop zone
     * @param {[type]} name   [description]
     * @param {[type]} target [description]
     */
    addDropZoneArea = function(name, target) {
        var $personsList = $$(target),
            $uploadAPI = $$('uploadAPI'),
            XY = webix.html.offset($personsList.$view);

        $personsList.$view.id = 'uploadWrap';

        var dropZoneArea = webix.ui({
            container: "uploadWrap",
            view: "button",
            id: "dropZoneArea",
            label: _('drop_zone'),
            type: "iconTop",
            icon: "upload",
            css: "dropzone",
            width: XY.width,
            height: XY.height - 1,
            click: "$$('uploadAPI').fileDialog();",
            fullScreen: false
        });

        dropZoneArea.define('css', 'dropzone op1');
        $uploadAPI.addDropZone(dropZoneArea.$view);

        winResizeEv = webix.event(window, 'resize', function(e, t) {
            var XY = webix.html.offset($personsList.$view);
            dropZoneArea.define('width', XY.width);
            dropZoneArea.define('height', XY.height - 1);
            dropZoneArea.resize(true);
        });

        $uploadAPI.attachEvent("onBeforeFileAdd", function(item) {
            var name = item.name.toLowerCase(),
                type = item.type.toLowerCase();
            if (type != "jpg" && type != "jpeg" && type != "png" && type != "gif") {
                webix.message("Only PNG, JPG, JPEG and GIF images are supported");
                return false;
            }
            $uploadAPI.define('formData', {
                source: 2,
                path: "visascans/"
            });
        });

        var onUpCompl = $uploadAPI.attachEvent("onUploadComplete", function(response) {
            console.log(response);
            removeDropZoneArea();
        });

    },

    removeDropZoneArea = function() {
        webix.html.removeCss($$("dropZoneArea").getNode(), "op1");
        webix.delay(function() {
            if ($$('dropZoneArea') !== undefined) {
                $$('dropZoneArea').destructor();
            }
            webix.detachEvent(winResizeEv);
        }, webix, [], 500);
    },

    getSessions = function(email) {
        email = email || $$('Step1').getValues().email;
        if (webix.rules.isEmail(email)) {
            webix.ajax().post(getAjaxUrl('session', 'getlist'), { email: email }, show_modal);
        }
    },

    getPersonAge = function(id) {
        return ($$personsStore.getItem(id).birth_date - new Date()) / 1000 / 60 / 60 / 24 / 365;
    },

    calculateCost = function() {
        var cost = 540,
            age = getPersonAge();

        // Age rules
        if (age <= 17) cost += 500;
        if (17 < age <= 64) cost += 450;
        if (64 < age <= 69) cost += 900;
        if (69 < age <= 74) cost += 1350;
        if (74 < age <= 79) cost += 1800;
        if (79 < age <= 84) cost += 2250;
        if (84 < age) cost += 3150;

        // Region rules
        if ($$('regionsList').getValue() != 1) cost += 50;

        return cost;
    };

webix.type(webix.ui.list, {
    name: "perslist",
    icon: "fa-times",
    butWidth: 21,
    butHeight: 21,
    templateStart: webix.template('<div webix_l_id="#id#" class="{common.classname()}"><div class="overall">'),
    templateEnd: webix.template('</div>{common.removeButton()}</div>'),
    template: function(obj) {
        var idx = $$('visaList').getIndexById(obj.id);
        if (obj.sirname !== undefined && obj.sirname !== null && obj.sirname.length > 1) {
            return "<div class='title'>" + _C(obj.sirname) + _C(obj.firstname, true) + _C(obj.patronymic, true) + "</div>";
        }
        return "<div class='small'>Заявитель №" + (idx + 1) + "</div>";
    },
    removeButton: webix.template(
        '   <div class="webix_view webix_control webix_el_button button_remove absolute" style="width: {common.butWidth}px; height: {common.butHeight}px;">' +
        '       <div class="webix_el_box" style="width:{common.butWidth}; height:{common.butHeight}px">' +
        '           <button type="button" class="webix_img_btn" style="line-height:{common.butHeight - 6}px;">' +
        '               <span class="webix_icon_btn {common.icon}" style="max-width:{common.butHeight - 6}px;"></span>' +
        '           </button>' +
        '       </div>' +
        '   </div>'
    ),
    on_click: {
        "button_remove": function(e, id) {
            console.log(id);
        }
    }
});

webix.type(webix.ui.list, {
    name: "multilist",
    classname: function(obj, common, marks) {
        var css = "webix_list_item";
        if (obj.$css) {
            if (typeof obj.$css == "object")
                obj.$css = webix.html.createCss(obj.$css);
            css += " " + obj.$css;
        }
        if (marks && marks.$css)
            css += " " + marks.$css;
        return css;
    },
    $css: {
        width: "auto",
        height: "34px",
        position: "relative",
    },
    butWidth: 21,
    butHeight: 21,
    icon: 'fa-times',
    template: webix.template("#value# {common.removeButton()}"),
    templateStart: webix.template('<div webix_l_id="#id#" class="{common.classname()}">'),
    templateEnd: webix.template('</div>'),
    removeButton: webix.template(
        '   <div class="webix_view webix_control webix_el_button button_remove absolute" style="width: {common.butWidth}px; height: {common.butHeight}px;">' +
        '       <div class="webix_el_box" style="width:{common.butWidth}; height:{common.butHeight}px">' +
        '           <button type="button" class="webix_img_btn" style="line-height:{common.butHeight - 6}px;">' +
        '               <span class="webix_icon_btn {common.icon}" style="max-width:{common.butHeight - 6}px;"></span>' +
        '           </button>' +
        '       </div>' +
        '   </div>'
    ),
    on_click: {
        "button_remove": function(e, id) {
            this.editCancel();
            this.remove(id);
            this.updatePrevSirnamesStr();
        }
    }
});

webix.protoUI({
    name: "editlist",
    defaults: {
        gravity: 1,
        autoheight: true,
        width: "auto",
        borderless: true,
        addIcon: 'fa-plus',
        padding: 5,
        type: 'multilist'
    },
    label_setter: function(label) {
        if (label !== undefined && label !== '' && label) {
            var rootNode = this.getNode(),
                conf = this.config,
                addButton = webix.html.create('DIV', {
                    'class': 'webix_view webix_control webix_el_button button_add absolute',
                    'view_id': 'addPrevSur',
                    'style': 'width: ' + conf.buttWidth || 30 + 'px; height: ' + conf.buttHeight || 30 + 'px;'
                }),
                labelNode = webix.html.create('LABEL', {
                    'class': 'webix_inp_top_label',
                    'style': 'display:block;text-align:left;line-height:20px;position:relative;padding:2px 0 0 32px;'
                }, label);

            addButton.appendChild(webix.html.create('BUTTON', {
                'type': 'button',
                'class': 'webix_img_btn',
                'style': 'line-height: 1;height: 21px;'
            })).appendChild(webix.html.create('SPAN', {
                'class': 'webix_icon_btn ' + conf.addIcon || 'fa-plus',
                'style': 'max-width:21px;'
            }));
            labelNode.appendChild(addButton);
            webix.html.insertBefore(labelNode, rootNode.childNodes[0]);

            return label;
        }
    },
    $getSize: function() {
        return [1, 10000, 1, 10000];
    },
    getValues: function() {
        return Array.prototype.slice
            .call(this.getNode().childNodes[1].childNodes)
            .map(function(el, i, arr) {
                return _C(el.innerText.toLowerCase()).trim();
            });
    },
    updatePrevSirnamesList: function(id) {
        if ($$personsStore.getItem(id) === undefined) return;

        var $prevSurList = $$('prevSurList'),
            str = $$personsStore.getItem(id).prev_surnames;

        if (str === '') return;

        var arr = str.split(','),
            result = [];
        arr.forEach(function(surname, idx) {
            result.push({ id: idx + 1, value: _C(surname).trim() });
        });
        $$('prevSurList').clearAll();
        $$('prevSurList').parse(result);
    },
    updatePrevSirnamesStr: function() {
        var values = this.getValues(),
            $strField = $$('prevSurStr');
        $strField.setValue(values.join(','));
        updatePersons();
    },
    on_click: {
        "button_add": function() {
            var id = this.count() + 1;
            this.add({
                id: id,
                value: ''
            });
            this.edit(id);
        }
    }
}, webix.BaseBind, webix.EditAbility, webix.ui.list);

webix.protoUI({
    name: "phonefield",
    $cssName: "text webix_el_richselect",
    defaults: {
        validate: "isPhone",
        placeholder: "(___) ___-__-__",
        icon: "phone",
        on: {
            "onAfterRender": function(data) {
                // console.log(data, this);
                if (!VanillaMask) return;
                var id = this.getInputNode().id,
                    _this = this;
                this.validator = this.validator ||
                    new VanillaMask(document.getElementById(String(id)), {
                        masks: ["(999) 999-99-99"],
                        onComplete: function() {
                            _this.validate();
                            _this.attachEvent('onChange', function() {
                                _this.validate();
                            });
                        }
                    });
            },
        },
    }
}, webix.ui.text);

/*************************
 * On DOM ready
 * @return {void}
 *************************
 *************************
 *************************
 *************************
 *************************
 *************************/
webix.ready(function() {

    // webix.detachEvent(webix.debug_load_event);
    webix.i18n.setLocale("ru-RU");
    webix.Date.startOnMonday = true;

    /**
     * Uploader API
     * @type {webix}
     */
    webix.ui({
        view: "uploader",
        id: "uploadAPI",
        apiOnly: true,
        multiple: false,
        accept: "image/png, image/gif, image/jpg",
        upload: getAjaxUrl('person', 'file/upload'),
        datatype: "json",
        fullScreen: false
    });

    /**
     * Modx data driver JSON
     */
    webix.DataDriver.modx = webix.extend({
        getInfo: function(data) {
            // console.log(data);
            return {
                _size: (data.total || 0),
                _from: (data.pos || 0),
                _parent: (data.parent || 0),
                _config: (data.config),
                _key: (data.webix_security)
            };
        }
    }, webix.DataDriver.json);

    /**
     * Phone validation rule
     * @param  {[type]}  t [description]
     * @return {Boolean}   [description]
     */
    webix.rules.isPhone = function(t) {
        var patt = /^\(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return patt.test(t.trim());
    };

    /**
     * Session storage definition
     * @return {void}
     */
    $$userSessionsStore = new webix.DataCollection({
        id: "$$userSessionsStore",
        // url: getAjaxUrl('session', 'getlist'),
        scheme: {
            //turning strings into objects on loading
            $init: function(obj) {
                // formatting dates. turning strings into objects on loading.
                if (obj.editedon !== undefined && obj.editedon !== null)
                    obj.editedon = webix.i18n.parseFormatDate(obj.editedon);
                if (obj.createdon !== undefined && obj.createdon !== null)
                    obj.createdon = webix.i18n.parseFormatDate(obj.createdon);
                // get lang keys
                obj._status = obj.status;
                obj.status = _(obj.status);
            },
            //turing objects back to strings on saving
            $save: function(obj) {
                // return dates
                if (obj.editedon !== undefined && obj.editedon !== null)
                    obj.editedon = webix.i18n.parseFormatStr(obj.editedon);
                if (obj.createdon !== undefined && obj.createdon !== null)
                    obj.createdon = webix.i18n.parseFormatStr(obj.createdon);
            }
        }
    });

    /**
     * Persons of one session storage definition
     * @return {void}
     */
    $$personsStore = new webix.DataCollection({
        id: "$$personsStore",
        scheme: {
            $init: function(obj) {
                if (obj.birth_date !== undefined && obj.birth_date !== null)
                    obj.birth_date = webix.i18n.parseFormatDate(obj.birth_date);
            },
            $save: function(obj) {
                if (obj.birth_date !== undefined && obj.birth_date !== null)
                    obj.birth_date = webix.i18n.parseFormatStr(obj.birth_date);
            },
            $update: function(obj) {
                this.serialize();
                // mainWrapper.showProgress({ type: "icon", delay: 3000 });
                webix.ajax().post(getAjaxUrl('person', 'update'), obj, ajaxCallback);
            },
        },
    });

    /**
     * Extending stores to send queries
     */
    webix.extend($$userSessionsStore, webix.DataProcessor);
    webix.extend($$personsStore, webix.DataProcessor);

    /**
     * Main layout object
     * @object
     */
    mainWrapper = webix.ui({
        id: "mainWrapper",
        container: "ajaxWrapper",
        rows: [{ // TAB BAR
            view: "segmented",
            id: "tabbar",
            value: "Step1",
            // fitBiggest: true,
            multiview: true,
            options: [
                { value: _('step_1'), id: 'Step1' },
                { value: _('step_2'), id: 'Step2' },
                { value: _('step_3'), id: 'Step3' }
            ]
        }, {
            view: "multiview",
            id: "visaMultiview",
            keepViews: true,
            cells: [{ // STEP 1
                view: "form",
                id: "Step1",
                scroll: false,
                borderless: true,
                elements: [{
                    view: "template",
                    template: "<div class='header-wrap'>" +
                        "<h2>Шаг 1 - оформление визы</h2>" +
                        "</div>",
                    height: 77,
                    borderless: true
                }, {
                    cols: [{
                        view: "richselect",
                        id: "countryList",
                        name: "country",
                        label: _('country'),
                        placeholder: _('country_pls'),
                        invalidMessage: _('country_inv'),
                        icon: "bars",
                        gravity: 1,
                        options: {
                            view: "suggest",
                            id: "countryListSuggest",
                            borderless: true,
                            value: 5,
                            body: {
                                header: true,
                                template: "<span>#name#</span>",
                                url: getAjaxUrl('country', 'getlist')
                            },
                        },
                    }, {
                        view: "template",
                        gravity: 2,
                        borderless: true,
                        template: _('country_cmnt')
                    }]
                }, {
                    cols: [{
                        view: "richselect",
                        name: "persons_count",
                        label: _('persons_count'),
                        placeholder: _('persons_count_pls'),
                        invalidMessage: _('persons_count_inv'),
                        icon: "bars",
                        gravity: 1,
                        value: 1,
                        options: getPersonsLimit()
                    }, {
                        view: "template",
                        gravity: 2,
                        borderless: true,
                        template: _('persons_count_cmnt')
                    }]
                }, {
                    cols: [{
                        view: "phonefield",
                        id: "phoneMasked",
                        name: "phone",
                        label: _('phone'),
                        gravity: 1,
                        icon: false
                    }, {
                        view: "template",
                        gravity: 2,
                        borderless: true,
                        template: _('phone_cmnt')
                    }]
                }, {
                    cols: [{
                        view: "text",
                        name: "email",
                        label: _('email'),
                        placeholder: _('email_pls'),
                        validate: "isEmail",
                        gravity: 1,
                        value: "saf@dfs.re"
                    }, {
                        view: "template",
                        gravity: 2,
                        borderless: true,
                        template: _('email_cmnt')
                    }]
                }, {
                    margin: 5,
                    cols: [{
                        view: "button",
                        type: "form",
                        value: _('clear'),
                        gravity: 3,
                        css: "clean-butt",
                        click: function() {
                            this.getFormView().clear();
                        }
                    }, {
                        view: "button",
                        type: "form",
                        value: _('continue'),
                        gravity: 2,
                        css: "submit-butt",
                        click: function() {
                            var form = this.getFormView();
                            if (!form.validate()) {
                                return webix.message({
                                    type: "error",
                                    text: _('invalid_form'),
                                    expire: 5000
                                });
                            }
                            mainWrapper.showProgress({
                                type: "icon",
                                delay: 3000
                            });
                            webix.ajax().post(getAjaxUrl('session', 'create'), form.getValues(), ajaxCallback);
                        }
                    }, {
                        view: "spacer",
                        gravity: 10
                    }]
                }, {
                    view: "text",
                    name: "step",
                    hidden: true,
                    readonly: true,
                    value: "check"
                }],
                elementsConfig: {
                    labelPosition: "top",
                    required: true,
                    inputHeight: 44,
                    bottomPadding: 44
                }
            }, { // STEP 2
                id: "Step2",
                disabled: true,
                gravity: 1,
                borderless: true,
                autoheight: true,
                css: "mt1",
                cols: [{ // MAIN FORM
                    id: "visaForm",
                    view: "form",
                    gravity: 3,
                    scroll: false,
                    autoheight: true,
                    elementsConfig: {
                        labelPosition: "top",
                        on: {
                            "onChange": function(newv, oldv) {
                                var $singlePersonForm = this.getFormView();
                                if ($singlePersonForm.isDirty()) {
                                    clearTimeout(timeoutID);
                                    // Timeout before live save is run
                                    timeoutID = webix.delay(updatePersons, $singlePersonForm, [], 400);
                                }
                                // webix.message("Value changed from: " + oldv + " to: " + newv);
                            }
                        }
                    },
                    elements: [{
                        view: "template",
                        template: "<div class='header-wrap'>" +
                            "<h2>Шаг 2 - данные о заявителях</h2>" +
                            "</div>",
                        height: 77,
                        borderless: true
                    }, {
                        cols: [{
                            view: "text",
                            name: "sirname",
                            required: true,
                            label: _('sirname'),
                            placeholder: _('sirname_pls')
                        }, {
                            view: "text",
                            name: "firstname",
                            required: true,
                            label: _('firstname'),
                            placeholder: _('firstname_pls')
                        }, {
                            view: "text",
                            name: "patronymic",
                            label: _('patronymic'),
                            placeholder: _('patronymic')
                        }],
                        height: 68
                    }, {
                        view: "text",
                        name: "prev_surnames",
                        id: "prevSurStr",
                        hidden: true,
                        height: 68,
                    }, {
                        view: "editlist",
                        name: "prev_surnames_list",
                        id: "prevSurList",
                        label: _('prev_surnames'),
                        placeholder: _('prev_surnames_pls'),
                        height: 68,
                        editable: true,
                        editor: "text",
                        editValue: "value",
                        editaction: "click",
                        scroll: false,
                        layout: 'x',
                        on: {
                            "onLiveEdit": function(state, editor, ignoreUpdate) {
                                webix.notice("Current value: " + state.value);
                            }
                        }
                    }, {
                        height: 68,
                        cols: [{
                            view: "datepicker",
                            id: "birthDatepicker",
                            name: "birth_date",
                            timepicker: true,
                            minTime: "8:00",
                            maxTime: "18:30",
                            icons: true,
                            required: true,
                            label: _('birth_date'),
                            placeholder: _('birth_date_pls'),
                            // value: new Date(1990, 6, 8),
                            on: {
                                "onChange": function() {
                                    var form = this.getFormView(),
                                        birth_date = Date.parse(form.getValues().birth_date),
                                        now = Date.now();
                                    if ((now - birth_date) / 1000 < (18 * 60 * 60 * 24 * 365)) {
                                        $$('parentsGroup').show();
                                    } else {
                                        $$('parentsGroup').hide();
                                    }
                                },
                                // "onItemClick": function(i, e) {
                                //     var cal = $$(i).getPopup().getChildViews()[0];
                                //     cal.detachEvent('onBeforeRender');
                                //     cal.attachEvent('onBeforeRender', function() {
                                //         // console.log(this);
                                //     });

                                // }
                            }
                        }, {
                            view: "phonefield",
                            id: "dynamicPhone",
                            name: "phone",
                            required: true,
                            label: _('phone'),
                        }, {
                            view: "spacer"
                        }]
                    }, {
                        view: "fieldset",
                        id: "parentsGroup",
                        label: _('parents_group'),
                        hidden: true,
                        body: {
                            rows: [{
                                height: 68,
                                cols: [{
                                    view: "text",
                                    name: "mother_fio",
                                    label: _('mother_fio'),
                                    placeholder: _('mother_fio_pls'),
                                }, {
                                    view: "phonefield",
                                    name: "mother_phone",
                                    label: _('mother_phone'),
                                    placeholder: _('mother_phone_pls'),
                                }]
                            }, {
                                view: "text",
                                name: "mother_address",
                                label: _('mother_address'),
                                placeholder: _('mother_address_pls'),
                                height: 68,
                            }, {
                                height: 68,
                                cols: [{
                                    view: "text",
                                    name: "father_fio",
                                    label: _('father_fio'),
                                    placeholder: _('father_fio_pls'),
                                }, {
                                    view: "phonefield",
                                    name: "father_phone",
                                    label: _('father_phone'),
                                    placeholder: _('father_phone_pls'),
                                }]
                            }, {
                                view: "text",
                                name: "father_address",
                                label: _('father_address'),
                                placeholder: _('father_address_pls'),
                                height: 68,
                            }]
                        }
                    }, {
                        height: 68,
                        cols: [{
                            view: "richselect",
                            name: "marital_status",
                            required: true,
                            label: _('marital_status'),
                            placeholder: _('marital_status_pls'),
                            borderless: true,
                            value: 0,
                            options: [
                                { id: 0, value: _('no_married') },
                                { id: 1, value: _('married') }
                            ]
                        }, {
                            view: "richselect",
                            id: "regionsList",
                            required: true,
                            label: _('registration_region'),
                            placeholder: _('registration_region_pls'),
                            name: "registration_region",
                            invalidMessage: _('registration_region_inv'),
                            options: {
                                view: "suggest",
                                id: "regoinsListSuggest",
                                borderless: true,
                                body: {
                                    header: true,
                                    // template: "<span>#label#</span>",
                                    data: webix.storage.local.get('helpers_data').regions,
                                },
                            },
                        }, {
                            height: 68,
                            view: "datepicker",
                            name: "desired_time",
                            required: true,
                            label: _('desired_time'),
                            placeholder: _('desired_time_pls'),
                            timepicker: true,
                        }]
                    }, {
                        height: 68,
                        cols: [{
                            view: "text",
                            name: "trip_target",
                            required: true,
                            label: _('trip_target'),
                            placeholder: _('trip_target_pls')
                        }, {
                            view: "richselect",
                            name: "visa_type",
                            required: true,
                            label: _('visa_type'),
                            placeholder: _('visa_type_pls'),
                            borderless: true,
                            options: [
                                { id: "one", value: _('one_time') },
                                { id: "many", value: _('many_time') }
                            ]
                        }, {
                            view: "richselect",
                            name: "employment",
                            required: true,
                            label: _('employment'),
                            placeholder: _('employment_pls'),
                            options: [
                                { id: "work", value: _('work') },
                                { id: "vuz", value: _('vuz') },
                                { id: "school", value: _('school') },
                                { id: "not_work", value: _('not_work') },
                                { id: "pension", value: _('pension') }
                            ],
                            on: {
                                "onChange": function() {
                                    if (!this.data.value || this.data.value == 'not_work' || this.data.value == 'pension') {
                                        $$('employment_group').hide();
                                    } else {
                                        $$('employment_group').show();
                                    }
                                }
                            }
                        }]
                    }, {
                        view: "fieldset",
                        id: "employment_group",
                        label: _('employment_group'),
                        hidden: true,
                        body: {
                            rows: [{
                                height: 68,
                                view: "text",
                                name: "empl_function",
                                label: _('empl_function'),
                                placeholder: _('empl_function_pls')
                            }, {
                                height: 68,
                                view: "text",
                                name: "empl_address",
                                label: _('empl_address'),
                                placeholder: _('empl_address_pls')
                            }, {
                                height: 68,
                                view: "text",
                                name: "empl_phone",
                                label: _('empl_phone'),
                                placeholder: _('empl_phone_pls')
                            }]
                        }
                    }, {
                        height: 108,
                        cols: [{
                            view: "textarea",
                            name: "registration_address",
                            required: true,
                            label: _('registration_address'),
                            placeholder: _('registration_address_pls'),
                        }, {
                            view: "textarea",
                            name: "residential_address",
                            required: true,
                            label: _('residential_address'),
                            placeholder: _('residential_address_pls'),
                        }]
                    }, {
                        view: "checkbox",
                        name: "last_visa",
                        labelRight: _('last_visa'),
                        customCheckbox: false,
                        height: 40,
                        on: {
                            "onChange": function(yes, no) {
                                if (yes && !no) {
                                    addDropZoneArea('last_visa', 'visaList');
                                }
                                if (!yes && no) {
                                    removeDropZoneArea();
                                }
                            }
                        }
                    }, {
                        view: "text",
                        id: "last_visa_scan",
                        name: "last_visa_scan",
                        hidden: true
                    }, {
                        view: "text",
                        name: "price",
                        id: "priceField",
                        hidden: true,
                        value: 0
                    }, {
                        view: "text",
                        name: "id",
                        hidden: true,
                        readonly: true,
                    }, {
                        view: "text",
                        name: "session",
                        hidden: true,
                        readonly: true,
                    }]
                }, {
                    view: "resizer",
                    id: "resize_2",
                    disabled: true
                }, { // SIDE LIST
                    id: "sideBarWrap",
                    rows: [{
                        css: "text-center",
                        view: "label",
                        label: "Заявители:"
                    }, {
                        view: "toolbar",
                        id: "visaListButtons",
                        labelAlign: 'left',
                        css: "float-block",
                        cols: [
                            { view: "spacer" }, {
                                view: "button",
                                id: "addPerson",
                                type: "icon-top",
                                icon: "plus",
                                tooltip: _("person_add"),
                                css: "text-center addPersonBtn",
                                gravity: 10,
                                value: _("person_add")
                            },
                            { view: "spacer" }
                        ]
                    }, {
                        view: "list",
                        id: "visaList",
                        css: "float-block",
                        editable: true,
                        form: "visaForm",
                        type: "perslist",
                        select: true,
                        autoheight: true,
                        // minHeight: 320,
                        scroll: false
                    }, {
                        view: "template",
                        id: "priceBlock",
                        template: "<div class='price-wrap'>" +
                            "<div class='top-line'>" +
                            "<span class='label'>Итого: </span>" +
                            "<strong id='totalPrice'>" +
                            webix.i18n.priceFormat() +
                            "</strong>" +
                            "</div>" +
                            "<div class='bottom-line'>" +
                            "<button id='toPay' class='btn btn-primary'>Оплатить</button>" +
                            "</div>" +
                            "</div>"
                    }]
                }]
            }, { // STEP 3
                id: "Step3",
                cols: [{
                    id: "vertScroll",
                    view: "scrollview",
                    body: {
                        rows: [{
                            view: "property",
                            id: "sessionProps",
                            editable: false,
                            nameWidth: 300,
                            elements: [
                                { label: _('session'), type: "label" },
                                { label: _('country'), type: "text", id: "country_name" },
                                { label: _('email'), type: "text", id: "email" },
                                { label: _('phone'), type: "text", id: "phone" },
                                { label: _('createdon'), type: "date", id: "createdon", format: webix.i18n.parseFormatStr },
                                { label: _('editedon'), type: "date", id: "editedon", format: webix.i18n.parseFormatStr },
                                { label: _('persons_count'), type: "text", id: "persons_count" },
                                { label: _('url_hash'), type: "text", id: "url_hash" },
                            ]
                        }]
                    }
                }]
            }]
        }]
    });

    webix.extend(mainWrapper, webix.ProgressBar);

    if (visax.sessions.length > 0) {
        $$userSessionsStore.add(visax.sessions[0]);
        load_session(visax.sessions[0].id);
    }

});
