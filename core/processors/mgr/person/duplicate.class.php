<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonDuplicateProcessor extends modObjectDuplicateProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.person';
}

return 'visaxPersonDuplicateProcessor';
