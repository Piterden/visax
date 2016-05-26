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


class visaxGetlistProcessor extends modObjectGetListProcessor {
    public $classKey = 'mod';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';


    /**
     * Convert category ID to category name for objects with a category.
     * Convert template ID to template name for objects with a template
     *
     * Note: It's much more efficient to do these with a join, but that can
     * only be done for objects known to have the field. This code can
     * be used on any object.
     *
     * @param xPDOObject $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $fields = $object->toArray();
        if (array_key_exists('category', $fields)) {
            if (!empty($fields['category'])) {
                $categoryObj = $this->modx->getObject('modCategory', $fields['category']);
                if ($categoryObj) {
                    $fields['category'] = $categoryObj->get('category');
                } else {
                    $fields['category'] = $this->modx->lexicon('invalid_category');
                }
            } else {
                $fields['category'] = $this->modx->lexicon('none');
            }
        }
        if (array_key_exists('template', $fields)) {
            if (!empty($fields['template'])) {
                $templateObj = $this->modx->getObject('modTemplate', $fields['template']);
                if ($templateObj) {
                    $fields['template'] = $templateObj->get('category');
                } else {
                    $fields['template'] = $this->modx->lexicon('invalid_template');
                }
            } else {
                $fields['template'] = $this->modx->lexicon('none');
            }
        }


        return $fields;
    }
}
return 'visaxGetlistProcessor';
