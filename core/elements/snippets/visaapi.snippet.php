<?php
/**
 * VisaAPI snippet for visax extra
 *
 * Copyright 2014 by Bob Ray <http://bobsguides.com>
 * Created on 04-23-2016
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
 */

/**
 * Description
 * -----------
 * Visa API gateway
 *
 * Variables
 * ---------
 * @var $modx modX
 * @var $scriptProperties array
 *
 * @package visax
 **/

// AJAX only
// if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') return false;

if (!$visax = $modx->getService('visax', 'visax', $modx->getOption('visax_core_path', null, $modx->getOption('core_path') . 'components/visax/') . 'model/visax/', $scriptProperties)) {
	return 'Could not load visax class!';
}
$formFields = $modx->request->parameters['REQUEST'];
// echo print_r($formFields);
switch ($formFields['step']) {
	case 'session':
		switch ($formFields['action']) {
			case 'count':
				$sessions_count = $visax->checkSessionExists($formFields['country'], $formFields['email']);
				if ($sessions_count > 0) {
					return $visax->getSessionsList($formFields['email']);
				}
				return $visax->addSession($formFields);
			
			case 'add':
				return $visax->addSession($formFields);
				
			case 'get':
				return $visax->loadSession($formFields['url_hash']);
		}

		break;

	case 'visa':
		switch ($formFields['action']) {
			case 'update':
				return $visax->updateValue($formFields);

		}
		
		break;
	
	case 'confirm':
		// return $visax->loadSession($formFields);
		break;
	
	// case 'confirm':
	// 	# code...
	// 	break;
}