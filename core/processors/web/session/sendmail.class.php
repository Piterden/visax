<?php
/**
 * Processor file for visax extra
 *
 * currency
 * country
 * phone
 * email
 * createdon
 * editedon
 * url_hash
 * state
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */

class VisaxSessionSendMailProcessor extends modProcessor
{
    public $languageTopics = array('visax:default');
    public $email;
    public $session;

    public function initialize()
    {
        if (!$this->email = $this->getProperty('email', false)) {
            return 'need email';
        }
        return parent::initialize();
    }

    public function process()
    {
        if ($sessionId = $this->getProperty('sessionId', false)) {
            $data = $this->modx->getObject('visaSession', array(
                'id' => $sessionId,
                'email' => $this->email
            ))->toArray();
        } else {
            $data = array(
                'email' => $this->email,
                'id' => false
            );
        }
        if (!$this->modx->visax->sendMailToUser($data)) {
            return $this->failure('email_fail');
        }
        return $this->success('email_ok');
    }
}
return 'VisaxSessionSendMailProcessor';
