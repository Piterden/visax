<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */

class visaxPersonUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.person';
    public $editedon;

    public function initialize()
    {
        $date = new DateTime();
        $this->editedon = $date->format('Y-m-d H:i:s');
        return parent::initialize();
    }

    /**
     * Override in your derivative class to do functionality after save() is run
     * @return boolean
     */
    public function afterSave()
    {
        if (!$session_id = $this->object->get('session', false))
        {
            return $this->modx->lexicon('visax.person_err_nsk');
        }

        if (!$session = $this->modx->getObject('visaSession', $session_id))
        {
            return $this->modx->lexicon('visax.session_err_nfs');
        }

        $session->set('editedon', $this->editedon);
        if (!$session->save())
        {
            return $this->modx->lexicon('visax.session_err_save');
        }

        return true;
    }

    /**
     * Return the success message
     * @return array
     */
    public function cleanup()
    {
        return $this->outputArray($this->object->toArray(), 1, 'person_updated');
    }

    /**
     * Return arrays of objects (with count) converted to JSON.
     * @param  array  $array An array of data objects.
     * @param  mixed  $count The total number of objects. Used for pagination.
     * @return string The JSON output.
     */
    public function outputArray(array $array, $count = false, $message = '')
    {
        if (false === $count)
        {
            $count = count($array);}
        return '{"message":"'.$message.'","success":true,"total":"'.$count.'","results":'.$this->modx->toJSON($array).',"editedon":"'.$this->editedon.'"}';
    }
}

return 'visaxPersonUpdateProcessor';
