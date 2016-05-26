<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxCountryGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'visaCountry';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'visax.country';
    public $checkListPermission = false;
}
return 'visaxCountryGetListProcessor';
