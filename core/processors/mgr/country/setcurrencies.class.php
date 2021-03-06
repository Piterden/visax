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


class visaxSetcurrenciesProcessor extends modProcessor {
    public $classKey = 'mod';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $ids;

    function initialize() {
        /* Initialization here */
        return true;
    }

    /* For built-in processors (create, update, duplicate, remove),
       this method can be removed */
    public function process() {

        /* perform action here */

        return $this->success();

    }
}

return 'visaxSetcurrenciesProcessor';
