<?php
// Contents of assets/components/tutorial/web.connector.php
if (!empty($_REQUEST['action']))
{
    @session_cache_limiter('nocache');
    define('MODX_REQP', false);
}

require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';

$visaxCorePath = $modx->getOption('visax.core_path', null, $modx->getOption('core_path').'components/visax/');
define('AJAX_PATH', $visaxCorePath.'processors/web/'); // Change to what you use

if ($modx->user->hasSessionContext($modx->context->get('key')))
{
    $_SERVER['HTTP_MODAUTH'] = $_SESSION["modx.{$modx->context->get('key')}.user.token"];
    $_REQUEST['HTTP_MODAUTH'] = $_SERVER['HTTP_MODAUTH'];
}
else
{ // Allow anonymous access
    $_SESSION["modx.{$modx->context->get('key')}.user.token"] = 0;
    $_SERVER['HTTP_MODAUTH'] = 0;
}
// Uncomment if you want the connector work with users who have authenticated to manager but not to front end
if (( $modx->user->hasSessionContext('mgr') || $modx->user->hasSessionContext($modx->context->key))) {
    if ($modx->user->hasSessionContext('mgr')) {
        $_SESSION["modx.{$modx->context->key}.user.token"] = $_SESSION["modx.mgr.user.token"];
    }
    $_SERVER['HTTP_MODAUTH'] = $_SESSION["modx.{$modx->context->key}.user.token"];
    $_REQUEST['HTTP_MODAUTH'] = $_SERVER['HTTP_MODAUTH'];
}

require_once $visaxCorePath.'model/visax/visax.class.php';
$modx->visax = new visax($modx);

header('Content-Type: application/json');

/* handle request */
$modx->request->handleRequest(array(
    'processors_path' => AJAX_PATH,
    'location'        => ''
));
