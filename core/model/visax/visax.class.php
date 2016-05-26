<?php
/**
 * CMP class file for visax extra
 *
 * @package visax
 */

class visax
{
    /**
     * @var $modx modX
     */
    public $modx;
    /**
     * @var $props array
     */
    public $config;
    /**
     * True if the class has been initialized or not.
     * @var boolean $_initialized
     */
    private $initialized;

    public function __construct(modX &$modx, array $config = array())
    {
        $this->modx = &$modx;
        $corePath = $modx->getOption('visax.core_path', null,
            $modx->getOption('core_path').'components/visax/');
        $assetsUrl = $modx->getOption('visax.assets_url', null,
            $modx->getOption('assets_url').'components/visax/');

        $this->config = array_merge(array(
            'corePath'                   => $corePath,
            'chunksPath'                 => $corePath.'elements/chunks/',
            'modelPath'                  => $corePath.'model/',
            'processorsPath'             => $corePath.'processors/',
            'templatesPath'              => $corePath.'templates/',

            'assetsUrl'                  => $assetsUrl,
            'cssUrl'                     => $assetsUrl.'css/',
            'jsUrl'                      => $assetsUrl.'js/',
            'connectorUrl'               => $assetsUrl.'connector.php',
            'webConnectorUrl'            => $assetsUrl.'web.connector.php',

            'maxPersons'                 => 5,
            'emailFrom'                  => $modx->getOption('emailsender'),
            'emailFromName'              => 'admin',
            'emailToName'                => 'user',
            'emailSubject'               => 'New session',
            'emailToUserTpl'             => 'email_user',
            'emailToUserPersonTpl'       => 'email_user_person',
            'emailToUserPersonSeparator' => '',
            'container'                  => 'ajaxWrapper'
        ), $config);

        $modx->addPackage('visax', $this->config['modelPath']);
        $modx->lexicon->load('visax:default');
    }

    /**
     * Initializes visax based on a specific context.
     * @access public
     * @param  string $ctx The context to initialize in.
     * @return string The processed content.
     */
    public function initialize($ctx = 'web', $scriptProperties)
    {
        $this->config = array_merge($this->config, $scriptProperties);
        $this->config['ctx'] = $ctx;
        if (!empty($this->initialized[$ctx])) {
            return true;
        }
        $output = '';
        switch ($ctx)
        {
            case 'mgr':
                break;

            default:
                $this->initialized[$ctx] = true;
                break;
        }
        return true;
    }

    public function sendMailToUser($data)
    {
        $persons_output = '';
        foreach ($data['persons'] as $person)
        {
            $persons_output .= $this->modx->parseChunk($this->config['emailToUserPersonTpl'], $person);
            $persons_output .= $this->config['emailToUserPersonSeparator'];
        }
        $persons_output = rtrim($persons_output, $this->config['emailToUserPersonSeparator']);

        $message = $this->modx->parseChunk($this->config['emailToUserTpl'], array_merge($data, array(
            'persons_output' => $persons_output
        )));

        $this->modx->getService('mail', 'mail.modPHPMailer');
        $this->modx->mail->set(modMail::MAIL_BODY, $message);
        $this->modx->mail->set(modMail::MAIL_FROM, $this->config['emailFrom']);
        $this->modx->mail->set(modMail::MAIL_FROM_NAME, $this->config['emailFromName']);
        $this->modx->mail->set(modMail::MAIL_SENDER, $this->config['emailFrom']);
        $this->modx->mail->set(modMail::MAIL_SUBJECT, $this->config['emailSubject']);
        $this->modx->mail->address('to', $data['email'], $this->config['emailToName']);
        $this->modx->mail->address('reply-to', 'no-reply@'.$this->modx->getOption('http_host'));
        $this->modx->mail->setHTML(true);
        //call send mail
        return $this->modx->mail->send();
        // return $message;
    }

}
