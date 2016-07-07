    /**
     * Adding last visa drop zone
     * @param {[type]} name   [description]
     * @param {[type]} target [description]
     */
    // addLastVisaDropZoneArea = function(name, target) {
    //   var $personsList = $$(target),
    //     $uploadLastVisaAPI = $$('uploadLastVisaAPI'),
    //     XY = webix.html.offset($personsList.$view);

    //   $personsList.$view.id = 'uploadWrap';

    //   var dropZoneArea = new webix.ui({
    //     container: "uploadWrap",
    //     view: "button",
    //     id: "dropZoneArea_" + name,
    //     label: _('drop_zone'),
    //     type: "iconTop",
    //     icon: "upload",
    //     css: "dropzone",
    //     width: XY.width,
    //     height: XY.height - 1,
    //     click: "$$('uploadLastVisaAPI').fileDialog();",
    //     fullScreen: false
    //   });

    //   dropZoneArea.define('css', 'dropzone op1');
    //   $uploadLastVisaAPI.addDropZone(dropZoneArea.$view);

    //   winResizeEv = webix.event(window, 'resize', function(e, t) {
    //     var XY = webix.html.offset($personsList.$view);
    //     dropZoneArea.define('width', XY.width);
    //     dropZoneArea.define('height', XY.height - 1);
    //     dropZoneArea.resize(true);
    //   });

    //   $uploadLastVisaAPI.attachEvent("onBeforeFileAdd", function(item) {
    //     var type = item.type.toLowerCase();
    //     if(type != "jpg" && type != "jpeg" && type != "png" && type != "gif") {
    //       webix.message("Only PNG, JPG, JPEG and GIF images are supported");
    //       return false;
    //     }
    //   });

    //   var onUpCompl = $uploadLastVisaAPI.attachEvent("onUploadComplete", function(response) {
    //     if(response.success) {
    //       var $view = $$(name + '_view');
    //       $$(name).setValue(response.object.url);
    //       updatePerson();
    //       $view.define('data', response.object);
    //       $view.show();
    //       removeDropZoneArea(name);
    //     }
    //   });

    // },

    // removeDropZoneArea = function(name) {
    //   if(!$$('dropZoneArea_' + name)) return;
    //   webix.html.removeCss($$('dropZoneArea_' + name).getNode(), "op1");
    //   webix.delay(function() {
    //     if($$('dropZoneArea_' + name) !== undefined) {
    //       $$('dropZoneArea_' + name).destructor();
    //     }
    //     webix.detachEvent(winResizeEv);
    //   }, webix, [], 500);
    // },

    // addPassportDropZoneArea = function() {
    //   var $uploadPassportAPI = $$('uploadPassportAPI'),
    //     $contaier = $$('passport_scan_view');

    //   $container.$view.id = 'passportUpload';

    //   var dropZoneArea = new webix.ui({
    //     container: "passportUpload",
    //     view: "button",
    //     id: "dropZoneArea_passport",
    //     label: _('drop_zone'),
    //     type: "iconTop",
    //     icon: "upload",
    //     css: "dropzone",
    //     width: XY.width,
    //     height: XY.height - 1,
    //     click: "$$('uploadPassportAPI').fileDialog();",
    //     fullScreen: false
    //   });

    //   dropZoneArea.define('css', 'dropzone op1');
    //   $uploadPassportAPI.addDropZone(dropZoneArea.$view);

    //   winResizeEv = webix.event(window, 'resize', function(e, t) {
    //     var XY = webix.html.offset($container.$view);
    //     dropZoneArea.define('width', XY.width);
    //     dropZoneArea.define('height', XY.height - 1);
    //     dropZoneArea.resize(true);
    //   });

    //   $uploadPassportAPI.attachEvent("onBeforeFileAdd", function(item) {
    //     var type = item.type.toLowerCase();
    //     if(type != "jpg" && type != "jpeg" && type != "png" && type != "gif") {
    //       webix.message("Only PNG, JPG, JPEG and GIF images are supported");
    //       return false;
    //     }
    //   });

    //   var onUpCompl = $uploadPassportAPI.attachEvent("onUploadComplete", function(response) {
    //     if(response.success) {
    //       var $view = $$(name + '_view');
    //       $$(name).setValue(response.object.url);
    //       updatePerson();
    //       $view.define('data', response.object);
    //       $view.show();
    //       removeDropZoneArea(name);
    //     }
    //   });
    // },

    // getSessions = function(email) {
    //   email = email || $$('Step1').getValues().email;
    //   if (webix.rules.isEmail(email)) {
    //     webix.ajax().post(getAjaxUrl('session', 'getlist'), { email: email }, show_modal);
    //   }
    // },


   // wrong_password = function(data) {
    //   webix.message({
    //     type: "error",
    //     text: _('email_fail'),
    //     expire: 5000
    //   });
    // },
