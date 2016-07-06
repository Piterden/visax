<?php
/**
 * Description
 * -----------
 * en default topic lexicon strings
 *
 * Variables
 * ---------
 * @var $modx modX
 * @var $scriptProperties array
 *
 * @package visax
 **/

$_lang['visax.visax_title'] = 'Онлайн-сервис оформления виз';

/* Objects */
$_lang['visax.session'] = 'Сессия';
$_lang['visax.sessions'] = 'Сессии';
$_lang['visax.sessions_desc'] = 'Список сессий.';
$_lang['visax.session_err_ns'] = 'Не указан номер сессии';
$_lang['visax.session_err_nfs'] = 'Сессия не найдена';
$_lang['visax.session_err_ae'] = 'Сессия существует';
$_lang['visax.session_err_save'] = 'Не могу соранить';

$_lang['visax.person'] = 'Заявка';
$_lang['visax.persons'] = 'Заявки';
$_lang['visax.persons_desc'] = 'Список заявок (персон).';
$_lang['visax.person_err_ns'] = 'Не указан номер заявки';
$_lang['visax.person_err_nfs'] = 'Заявка не найдена';
$_lang['visax.person_add'] = 'Добавить заявителя';
$_lang['visax.person_remove'] = 'Удалить заявителя';
$_lang['visax.person_info'] = 'Инфо';
$_lang['visax.person_err_nsk'] = 'Не указан номер сессии';

$_lang['visax.country'] = 'Страна';
$_lang['visax.country_name'] = 'Страна';
$_lang['visax.countries'] = 'Страны';
$_lang['visax.countries_desc'] = 'Список стран. Активные страны отображаются для выбора пользователю';
$_lang['visax.country_err_ns'] = 'Не указан номер страны';
$_lang['visax.country_err_nfs'] = 'Страна не найдена';

$_lang['visax.currency'] = 'Валюта';
$_lang['visax.currencies'] = 'Валюты';
$_lang['visax.currencies_desc'] = 'Список валют.';
$_lang['visax.currency_err_ns'] = 'Не указан номер валюты';
$_lang['visax.currency_err_nfs'] = 'Валюта не найдена';

$_lang['visax.rate'] = 'Курс валюты';
$_lang['visax.rates'] = 'Курсы валют';
$_lang['visax.rates_desc'] = 'Список курсов валют.';
$_lang['visax.rate_err_ns'] = 'Не указан номер курса';
$_lang['visax.rate_err_nfs'] = 'Курс не найден';

$_lang['visax.rate_source'] = 'API курсов валют';
$_lang['visax.rate_sources'] = 'API курсов валют';
$_lang['visax.rate_sources_desc'] = 'Список API курсов валют.';
$_lang['visax.rate_source_err_ns'] = 'Не указан номер API';
$_lang['visax.rate_source_err_nfs'] = 'API не найдено';

/* Fields */
$_lang['visax.id'] = 'ID';
$_lang['visax.name'] = 'Название';
$_lang['visax.key'] = 'Имя в системе';
$_lang['visax.createdon'] = 'Дата создания';
$_lang['visax.editedon'] = 'Дата изменения';
$_lang['visax.sign'] = 'Обозначение';
$_lang['visax.rank'] = 'Порядок';
$_lang['visax.public'] = 'Отображать пользователям';
$_lang['visax.phone'] = 'Контактный телефон';
$_lang['visax.email'] = 'Email';
$_lang['visax.persons_count'] = 'Кол-во заявок';
$_lang['visax.url_hash'] = 'MD5 сумма';
$_lang['visax.state'] = 'Статус';
$_lang['visax.firstname'] = 'Имя';
$_lang['visax.sirname'] = 'Фамилия';
$_lang['visax.patronymic'] = 'Отчество';
$_lang['visax.birth_date'] = 'Дата рождения';
$_lang['visax.desired_time'] = 'Желаемое время визита';
$_lang['visax.mother_fio'] = 'ФИО Матери';
$_lang['visax.mother_address'] = 'Телефон матери';
$_lang['visax.mother_phone'] = 'Адрес проживания матери';
$_lang['visax.father_fio'] = 'ФИО отца';
$_lang['visax.father_address'] = 'Телефон отца';
$_lang['visax.father_phone'] = 'Адрес проживания отца';
$_lang['visax.trip_target'] = 'Цель поездки';
$_lang['visax.visa_type'] = 'Тип визы';
$_lang['visax.prev_surnames'] = 'Предыдущие фамилии';
$_lang['visax.marital_status'] = 'Семейное положение';
$_lang['visax.married'] = 'Женат / Замужем';
$_lang['visax.no_married'] = 'Не женат / Не замужем';
$_lang['visax.registration_region'] = 'Регион регистрации';
$_lang['visax.registration_address'] = 'Адрес регистрации';
$_lang['visax.residential_address'] = 'Адрес проживания';
$_lang['visax.employment'] = 'Занятость';
$_lang['visax.empl_function'] = 'Должность';
$_lang['visax.empl_address'] = 'Место работы/учебы';
$_lang['visax.empl_phone'] = 'Телефон места работы/учебы';
$_lang['visax.last_visa'] = 'Я уже получал визу за последние 3 года';
$_lang['visax.visa_scan'] = 'Скан визы';
$_lang['visax.visa_scan_pls'] = 'Нажмите для выбора фото или скана визы';
$_lang['visax.pass_scan'] = 'Скан загранпаспорта';
$_lang['visax.pass_scan_pls'] = 'Нажмите для выбора фото или скана загранпаспорта';
$_lang['visax.price'] = 'Цена';
$_lang['visax.empty_persons'] = 'Количество заявок';
$_lang['visax.parents_group'] = 'Информация о родителях';
$_lang['visax.one_time'] = 'Однократная';
$_lang['visax.many_time'] = 'Многоразовая';
$_lang['visax.work'] = 'Работаю';
$_lang['visax.vuz'] = 'Учусь в ВУЗе';
$_lang['visax.school'] = 'Учусь в школе';
$_lang['visax.not_work'] = 'Не работаю';
$_lang['visax.pension'] = 'Пенсионер';
$_lang['visax.employment_group'] = 'Информация о занятости';
$_lang['visax.empty_persons_pls'] = 'Укажите количество заявок';
$_lang['visax.country_pls'] = 'Укажите страну';
$_lang['visax.persons_count_pls'] = 'Укажите количество виз';
$_lang['visax.email_pls'] = 'Укажите email адрес';
$_lang['visax.sirname_pls'] = 'Укажите фамилию';
$_lang['visax.firstname_pls'] = 'Укажите имя';
$_lang['visax.patronymic_pls'] = 'Укажите отчество';
$_lang['visax.birth_date_pls'] = 'Укажите дату рождения';
$_lang['visax.mother_fio_pls'] = 'Укажите ФИО матери';
$_lang['visax.mother_phone_pls'] = 'Укажите телефон матери';
$_lang['visax.mother_address_pls'] = 'Укажите адрес матери';
$_lang['visax.father_fio_pls'] = 'Укажите ФИО отца';
$_lang['visax.father_phone_pls'] = 'Укажите телефон отца';
$_lang['visax.father_address_pls'] = 'Укажите адрес отца';
$_lang['visax.trip_target_pls'] = 'Укажите цель поездки';
$_lang['visax.visa_type_pls'] = 'Укажите тип визы';
$_lang['visax.prev_surnames_pls'] = 'Укажите предыдущие фамилии';
$_lang['visax.marital_status_pls'] = 'Укажите семейное положение';
$_lang['visax.registration_region_pls'] = 'Укажите регион регистрации';
$_lang['visax.registration_address_pls'] = 'Укажите адрес регистрации';
$_lang['visax.residential_address_pls'] = 'Укажите адрес проживания';
$_lang['visax.employment_pls'] = 'Укажите род деятельности';
$_lang['visax.empl_function_pls'] = 'Укажите должность';
$_lang['visax.empl_address_pls'] = 'Укажите адрес места работы';
$_lang['visax.empl_phone_pls'] = 'Укажите рабочий телефон';
$_lang['visax.desired_time_pls'] = 'Когда вам удобно посетить визовый центр?';
$_lang['visax.drop_zone'] = 'Переташите сюда изображение или нажмите для выбора файла';

/* Actions */
$_lang['visax.actions'] = 'Действия';
$_lang['visax.create'] = 'Добавить';
$_lang['visax.create_el'] = 'Добавить элемент';
$_lang['visax.update'] = 'Обновить';
$_lang['visax.update_el'] = 'Обновить элемент';
$_lang['visax.edit'] = 'Редактировать';
$_lang['visax.import'] = 'Импорт';
$_lang['visax.remove'] = 'Удалить';
$_lang['visax.remove_many'] = 'Удалить несколько';
$_lang['visax.remove_confirm'] = 'Подтвердите удаление';
$_lang['visax.remove_many_confirm'] = 'Подтвердите удаление нескольких элементов';
$_lang['visax.country_combo_placeholder'] = 'Выберите страну';
$_lang['visax.currency_combo_placeholder'] = 'Выберите валюту';
$_lang['visax.empty'] = 'Пусто';
$_lang['visax.ok'] = 'Ок';
$_lang['visax.cancel'] = 'Отмена';
$_lang['visax.no'] = 'Нет';
$_lang['visax.yes'] = 'Да';
$_lang['visax.close'] = 'Закрыть';
$_lang['visax.sess_list'] = 'Список сессий пользователя ';
$_lang['visax.load_sess'] = 'Загрузка сессии';
$_lang['visax.load_confirm'] = 'Подтвердите загрузку сессии';
$_lang['visax.step_1'] = 'Шаг 1';
$_lang['visax.step_2'] = 'Шаг 2';
$_lang['visax.step_3'] = 'Шаг 3';
$_lang['visax.new_sess_start'] = 'Начать новую сессию';
$_lang['visax.clear'] = 'Очистить форму';
$_lang['visax.continue'] = 'Продолжить';
$_lang['visax.invalid_form'] = 'Неправильно заполнена форма';
$_lang['visax.loading'] = 'Загрузка...';
$_lang['visax.return_filling'] = 'Вернуться к заполнению';

/* Others */
$_lang['visax.json_err_nf'] = 'JSON функция не найдена';
$_lang['visax.import_err_json'] = 'Ошибка импорта JSON';


$_lang['visax.new_category'] = '';




/* Used in upload.class.php */
$_lang['visax.err_file_ns'] = '';
$_lang['visax.error_tvid_ns'] = '';
$_lang['visax.error_tvid_invalid'] = '';

/* Used in transport.menus.php */
$_lang['visax.ex_menu_desc'] = '';

/* Used in excanvas.js */
$_lang['visax.gradient'] = '';
$_lang['visax.gradientradial'] = '';

/* Used in currency.grid.js */
$_lang['visax.delete'] = '';
$_lang['visax.confirm_delete'] = '';
$_lang['visax.remove_currency'] = '';

/* Used in rate.grid.js */
$_lang['visax.remove_rate'] = '';

/* Used in country.windows.js */
$_lang['visax.update_el'] = '';
$_lang['visax.category'] = '';

/* Used in session.windows.js */
$_lang['visax.session_edit'] = '';

/* Used in ratesource.grid.js */
$_lang['visax.remove_ratesource'] = '';

