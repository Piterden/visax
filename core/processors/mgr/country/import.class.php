<?php
/**
 * Processor file for visax extra
 *
 * Copyright 2014 by Bob Ray <http://bobsguides.com>
 * Created on 04-26-2016
 *
 * visax is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * visax is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * visax; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxCountryImportProcessor extends modObjectProcessor {
    public $classKey = 'visaCountry';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.country';
    /** @var string $nameField The name, or unique, field for the object */
    public $nameField = 'id';
    /** @var boolean $setName Whether or not to attempt to set the name field */
    public $setName = true;
    /** @var string $fileProperty The property that contains the file data */
    public $fileProperty = 'file';
    /** @var JSONObject $json The parsed JSON from the file */
    public $json = '';


    public function initialize() {
        $file = $this->getProperty($this->fileProperty);
        if (empty($file) || !isset($file['tmp_name'])) return $this->modx->lexicon('import_err_upload');
        if ($file['error'] != 0) return $this->modx->lexicon('import_err_upload');
        if (!file_exists($file['tmp_name'])) return $this->modx->lexicon('import_err_upload');

        $this->json = file_get_contents($file['tmp_name']);
        if (empty($this->json)) return $this->modx->lexicon('import_err_upload');

        if (!function_exists('json_decode')) {
            return $this->failure($this->modx->lexicon('visax.json_err_nf'));
        }

        return parent::initialize();
    }

    public function process() {
        /** @var JSON Obj $xml */
        $this->json = @json_decode($this->json);
        if (empty($this->json)) return $this->failure($this->modx->lexicon('visax.import_err_json'));

        $this->object = $this->modx->newObject($this->classKey);

        if ($this->setName) {
            $name = (string)$this->json->name;
            if ($this->alreadyExists($name)) {
                $this->object->set($this->nameField,$this->modx->lexicon('duplicate_of',array('name' => $name)));
            } else {
                $this->object->set($this->nameField,$name);
            }
        }

        $canSave = $this->beforeSave();
        if ($canSave !== true) {
            return $this->failure($canSave);
        }

        if (!$this->object->save()) {
            return $this->failure($this->modx->lexicon($this->objectType.'_err_save'));
        }

        $this->afterSave();
        $this->logManagerAction();
        return $this->success();
    }

    /**
     * Do any before save logic
     * @return boolean
     */
    public function beforeSave() {
        return !$this->hasErrors();
    }
    /**
     * Do any after save logic
     * @return boolean
     */
    public function afterSave() {
        return !$this->hasErrors();
    }

    /**
     * Check to see if the object already exists with this name field
     * @param string $name
     * @return bool
     */
    public function alreadyExists($name) {
        return $this->modx->getCount($this->classKey,array($this->nameField => $name)) > 0;
    }

    /**
     * Log the export manager action
     * @return void
     */
    public function logManagerAction() {
        $this->modx->logManagerAction($this->objectType.'_import',$this->classKey,$this->object->get($this->primaryKeyField));
    }
}

return 'visaxCountryImportProcessor';
