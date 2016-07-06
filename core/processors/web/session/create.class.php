<?php
/**
 * Processor file for visax extra.
 *
 * currency
 * country
 * phone
 * email
 * createdon
 * editedon
 * url_hash
 * state
 */

/* @var $modx modX */

class VisaxSessionCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.session';
    public $requiredFields = array('country', 'email', 'persons_count');
    public $processorsPath = '';

    public $persons = array();
    public $personsCount = 0;
    public $country;
    public $email;
    public $urlHash;
    public $now;

    private $password;

    /**
     * @method initialize
     *
     * @return true\string
     */
    public function initialize()
    {
        //Debug
        // $this->modx->setDebug(E_ALL & ~E_NOTICE);

        // return $this->failure($this->modx->lexicon('_err_ae'), array(
        //     'step' => 'Step2',
        //     'action' => '',
        //     'hesh' => $this->getProperties()
        // ));

        $this->processorsPath = $this->modx->visax->config['processorsPath'];
        $this->personsCount = $this->getProperty('persons_count', false);
        $this->country = $this->getProperty('country', false);
        $this->email = $this->getProperty('email', false);
        $this->password = $this->getProperty('password', false);
        $this->now = time();
        $this->urlHash = $this->generateUrlHash();

        return parent::initialize();
    }

    /**
     * Основной процесс
     *
     * @return response
     */
    public function process()
    {
        if ($validationError = $this->validationError()) {
            return $validationError;
        }

        // Если кнопка "Начать новую сессию"
        // нажата - пропускаем проверку
        if ($this->getProperty('step', 'check') != 'force') {
            // Если сессии с этим email присутствуют в БД
            if ($this->doesAlreadyExist(array('email' => $this->email))) {
                return $this->loadSessionsList();
                // // Пароль не заполнялся
                // if ($this->password === 'empty_pass') {
                //     return $this->loadPasswordForm();
                // }
                // // Правильный пароль
                // if ($this->checkPassword()) {
                //     return $this->loadSessionsList();
                // }
                // // Неправильный пароль
                // return $this->loadWrongPass();
            }
        }

        $this->doCleanBeforeSet();
        $this->object->fromArray($this->getProperties()); // Set values

        $personsAdded = $this->addPersonsToSession();
        if ($personsAdded !== true) {
            return $this->failure($personsAdded);
        }

        // Save
        if (!$this->object->save()) {
            $this->modx->error->checkValidation($this->object);

            return $this->failure($this->modx->lexicon($this->objectType.'_err_save'));
        }

        $this->doCleanAfterSave();
        $data = $this->object->toArray();
        $this->modx->visax->sendMailToUser($data);

        return $this->outputArray($data, 1, 'new_session');
    }

    /**
     * Готовит properties к созданию объекта xpdo.
     *
     * @method doCleanBeforeSet
     *
     * @return {void}
     */
    public function doCleanBeforeSet()
    {
        $this->setProperty('createdon', $this->now);
        $this->setProperty('editedon', $this->now);
        $this->setProperty('url_hash', $this->urlHash);
        $this->setProperty('state', 'filling');
        $this->unsetProperty('ctx');
        $this->unsetProperty('action');
        $this->unsetProperty('password');
        $this->unsetProperty('persons_count');
    }

    /**
     * Дополняет объект для вывода после сохранения.
     *
     * @method doCleanAfterSave
     */
    public function doCleanAfterSave()
    {
        $this->object->set('persons', $this->persons);
        $this->object->set('persons_count', count($this->persons));
        $this->object->set('country_name', $this->object->getOne('Country')->get('name'));
    }

    /**
     * Создает и добавляет объекты заявителей к сессии.
     *
     * @method addPersonsToSession
     *
     * @return response
     */
    private function addPersonsToSession()
    {
        $persons = array();

        for ($i = 0; $i < $this->personsCount; ++$i) {
            if (!$person = $this->modx->newObject('visaPerson')) {
                return $this->modx->lexicon('visa.person_err_save');
            }
            $persons[] = $person;
            $this->persons[] = $person->toArray();
        }

        if ($this->object->addMany($persons, 'Persons')) {
            return true;
        }

        return $this->modx->lexicon('visa.person_err_add');
    }

    /**
     * Запрос пароля.
     *
     * @method loadPasswordForm
     *
     * @return response
     */
    private function loadPasswordForm()
    {
        return $this->outputArray($this->getProperties(), 1, 'show_password_form');
    }

    /**
     * Неправильный пароль.
     *
     * @method loadWrongPass
     *
     * @return [type] [description]
     */
    public function loadWrongPass()
    {
        return $this->outputArray($this->getProperties(), 1, 'wrong_password');
    }

    /**
     * Отдает список сессий для email.
     *
     * @method loadSessionsList
     *
     * @return response
     */
    private function loadSessionsList()
    {
        $response = $this->modx->runProcessor(
            'web/session/getlist',
            array('email' => $this->email),
            array('processors_path' => $this->processorsPath)
        );

        $data = $this->modx->fromJSON($response->getResponse());

        if (true === $data['success']) {
            return $this->outputArray(
                $data['results'],
                $data['total'],
                'show_modal'
            );
        }

        return $this->failure($this->modx->lexicon('visa.session_err_getlist'));
    }

    private function validationError()
    {
        foreach ($this->requiredFields as $key) {
            if (!$this->getProperty($key, false)) {
                return $this->failure(
                    $key.'.'.$this->modx->lexicon('field_required'),
                    array('field' => $key)
                );
            }
        }

        return false;
    }

    /**
     * Генерирует хэш для URL сессии.
     *
     * @method generateUrlHash
     *
     * @return
     */
    private function generateUrlHash()
    {
        return hash('md5', $this->country.$this->email.$this->now);
    }

    /**
     * Проверка пароля.
     *
     * @method checkPassword
     *
     * @return bool
     */
    private function checkPassword()
    {
        return $this->modx->visax->generatePassword($this->email) == $this->password;
    }

    /**
     * Форматирует вывод для webix.
     *
     * @method outputArray
     *
     * @param array  $array   Data
     * @param number $count
     * @param string $message
     *
     * @return response
     */
    public function outputArray(array $array, $count, $message = '')
    {
        if (!$count) {
            $count = count($array);
        }

        return '{"message":"'.$message.
            '","success":true,"total":"'.$count.
            '","results":'.$this->modx->toJSON($array).
        '}';
    }
}

return 'VisaxSessionCreateProcessor';
