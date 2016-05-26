<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxSessionGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'visax.session';
    public $checkListPermission = false;
}
return 'visaxSessionGetListProcessor';
