<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonGetProcessor extends modObjectGetProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
	public $objectType = 'visax.person';
}

return 'visaxPersonGetProcessor';
