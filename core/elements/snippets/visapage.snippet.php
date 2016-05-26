<?php
/**
 * Description
 * -----------
 * Visa page processing
 *
 * Variables
 * ---------
 * @var $modx             modX
 * @var $scriptProperties array
 *
 * @package visax
 */

$visax_core_path = $modx->getOption('visax_core_path', null, $modx->getOption('core_path').'components/visax/');
$visax_assets_url = $modx->getOption('visax_assets_url', null, $modx->getOption('assets_url').'components/visax/');

if (!$visax = $modx->getService('visax', 'visax', $visax_core_path.'model/visax/', $scriptProperties))
{
    return 'Could not load visax class!';
}

$modx->lexicon->load('visax:default');

$modx->regClientCSS($visax_assets_url.'css/webix.css');
$modx->regClientCSS($visax_assets_url.'css/skins/flat.css');
$modx->regClientCSS($visax_assets_url.'css/visax.css');

// $modx->regClientStartupScript('http://cdn.webix.com/edge/webix.js');
// $modx->regClientStartupScript($visax_assets_url . 'js/visax.skin.js');

// $modx->regClientStartupScript($visax_assets_url.'js/backbone-min.js');
$modx->regClientStartupScript($visax_assets_url.'js/webix.js');
$modx->regClientStartupScript($visax_assets_url.'js/vanillamask.js');
$modx->regClientStartupScript($visax_assets_url.'js/visax.data.js');

$modx->regClientStartupHTMLBlock('
	<script type="text/javascript">
		visax = {};
		visax.web_connector_url = "'.$modx->visax->config['webConnectorUrl'].'";
		visax.max_persons = "'.$modx->visax->config['maxPersons'].'";
		visax.lexicon = '.$modx->toJSON($modx->lexicon->fetch('visax.', true)).';
		visax.sessions = ['.$modx->getPlaceholder('sessions').'];
		visax.container = "'.$modx->visax->config['container'].'";
	</script>
');

$modx->regClientStartupScript($visax_assets_url.'js/visax.form.js');