<?php
/**
 * Processor file for visax extra
 *
 * currency
 * country
 * phone
 * email
 * createdon
 * editedon
 * url_hash
 * state
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */

class visaxSessionCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.session';
    public $requiredFields = array('country', 'email');

    public $personsCount;

    /**
     * @return boolean
     */
    public function initialize()
    {
        $this->personsCount = $this->getProperty('persons_count', false);
        if (!$this->personsCount)
        {
            return $this->modx->lexicon('visax.empty_persons');
        }
        return parent::initialize();
    }

    public function process()
    {
        // Validation
        foreach ($this->requiredFields as $fKey)
        {
            if (!$fValue = $this->getProperty($fKey, false))
            {
                return $this->failure($fKey.'. '.$this->modx->lexicon('field_required'), array(
                    'field' => $fKey
                ));
            }
            $$fKey = $fValue;
        }

        $now = time();
        $url_hash = md5($this->getProperty('country', '').$this->getProperty('email', '').$now);

        if ($this->getProperty('step', 'check') != 'force')
        {
            $criteria = array(
                'country' => $country,
                'email'   => $email
            );
            if ($this->doesAlreadyExist($criteria))
            {
                $response = $this->modx->runProcessor('web/session/getlist', array(
                    'email' => $email
                ), array(
                    'processors_path' => $this->modx->visax->config['processorsPath']
                ));

                $data = $this->modx->fromJSON($response->getResponse());
                if (true === $data['success'])
                {
                    return $this->outputArray($data['results'], $data['total'], 'show_modal');
                }
                return $this->failure($this->modx->lexicon('visa.session_err_getlist'));
            }
        }

        // Configure
        $this->setProperty('createdon', $now);
        $this->setProperty('editedon', $now);
        $this->setProperty('url_hash', $url_hash);
        $this->setProperty('state', 'filling');
        $this->unsetProperty('ctx');
        $this->unsetProperty('action');
        $this->unsetProperty('persons_count');

        $this->object->fromArray($this->getProperties()); // Set values

        $persons = array();
        for ($i = 0; $i < $this->personsCount; ++$i)
        {
            if (!$person = $this->modx->newObject('visaPerson'))
            {
                return $this->failure($this->modx->lexicon('visa.person_err_save'));
            }
            $persons[] = $person;
        }
        $this->object->addMany($persons, 'Persons');

        // Save
        if (!$this->object->save())
        {
            $this->modx->error->checkValidation($this->object);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_save'));
        }

        $persArray = array();
        foreach ($persons as $person)
        {
            $arr = $person->toArray();
            if (!$arr['deleted']) {
                $persArray[] = $arr;
            }
        }

        $this->object->set('persons', $persArray);
        $this->object->set('persons_count', count($persons));
        $this->object->set('country_name', $this->object->getOne('Country')->get('name'));

        $data = $this->object->toArray();

        $this->modx->visax->sendMailToUser($data);

        // $this->logManagerAction();
        return $this->outputArray($data, 1, 'new_session');
    }

    /**
     * Return array of objects (with count) converted to JSON.
     * @param  array  $array An array of data objects.
     * @param  mixed  $count The total number of objects. Used for pagination.
     * @return string The JSON output.
     */
    public function outputArray(array $array, $count = false, $message = '')
    {
        if (false == $count)
        {
            $count = count($array);
        }
        return '{"message":"'.$message.'","success":true,"total":"'.$count.'","results":'.$this->modx->toJSON($array).'}';
    }
}

return 'visaxSessionCreateProcessor';
