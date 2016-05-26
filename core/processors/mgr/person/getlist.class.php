<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'sirname';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'visax.person';
	public $checkListPermission = false;
}
return 'visaxPersonGetListProcessor';
