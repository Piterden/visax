<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    // public $primaryKeyField = 'id';
    public $objectType = 'visax.person';
}

return 'visaxPersonRemoveProcessor';
