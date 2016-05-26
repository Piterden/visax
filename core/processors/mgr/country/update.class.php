<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxCountryUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'visaCountry';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.country';
    public $primaryKeyField = 'id';
}

return 'visaxCountryUpdateProcessor';
