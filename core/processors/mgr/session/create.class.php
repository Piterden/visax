<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxSessionCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.session';
    // public $primaryKeyField = 'id';
}

return 'visaxSessionCreateProcessor';
