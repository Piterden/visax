<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.person';
    // public $primaryKeyField = 'id';
}

return 'visaxPersonUpdateProcessor';
