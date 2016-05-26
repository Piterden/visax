<?php
if ('OnPageNotFound' != $modx->event->name)
{
    return false;}
$alias = $modx->context->getOption('request_param_alias', 'q');
if (!isset($_REQUEST[$alias]))
{
    return false;}

$request = $_REQUEST[$alias];
$tmp = explode('/', $request);
if ('visa' == $tmp[0] && count($tmp) >= 2)
{
    $url_hash = str_replace(array('.html', '.php'), '', $tmp[1]);
    if ($tmp[1] != $url_hash || (isset($tmp[2]) && '' == $tmp[2]))
    {
        $modx->sendRedirect($tmp[0].'/'.$url_hash);
    }
    $modx->getService('visax', 'visax', $modx->getOption('visax_core_path', null, $modx->getOption('core_path').'components/visax/').'model/visax/');

    if ($session = $modx->getObject('visaSession', array('url_hash' => $url_hash)))
    {
        $sData = $session->toArray();
        $persons = $session->getMany('Person');

        $pData = array();
        foreach ($persons as $person)
        {
            $pData[] = $person->toArray();
        }
        $sData['persons'] = $pData;

        //$modx->log(xPDO::LOG_LEVEL_ERROR,print_r($fields, true));
        $modx->setPlaceholder('sessions', $modx->toJSON($sData));
        $modx->sendForward(14);

    }
}
