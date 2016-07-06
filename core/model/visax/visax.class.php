<?php
/**
 * CMP class file for visax extra
 *
 * @package visax
 */

class visax
{
    const SALT = '34755e5b77ad4094132a90faec7ca5b3';

    public $modx;
    public $config;

    private $initialized;

    public function __construct(modX &$modx, array $config = array())
    {
        $this->modx = &$modx;
        $corePath = $modx->getOption(
            'visax.core_path', null,
            $modx->getOption('core_path').'components/visax/'
        );
        $assetsUrl = $modx->getOption(
            'visax.assets_url', null,
            $modx->getOption('assets_url').'components/visax/'
        );

        $this->config = array_merge(
            array(
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
            'defaultBirthDate'           => '1986-05-05 00:00:00',
            'maxPersons'                 => 5,
            'emailFrom'                  => $modx->getOption('emailsender'),
            'emailFromName'              => 'admin',
            'emailToName'                => 'user',
            'emailSubject'               => 'New session',
            'emailToUserTpl'             => 'email_user',
            'emailToUserPersonTpl'       => 'email_user_person',
            'emailToUserPersonSeparator' => '',
            'container'                  => 'ajaxWrapper'
            ), $config
        );

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
        $personsOutput = '';

        if ($data['id']) {
            foreach ($data['persons'] as $person)
            {
              $personsOutput .= $this->modx->parseChunk($this->config['emailToUserPersonTpl'], $person);
              $personsOutput .= $this->config['emailToUserPersonSeparator'];
            }
            $personsOutput = rtrim($personsOutput, $this->config['emailToUserPersonSeparator']);
        }

        $message = $this->modx->parseChunk(
            $this->config['emailToUserTpl'],
            array_merge($data, array(
              'persons_output' => $personsOutput,
              // 'password' => $this->generatePassword($data['email'])
            ))
        );

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

    public function generatePassword($email)
    {
        return hash('adler32', $email.self::SALT);
    }

}
