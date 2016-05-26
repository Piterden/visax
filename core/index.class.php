<?php
/**
 * Action file for visax extra
 *
 * @package visax
 */

abstract class visaxManagerController extends modExtraManagerController
{
    /**
     * @var visax $visax
     */
    public $visax = null;

    /**
     * Initializes the main manager controller.
     */
    public function initialize()
    {
        /* Instantiate the visax class in the controller */
        $path = $this->modx->getOption('visax.core_path', null, $this->modx->getOption('core_path').'components/visax/').'model/visax/';
        require_once $path.'visax.class.php';
        $this->visax = new visax($this->modx);

        /* Optional alternative  - install PHP class as a service */

        /* $this->visax = $this->modx->getService('visax',
        'visax', $path);*/

        /* Add the main javascript class and our configuration */
        $this->addJavascript($this->visax->config['jsUrl'].
            'visax.class.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            visax.config = '.$this->modx->toJSON($this->visax->config).';
        });
        </script>');
    }

    /**
     * Defines the lexicon topics to load in our controller.
     *
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('visax:default');
    }

    /**
     * We can use this to check if the user has permission to see this
     * controller. We'll apply this in the admin section.
     *
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }

    /**
     * The name for the template file to load.
     *
     * @return string
     */
    public function getTemplateFile()
    {
        return dirname(__FILE__).'/templates/mgr.tpl';
        // return $this->visax->config['templatesPath'] . 'mgr.tpl';
    }
}

/**
 * The Index Manager Controller is the default one that gets called when no
 * action is present.
 */
class IndexManagerController extends visaxManagerController
{
    /**
     * Defines the name or path to the default controller to load.
     *
     * @return string
     */
    public static function getDefaultController()
    {
        return 'home';
    }
}
