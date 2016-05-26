<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.person';
    // public $primaryKeyField = 'id';
}

return 'visaxPersonCreateProcessor';
