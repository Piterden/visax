<?php
/**
 * Processor file for visax extra
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonExportProcessor extends modObjectExportProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'sirname';
    public $defaultSortDirection = 'ASC';
}

return 'visaxPersonExportProcessor';
