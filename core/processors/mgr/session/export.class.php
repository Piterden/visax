<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxSessionExportProcessor extends modObjectExportProcessor {
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'editedon';
    public $defaultSortDirection = 'DESC';
}

return 'visaxSessionExportProcessor';
