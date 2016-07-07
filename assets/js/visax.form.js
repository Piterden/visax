// String.prototype.visualLength = function() {
//   var ruler = document.getElementById("ruler");
//   ruler.innerHTML = this;
//   return ruler.offsetWidth + 30;
// };

+(function(document, window, webix, visax, undefined) {

  /*********************
   * PRIVATE
   *********************/

  var $$userSessionsStore, // session storage
    $$personsStore, // persons for current session storage
    currentSessionId,
    winResizeEv, // event id
    timeoutID, // save timeout id
    mainWrapper,

    /**
     * Capitalize word
     * @param  {string} word    Word
     * @param  {bool} onlyFirstLetter Return only first letter with dot
     * @return {string}         Capitalized
     */
    _C = function(word, onlyFirstLetter) {
      if(!word) return '';
      word = word.toLowerCase();
      return(!onlyFirstLetter) ? word[0].toUpperCase() + word.slice(1) + ' ' : word[0].toUpperCase() + '. ';
    },

    /**
     * Коллбек таймаута ко всем событиям сохранения за
     */
    updatePerson = function() {
      var $form = $$('visaForm');

      if($form.isDirty()) {
        clearTimeout(timeoutID);
        // Timeout before live save is run
        timeoutID = webix.delay(function() {

          var oldVals = $form.getValues(),
            newVals = $form.getDirtyValues(),
            id = oldVals.id,
            index = $$('visaList').getIndexById(id);

          $$personsStore.updateItem(id, newVals);
          $$('personProps' + index).bind($form);

        }, $form, [], 800);
      }
    },

    /**
     * Инициализация 2 шага - главная форма
     * Initialize step 2 - main order form
     * @param  {number} id of current session
     * @return {void}
     */
    initStep2 = function(id) {
      var $modal = $$('sessions_list'),
        $personsList = $$('visaList'),
        $singlePersonForm = $$('visaForm'),
        recentPersIndex = getRecentPersonIndex(id),
        recentPersId = $$personsStore.getIdByIndex(recentPersIndex),
        persons = $$userSessionsStore.getItem(id).persons,
        $surnamesList = $$('surnamesList');

      id = id || currentSessionId;

      if($modal !== undefined) $modal.close();

      // Связывание хранилищ, форм и списков
      $personsList.sync($$personsStore);
      $$personsStore.addBind($personsList);
      $singlePersonForm.bind($personsList);

      // Выбор актуального заявителя и сессии
      $personsList.select(recentPersId);
      $$userSessionsStore.setCursor(id);

      // Обновление списка фамилий
      $surnamesList.updateSelf(recentPersId);

      bindEventListeners($singlePersonForm, $personsList, $surnamesList);
      updateAllCosts();
    },

    /**
     * Toggle person in form by click on list item
     * @param  {number} oldId
     * @return {void}
     */
    togglePerson = function($singlePersonForm, oldId) {
      $$personsStore.updateItem(oldId, $singlePersonForm.getDirtyValues());
    },

    /**
     * Обновляет превью полей загрузки файлов
     * @param  {[type]} personId [description]
     * @return {[type]}          [description]
     */
    updateUploaderThumbs = function(personId) {
      var person = $$personsStore.getItem(personId);
      $$('last_visa_scan_thumb').define('data', { url: person.last_visa_scan });
      $$('passport_scan_thumb').define('data', { url: person.passport_scan });
    },

    /**
     * Вешаем обработчики событий
     * @return {[type]} [description]
     */
    bindEventListeners = function($singlePersonForm, $personsList, $surnamesList) {
      /**
       * Переключение заявителей в списке
       * Persons list item click handler (side bar step 2)
       */
      $personsList.attachEvent('onItemClick', function(newId) {
        var oldId = this.getSelectedId();
        if(newId == oldId) return false;

        if($singlePersonForm.isDirty()) {
          togglePerson($singlePersonForm, oldId);
        }
        $surnamesList.updateSelf(newId);
        updateUploaderThumbs(newId);
      });

      /**
       * Обновление после выбора в списке предыдущих фамилий
       */
      $personsList.attachEvent('onSelectChange', function(id) {
        $surnamesList.updateSelf(id);
      });

      /**
       * После редактирования фамилии в списке предыдущих фамилий
       */
      $surnamesList.attachEvent("onAfterEditStop", function(state, editor) {
        if(state.value != state.old) {
          this.updateSelfStr();
        }
      });
      $surnamesList.$view.addEventListener('keyup', function(e) {
        var text = e.target.value,
          width = String(text).visualLength();
        e.target.parentNode.style.width = width + "px";
      });

      /**
       * Прекращение ввода текста внутри формы
       * Handling 'onkeyup' native DOM event
       * @param  (HTML_Node, event, handler, this)
       * @return event id
       */
      webix.event($singlePersonForm.getNode(), "keyup", function(e) {
        updatePerson();
      }, { master: $$('visaForm') });

    },

    /**
     * Получает индекс заявителя в списке
     * @param  {Number} id заявителя
     * @return {Number}    индекс
     */
    getPersonIndex = function(id) {
      return $$personsStore.getIndexById(id);
    },

    /**
     * Формирует заголовок заявителя из ФИО
     * @param  {Object} person объект заявителя
     * @return {String}        Фамилия И.О. или Заявитель №
     */
    getPersonTitle = function(person) {
      return !person.sirname || !person.sirname.length ?
        'Заявитель №' + (getPersonIndex(person.id) + 1) :
        _C(person.sirname) + _C(person.firstname) + _C(person.patronymic);
    },

    /**
     * Получает свойства заявителя для шага 3
     * @param  {Object} person  объект заявителя
     * @return {Array}          список свойств
     */
    getPropertiesList = function(person) {
      var elems = [];
      for(var key in person) {
        if(person.hasOwnProperty(key) && key != 'id' && key != 'session') {
          var val = person[key] || _('empty'),
            el = { label: _(key), type: "text", id: key, value: val };

          if(key == 'birth_date' || key == 'desired_time') {
            el.type = 'date';
            el.format = webix.i18n.parseFormatStr;
          }

          elems.push(el);
        }
      }
      return elems;
    },

    addPersonToAccordion = function(person, i) {
      if(i === undefined) {
        i = getPersonIndex(person.id);
      }
      var elems = getPropertiesList(person),
        title = getPersonTitle(person),
        viewConfig = {
          borderless: true,
          header: title,
          headerHeight: 41,
          headerAlt: title + " (Открыть)",
          headerAltHeight: 41,
          view: "accordionitem",
          collapsed: true,
          css: "collapsed",
          body: {
            view: "property",
            id: "personProps" + i,
            editable: false,
            elements: elems,
            nameWidth: 400,
            height: elems.length * 40
          }
        };
      $$('propsAccord').addView(viewConfig, i + 2);
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

      for(var i = 0, l = persons.length; i < l; i++) {
        var person = persons[i];
        addPersonToAccordion(person, i);
      }

    },

    /**
     * Загрузка новой сессии по id
     */
    loadSession = function(id) {
      var session = $$userSessionsStore.getItem(id),
        persons = session.persons,
        url = 'visa/' + session.url_hash,
        title = document.title + ' | Пользователь ' + session.email;

      // Кешируем id активной сессии
      $$userSessionsStore.setCursor(id);

      mainWrapper.hideProgress();
      $$personsStore.clearAll();
      $$personsStore.parse(persons);

      initStep2(id);

      $$('tabbar').setValue('Step2');
      $$('Step2').enable();
      window.history.pushState({ webix: true }, title, url);

      initStep3(session, persons);
    },

    getDesiredDatesRange = function() {
      var start = new Date(),
        y = start.getFullYear(),
        m = start.getMonth(),
        d = start.getDate(),
        end = new Date(y, m + 1, d);
      return [start, end];
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
    ajaxCallback = function(data) {
      if(typeof data == 'string') {
        data = JSON.parse(data);
      }
      mainWrapper.hideProgress();
      if(data.success) {
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
    getRecentPersonIndex = function(sessionId) {
      return 0;
    },

    getPersonsLimit = function() {
      var mp = Number(visax.max_persons),
        optArr = [];
      for(var i = 1; i <= mp; i++) {
        optArr.push({ id: i, value: i });
      }
      return optArr;
    },

    getPersonAgeById = function(id) {
      var person = $$personsStore.getItem(id) || {},
        b_d = person.birth_date || visax.default_birth_date;
      return((new Date()) - b_d) / 1000 / 60 / 60 / 24 / 365;
    },

    calcPersonCostById = function(personId) {
      personId = personId || $$('visaForm').getValues().id;

      var person = $$personsStore.getItem(personId),
        cost = 540 + 500,
        age = getPersonAgeById(personId);

      // Age rules
      // if(age <= 17) cost += 500;
      if(age > 17 && age <= 64) cost -= 50;
      if(age > 64 && age <= 69) cost += 400;
      if(age > 69 && age <= 74) cost += 850;
      if(age > 74 && age <= 79) cost += 1300;
      if(age > 79 && age <= 84) cost += 1750;
      if(age > 84) cost += 2650;

      // Region rules
      if(!!person && person.registration_region != 1) cost += 50;

      return cost;
    },

    /**
     * Обновление цены
     * @return {[type]} [description]
     */
    updateAllCosts = function() {
      var persons = $$personsStore.data.getRange(),
        session = $$userSessionsStore.getItem($$userSessionsStore.getCursor()) || {},
        totalCost = 0;

      if(!!session.state && session.state == 'filling') {
        persons.forEach(function(person, index) {
          totalCost += calcPersonCostById(person.id);
        });
      }

      $$('priceBlock').define('data', { cost: totalCost });
    },

    refreshThumbs = function(uploaderId, data) {
      var $uploaderView = $$(uploaderId),
        files = getFileFromField($uploaderView),
        $thumbView = $$($uploaderView.config.name + '_thumb'),
        fileUrl = data.url;
      if (fileUrl) {
        $uploaderView.setValue(fileUrl);
      } else {
        if(files.length > 0 && files[0].status == 'server') {
          fileUrl = files[0].value;
        }
      }
      $thumbView.define('data', {
        url: fileUrl || ''
      });
      updatePerson();
      return true;
    },

    getFileFromField = function($uploaderView) {
      return $uploaderView && $uploaderView.files.data.getRange();
    },

    TplPaymentForm = function(obj) {
      return "<div class='price-wrap'>" +
        "<div class='top-line'>" +
        "<span class='label'>Итого: </span>" +
        "<strong id='totalPrice'>" + webix.i18n.priceFormat(obj.cost) + "</strong>" +
        "</div>" +
        "<div class='bottom-line'>" +
        "<form action='https://rbkmoney.ru/acceptpurchase.aspx' name='pay' method='POST'>" +
        "<input type='hidden' name='eshopId' value=''>" +
        "<input type='hidden' name='orderId' value=''>" +
        "<input type='hidden' name='serviceName' value=''>" +
        "<input type='hidden' name='recipientAmount' value=''>" +
        "<input type='hidden' name='recipientCurrency' value='RUR'>" +
        "<input type='hidden' name='user_email' value=''>" +
        "<input type='hidden' name='successUrl' value=''>" +
        "<input type='hidden' name='failUrl' value=''>" +
        "<input type='hidden' name='userField_1' value=''>" +
        "<input type='hidden' name='userField_2' value=''>" +
        "<button id='toPay' class='btn btn-primary' type='submit'>Оплатить</button>" +
        "</form>" +
        "</div>" +
        "</div>";
    },

    /**
     * Форма шага 1
     */
    UiStep1 = function() {
      return { // STEP 1
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
            value: 1,
            options: {
              view: "suggest",
              id: "countryListSuggest",
              borderless: true,
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
            icon: false,
            value: "(123) 456-78-90"
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
            value: "denfromp@gmail.com"
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
              if(!form.validate()) {
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
      };
    },

    UiMainForm = function() {
      return { // MAIN FORM
        id: "visaForm",
        view: "form",
        gravity: 3,
        scroll: false,
        autoheight: true,
        elementsConfig: {
          labelPosition: "top",
          margin: 10
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
            id: "surnamesList",
            label: _('prev_surnames'),
            placeholder: _('prev_surnames_pls'),
            height: 68,
            editable: true,
            editor: "text",
            editValue: "value",
            editaction: "click",
            scroll: false,
            layout: 'x'
          }, {
            height: 68,
            cols: [{
              view: "datepicker",
              id: "birthDatepicker",
              name: "birth_date",
              timepicker: false,
              minTime: "8:00",
              maxTime: "18:30",
              icons: true,
              required: true,
              label: _('birth_date'),
              placeholder: _('birth_date_pls'),
              on: {
                "onChange": function(newv, oldv) {
                  var form = this.getFormView(),
                    birth_date = Date.parse(form.getValues().birth_date),
                    now = Date.now(),
                    $parentsGroup = $$('parentsGroup'),
                    $upload = $$('uploadPassportAPI');
                  if((now - birth_date) / 1000 < (18 * 60 * 60 * 24 * 365)) {
                    $parentsGroup.show();
                    if($upload.$view.getElementsByTagName('button').length > 0) {
                      $upload.$view.getElementsByTagName('button')[0].innerText = "Загрузить скан свидетельства о рождении";
                    }
                  } else {
                    $parentsGroup.hide();
                    if($upload.$view.getElementsByTagName('button').length > 0) {
                      $upload.$view.getElementsByTagName('button')[0].innerText = "Загрузить скан паспорта";
                    }
                  }
                  setTimeout(updatePerson, 0);
                },
                "onAfterRender": function() {
                  this.getPopup().attachEvent("onShow", function() {
                    var upButton = this.$view.getElementsByClassName('webix_cal_month_name')[0];
                    upButton.click();
                    upButton.click();
                  });
                }
              }
            }, {
              view: "phonefield",
              id: "dynamicPhone",
              name: "phone",
              required: true,
              label: _('phone'),
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
                  data: webix.storage.local.get('data_helpers').regions,
                },
              },
              on: {
                "onChange": function() {
                  setTimeout(updatePerson, 0);
                }
              }
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
                { id: 1, value: _('married') },
                { id: 2, value: "Разведен / Разведена" },
                { id: 3, value: "Вдовец / Вдова" }
              ],
              on: {
                "onChange": function() {
                  setTimeout(updatePerson, 0);
                }
              }
            }, {
              height: 68,
              view: "datepicker",
              name: "desired_time",
              id: "desiredDateField",
              required: true,
              label: _('desired_date'),
              placeholder: _('desired_date_pls'),
              timepicker: false,
              suggest: {
                type: "calendar",
                body: {
                  minDate: getDesiredDatesRange()[0],
                  maxDate: getDesiredDatesRange()[1]
                }
              },
              on: {
                "onChange": function(nVal) {
                  var t = $$('desiredTimeField').getValue() || '00:00',
                    a = t.split(':');
                  if(!nVal || typeof nVal == 'string') {
                    nVal = new Date(nVal);
                  }
                  nVal.setHours(a[0], a[1]);
                  setTimeout(updatePerson, 0);
                }
              }
            }, {
              height: 68,
              view: "richselect",
              id: "desiredTimeField",
              required: true,
              label: _('desired_time'),
              placeholder: _('desired_time_pls'),
              borderless: true,
              options: webix.storage.local.get('data_helpers').workTimes,
              on: {
                "onChange": function(nVal) {
                  var $dt = $$('desiredDateField'),
                    d = $dt.getValue() || new Date(),
                    a = nVal.split(':');
                  d.setHours(a[0], a[1]);
                  $dt.setValue(d);
                  $$('visaForm').setDirty(true);
                  setTimeout(updatePerson, 0);
                },
                "onAfterRender": function() {
                  var d = $$('desiredDateField').getValue();
                  if(!d || typeof d == 'string') {
                    d = new Date(d);
                  }
                  var str = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2),
                    timeSet = webix.storage.local.get('data_helpers').workTimes
                    .find(function(t) {
                      return t.id == str;
                    });
                  if(timeSet !== -1) {
                    this.setValue(str);
                  }
                }
              }
            }]
          }, {
            height: 68,
            cols: [{
              view: "richselect",
              name: "trip_target",
              required: true,
              label: _('trip_target'),
              placeholder: _('trip_target_pls'),
              borderless: true,
              options: webix.storage.local.get('data_helpers').tripTargets
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
              ],
              on: {
                "onChange": function() {
                  setTimeout(updatePerson, 0);
                }
              }
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
                  if(!this.data.value || this.data.value == 'not_work' || this.data.value == 'pension') {
                    $$('employment_group').hide();
                  } else {
                    $$('employment_group').show();
                  }
                  setTimeout(updatePerson, 0);
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
            height: 400,
            cols: [{
              rows: [{
                view: "visaxupload",
                name: "passport_scan",
                id: "uploadPassportAPI",
                value: _('passport_scan_text'),
                formData: {
                  source: 2,
                  path: "passportscans/"
                }
              }, {
                view: "uploaderthumb",
                id: "passport_scan_thumb",
                uploader: "uploadPassportAPI"
              }]
            }, {
              rows: [{
                view: "checkbox",
                name: "last_visa",
                labelRight: _('last_visa'),
                customCheckbox: false,
                height: 40,
                relatedView: "last_visa_scan_wrap",
                relatedAction: "show",
                on: {
                  "onChange": function() {
                    setTimeout(updatePerson, 0);
                  }
                }
              }, {
                id: "last_visa_scan_wrap",
                rows: [{
                  view: "visaxupload",
                  name: "last_visa_scan",
                  id: "uploadVizaAPI",
                  value: _('last_visa_scan_text'),
                  formData: {
                    source: 2,
                    path: "visascans/"
                  }
                }, {
                  view: "uploaderthumb",
                  id: "last_visa_scan_thumb",
                  uploader: "uploadVizaAPI"
                }]
              }]
            }]
          },
          { view: "text", name: "price", id: "priceField", hidden: true, value: 0 },
          { view: "text", name: "id", hidden: true, readonly: true, },
          { view: "text", name: "session", hidden: true, readonly: true, }
        ]
      };
    },

    UiPersonsSidebar = function() {
      return { // SIDE LIST
        id: "sideBarWrap",
        rows: [{ css: "text-center", view: "label", label: "Заявители:" }, {
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
              value: _("person_add"),
              click: function() {
                webix.ajax().post(getAjaxUrl('person', 'create'), {
                  session: $$userSessionsStore.getCursor()
                }, ajaxCallback);
              }

            },
            { view: "spacer" }
          ],
        }, {
          view: "list",
          id: "visaList",
          css: "float-block",
          editable: true,
          form: "visaForm",
          type: "perslist",
          select: true,
          autoheight: true,
          scroll: false
        }, {
          view: "template",
          id: "priceBlock",
          template: TplPaymentForm,
          data: {
            cost: 0
          }
        }]
      };
    },

    UiStep2 = function() {
      return {
        id: "Step2", // STEP 2
        disabled: true,
        gravity: 1,
        borderless: true,
        autoheight: true,
        css: "mt1",
        cols: [
          UiMainForm(),
          { view: "resizer", id: "resize_2", disabled: true },
          UiPersonsSidebar()
        ]
      };
    },

    UiStep3 = function() {
      return { // STEP 3
        id: "Step3",
        paddingY: 20,
        cols: [{
          id: "propsAccord",
          view: "accordion",
          paddingX: 18,
          borderless: true,
          multi: true,
          rows: [{
            view: "template",
            template: "<div class='header-wrap step3'>" +
              "<h2>Шаг 3 - проверка и оплата</h2>" +
              "</div>",
            height: 94,
            borderless: true
          }, {
            borderless: true,
            header: _('session'),
            headerHeight: 41,
            headerAlt: _('session') + " (Открыть)",
            headerAltHeight: 41,
            view: "accordionitem",
            collapsed: false,
            body: {
              view: "property",
              id: "sessionProps",
              height: 40 * 7,
              editable: false,
              nameWidth: 300,
              elements: [
                { type: "text", id: "id", hidden: true },
                { label: _('country'), type: "text", id: "country_name" },
                { label: _('email'), type: "text", id: "email" },
                { label: _('phone'), type: "text", id: "phone" },
                { label: _('createdon'), type: "date", id: "createdon", format: webix.i18n.parseFormatStr },
                { label: _('editedon'), type: "date", id: "editedon", format: webix.i18n.parseFormatStr },
                { label: _('persons_count'), type: "text", id: "persons_count" },
                { label: _('url_hash'), type: "text", id: "url_hash" },
              ]
            }
          }]
        }]
      };
    };

  /*********************************
   *********************************
   *********************************
   *********************************
   *********************************/

  /**
   * Тип списка для заявителей в боковой колонке
   */
  webix.type(webix.ui.list, {
    name: "perslist",
    icon: "fa-times",
    butWidth: 21,
    butHeight: 21,
    templateStart: webix.template('<div webix_l_id="#id#" class="{common.classname()}"><div class="overall">'),
    templateEnd: webix.template('</div>{common.removeButton()}</div>'),
    template: function(obj) {
      var idx = $$('visaList').getIndexById(obj.id);
      if(obj.sirname !== undefined && obj.sirname !== null && obj.sirname.length > 1) {
        return "<div class='title'>" + _C(obj.sirname) + _C(obj.firstname, true) + _C(obj.patronymic, true) + "</div><div class='cost'>" + webix.i18n.priceFormat(obj.price) + "</div>";
      }
      return "<div class='small'>Заявитель №" + (idx + 1) + "</div><div class='cost'>" + webix.i18n.priceFormat(obj.price) + "</div>";
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
        webix.confirm({
          title: _('warning'),
          text: _('remove_person_confirm_msg'),
          ok: _('yes'),
          cancel: _('no'),
          type: 'confirm-warning',
          callback: function(ok) {
            if(ok) {
              webix.ajax().post(getAjaxUrl('person', 'remove'), { id: id }, ajaxCallback);
            }
          }
        });
      }
    }
  });

  /**
   * Тип списка с функцией добавления/удаления для предыдущих фамилий
   */
  webix.type(webix.ui.list, {
    name: "multilist",
    classname: function(obj, common, marks) {
      var css = "webix_list_item";
      if(obj.$css) {
        if(typeof obj.$css == "object")
          obj.$css = webix.html.createCss(obj.$css);
        css += " " + obj.$css;
      }
      if(marks && marks.$css)
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
        this.updateSelfStr();
      }
    }
  });

  /**
   * Прототип UI-элемента редактируемого списка
   */
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
      if(label !== undefined && label !== '' && label) {
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
    updateSelf: function(id) {
      if($$personsStore.getItem(id) === undefined) return;

      var $surnamesList = $$('surnamesList'),
        str = $$('visaForm').getDirtyValues().prev_surnames || '';

      if(!str || str === '') {
        $$('surnamesList').clearAll();
        return;
      }

      var arr = str.split(','),
        result = [];
      arr.forEach(function(surname, idx) {
        result.push({ id: idx + 1, value: _C(surname).trim() });
      });

      $$('surnamesList').clearAll();
      $$('surnamesList').parse(result);
    },
    updateSelfStr: function() {
      var values = this.getValues(),
        $strField = $$('prevSurStr');
      $strField.setValue(values.join(','));
      updatePerson();
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

  /**
   * Прототип телефонного поля ввода
   */
  webix.protoUI({
    name: "phonefield",
    $cssName: "text webix_el_richselect",
    defaults: {
      validate: "isPhone",
      placeholder: "(___) ___-__-__",
      icon: "phone",
      on: {
        "onAfterRender": function(data) {
          // Инициализация плагина VanillaMask
          if(!VanillaMask) return;
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

  /**
   * Прототип превью области для загрузчиков картинок
   */
  webix.protoUI({
    name: "uploaderthumb",
    defaults: {
      css: "webix_el_template",
      autoheight: true,
      borderless: true,
      template: function(data, self) {
        if(!data.url) {
          return '<div class="wrapper" style="display:none;"></div>';
        }
        return '<div class="wrapper" style="position:relative;">' +
          '  <img src="' + data.url + '" style="width:100%;"/>' +
          '</div>';
      },
      data: function() {
        var value = $$(this.config.uploader).getValue();
        return { url: value };
      },
      on: {
        "onAfterRender": function() {

        }
      }
    }
  }, webix.ui.template);

  /**
   * Прототип поля загрузки файлов
   */
  webix.protoUI({
    name: "visaxupload",
    defaults: {
      multiple: false,
      accept: "image/png, image/gif, image/jpg",
      upload: getAjaxUrl('person', 'file/upload'),
      status: function(f) {},
      datatype: "json",
      on: {
        "onUploadComplete": ajaxCallback,
        "onBeforeRender": function(data) {
          // data.link = data.link || data.name && data.name + '_thumb';
          refreshThumbs(data.id, data);
        }
      }
    },
    // getRelatedCheckbox: function() {
    //   return this.getParentView()
    // }
  }, webix.ui.uploader);

  /*************************
   ***** On DOM ready ******
   *************************/
  webix.ready(function() {


    webix.i18n.setLocale("ru-RU");
    webix.Date.startOnMonday = true;

    /**
     * Uploader API
     * @type {webix}
     */
    webix.ui({
      view: "uploader",
      id: "uploadLastVisaAPI",
      apiOnly: true,
      multiple: false,
      accept: "image/png, image/gif, image/jpg",
      upload: getAjaxUrl('person', 'file/upload'),
      datatype: "json",
      fullScreen: false,
      formData: {
        source: 2,
        path: "visascans/"
      }
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
          if(obj.editedon !== undefined && obj.editedon !== null)
            obj.editedon = webix.i18n.parseFormatDate(obj.editedon);
          if(obj.createdon !== undefined && obj.createdon !== null)
            obj.createdon = webix.i18n.parseFormatDate(obj.createdon);
          // get lang keys
          obj._status = obj.status;
          obj.status = _(obj.status);
        },
        //turing objects back to strings on saving
        $save: function(obj) {
          // return dates
          if(obj.editedon !== undefined && obj.editedon !== null)
            obj.editedon = webix.i18n.parseFormatStr(obj.editedon);
          if(obj.createdon !== undefined && obj.createdon !== null)
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
          obj.birth_date = obj.birth_date || visax.default_birth_date;

          if(obj.birth_date !== undefined && obj.birth_date !== null)
            obj.birth_date = webix.i18n.parseFormatDate(obj.birth_date);

          obj.price = calcPersonCostById(obj.id);
          updateAllCosts();
        },
        $save: function(obj) {
          if(obj.birth_date !== undefined && obj.birth_date !== null)
            obj.birth_date = webix.i18n.parseFormatStr(obj.birth_date);
        },
        $update: function(obj) {
          this.serialize();

          obj.price = calcPersonCostById(obj.id);
          updateAllCosts();
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
        cells: [UiStep1(), UiStep2(), UiStep3()]
      }]
    });

    webix.extend(mainWrapper, webix.ProgressBar);

    if(visax.sessions.length > 0) {
      $$userSessionsStore.add(visax.sessions[0]);
      loadSession(visax.sessions[0].id);
    }

  });

  /*********************************************************************
   *********************************************************************
   * PUBLIC METHODS
   *********************************************************************
   ********************************************************************/
  webix.extend(window, {

    /**
     * Запускается со стороны бэкенда после успешного обновления заявителя
     */
    person_updated: function(data) {
      var person = data.results,
        index = $$('visaList').getIndexById(person.id),
        $accordionItem = $$('personProps' + index).getParentView(),
        name = (!person.sirname.length) ? 'Заявитель №' + index : _C(person.sirname) + _C(person.firstname) + _C(person.patronymic);

      $$('visaForm').setDirty(!data.success);

      $accordionItem.define('header', name);
      $accordionItem.define('headerAlt', name + ' (Открыть)');
      $accordionItem.refresh();
    },

    /**
     * Запускается со стороны бэкенда после успешного добавления заявителя
     */
    person_added: function(data) {
      if(data.success) {
        $$personsStore.add(data.object);
        addPersonToAccordion(data.object);
        updateAllCosts();
      }
    },

    /**
     * Запускается со стороны бэкенда после успешного удаления заявителя
     */
    person_removed: function(data) {
      if(!data.success) {
        return false;
      }
      var person = data.object,
        propViewName = '$accordionitem' + (getPersonIndex(person.id) + 2);

      $$('propsAccord').removeView(propViewName);
      $$personsStore.remove(person.id);
      updateAllCosts();
    },

    /**
     * Вызывается из бэкенда после создания новой сессии
     */
    new_session: function(data) {
      var session = data.results,
        persons = session.persons || [],
        url = 'visa/' + session.url_hash,
        title = document.title + ' | Пользователь ' + session.email;

      $$userSessionsStore.add(session, session.id);
      $$personsStore.clearAll();
      $$personsStore.parse(persons);

      // Кешируем id активной сессии
      $$userSessionsStore.setCursor(session.id);

      initStep2(session.id);

      $$('tabbar').setValue('Step2');
      $$('Step2').enable();
      window.history.pushState({ webix: true }, title, url);

      initStep3(session, persons);

      webix.alert({
        title: _('msg.session_created_title'),
        ok: _('ok'),
        text: 'На адрес ' +
          session.email +
          ', выслано письмо со ссылкой, чтобы вы в любой момент могли вернуться к заполнению данных анкеты.<br>' +
          'Также, вернуться к заполнению можно, перейдя по ссылке на эту страницу.'
      });
      // webix.alert({
      //   title: _('msg.session_created_title'),
      //   ok: _('msg.session_created_ok'),
      //   text: _('msg.session_created_body')
      // });
    },

    /**
     * Вызывается из бэкенда при существовании подходящих сессий
     * Показывает всплывающее окно со списком сессий
     */
    show_modal: function(data) {
      if(typeof data == 'string') data = JSON.parse(data);
      var sessions = data.results,
        email = sessions[0].email,
        persons = [],
        formFields = $$('Step1').getValues();

      // mainWrapper.hideProgress();
      $$userSessionsStore.clearAll();
      $$userSessionsStore.parse(sessions);

      webix.ui({
        view: "window",
        id: "sessions_list",
        move: true,
        resize: true,
        position: "center",
        height: 300,
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
            autowidth: true,
            scheme: {
              $init: function(obj) {
                obj.data = obj.persons;
                for(var key in obj.data) {
                  if(obj.data.hasOwnProperty(key)) {
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
                  return '<span class="editBtn" title="' + _('return_filling') + '">Отправить ссылку</span><span class="infoBtn" title="' + _('show_persons') + '"></span>';
                }
              }
            ],
            data: $$userSessionsStore,
            onClick: {
              'webix_cell': function(e, id, trg) {
                // console.log(e, id, trg);
              }
            },
            on: {
              'onItemClick': function(id) {
                webix.confirm({
                  title: _('email_repeat'),
                  ok: _('ok'),
                  cancel: _('cancel'),
                  text: _('email_repeat_confirm'),
                  callback: function(success) {
                    if(success) {
                      var data = { sessionId: id.row, email: email };
                      mainWrapper.showProgress({ type: "icon", delay: 3000 });
                      webix.ajax().post(getAjaxUrl('session', 'sendmail'), data, ajaxCallback);
                      return;
                    }
                    //@TODO Error handler. Обработчик ошибок.
                  }
                });
              }
            }
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

    // show_password_form: function(data) {
    //   if(typeof data == 'string') data = JSON.parse(data);

    //   webix.ui({
    //     view: "window",
    //     id: "passwordFormWin",
    //     move: true,
    //     resize: true,
    //     position: "center",
    //     height: 200,
    //     width: 300,
    //     head: {
    //       view: "toolbar",
    //       cols: [
    //         { view: "label", label: _('password_form_head'), gravity: 5 },
    //         { view: "button", label: _('close'), align: "right", gravity: 1, click: "$$('passwordFormWin').close();" }
    //       ]
    //     },
    //     body: {
    //       width: 800,
    //       rows: [
    //         { view: "template", template: _('password_form_message') }, {
    //           view: "button",
    //           id: "emailRepeatButt",
    //           type: "form",
    //           label: _('email_repeat'),
    //           click: function() {
    //             data.results.action = 'session/sendmail';
    //             webix.ajax().post(getAjaxUrl('session', 'sendmail'), data.results, ajaxCallback);
    //           }
    //         }, {
    //           view: "form",
    //           id: "passwordForm",
    //           elements: [
    //             { view: "text", type: "password", label: _('password') }, {
    //               cols: [{}, {
    //                 view: "button",
    //                 gravity: 2,
    //                 value: _('ok'),
    //                 type: "form",
    //                 click: "$$('passwordForm').callEvent('onSubmit');"
    //               }, {}]
    //             }
    //           ],
    //           elementsConfig: {
    //             borderless: true
    //           },
    //           on: {
    //             'onSubmit': function(view, e) {
    //               data.results.action = 'session/create';
    //               data.results.password = this.getChildViews()[0].getValue() || 'empty_pass';
    //               mainWrapper.showProgress({ type: "icon", delay: 3000 });
    //               webix.ajax().post(getAjaxUrl('session', 'create'), data.results, ajaxCallback);
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   }).show();
    // },

    /**
     * Срабатывает после успешной отправки email
     * @param  {Obj} data [description]
     * @return {[type]}      [description]
     */
    email_ok: function(data) {
      var b = $$('emailRepeatButt');
      if(b !== undefined) {
        b.destructor();
      }
      webix.message({
        text: _('email_ok'),
        expire: 5000
      });
    },

    email_fail: function(data) {
      webix.message({
        type: "error",
        text: _('email_fail'),
        expire: 5000
      });
    },

    passportscans_file_uploaded: function(data) {
      refreshThumbs('uploadPassportAPI', data.object);

    },

    visascans_file_uploaded: function(data) {
      refreshThumbs('uploadVizaAPI', data.object);
    }

    // visascans

  });

})(document, window, webix, visax);

