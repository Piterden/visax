<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxCountryCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'visaCountry';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.country';
    // public $primaryKeyField = 'id';
}

return 'visaxCountryCreateProcessor';
