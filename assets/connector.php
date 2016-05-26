<?php
/**
* Connector file for visax extra
*
* @package visax
*/
/* @var $modx modX */

require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$visaxCorePath = $modx->getOption('visax.core_path', null, $modx->getOption('core_path') . 'components/visax/');
require_once $visaxCorePath . 'model/visax/visax.class.php';
$modx->visax = new visax($modx);

$modx->lexicon->load('visax:default');

// $ctx = isset($_REQUEST['ctx']) && !empty($_REQUEST['ctx']) ? $_REQUEST['ctx'] : 'mgr';
// $modx->initialize($ctx);

/* handle request */
$path = $modx->getOption('processorsPath', $modx->visax->config, $visaxCorePath . 'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));
