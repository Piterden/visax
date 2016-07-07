<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */

class visaxPersonRemoveProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.person';
    public $checkSavePermission = false;

    /**
     * Override in your derivative class to do functionality before the fields are set on the object
     * @return boolean
     */
    public function beforeSet()
    {
    	$this->setProperties(array('deleted' => 1));
        return !$this->hasErrors();
    }

    /**
     * Return the success message
     * @return array
     */
    public function cleanup() {
        return $this->success('person_removed',$this->object);
    }
}

return 'visaxPersonRemoveProcessor';
