<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxCountryRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'visaCountry';
    public $languageTopics = array('visax:default');
    public $primaryKeyField = 'id';
    public $objectType = 'visax.country';
}

return 'visaxCountryRemoveProcessor';
