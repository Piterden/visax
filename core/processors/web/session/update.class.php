<?php
/**
 * Processor file for visax extra
 *
 * currency
 * country
 * phone
 * email
 * createdon
 * editedon
 * url_hash
 * state
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxSessionUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.session';
    // public $primaryKeyField = 'id';
}

return 'visaxSessionUpdateProcessor';
