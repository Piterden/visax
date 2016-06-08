<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */

class visaxPersonCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.person';

    public $sessionObj;

    /**
     * {@inheritDoc}
     * @return boolean
     */
    public function initialize()
    {
        if (!$sessionId = $this->getProperty('session', false))
        {
        	return "Не указан номер сессии";
        }
        if (!$this->sessionObj = $this->modx->getObject('visaSession', array('id' => $sessionId)))
        {
        	return "Сессия номер $sessionId не найдена";
        }
        return parent::initialize();
    }

    // /**
    //  * @todo Check permissions
    //  * @return boolean
    //  */
    // public function beforeSet()
    // {
    //     return !$this->hasErrors();
    // }

    /**
     * Override in your derivative class to do functionality after save() is run
     * @return boolean
     */
    public function afterSave()
    {
    	$personsList = $this->sessionObj->getMany('Persons');
    	$personsList[] = $this->object;
    	$this->sessionObj->addMany($personsList, 'Persons');
        return true;
    }

    /**
     * Return the success message
     * @return array
     */
    public function cleanup() {
        return $this->success('person_added',$this->object);
    }

}

return 'visaxPersonCreateProcessor';
