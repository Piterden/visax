<?php
/**
 * Controller file for visax extra
 *
 * @package visax
 * @subpackage controllers
 */
/* @var $modx modX */

class visaxHomeManagerController extends visaxManagerController
{
    /**
     * The pagetitle to put in the <title> attribute.
     *
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('visax');
    }

    /**
     * Register all the needed javascript files.
     */
    public function loadCustomCssJs()
    {
        $this->addJavascript($this->visax->config['jsUrl'].'misc/combo.js');
        $this->addJavascript($this->visax->config['jsUrl'].'misc/utils.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/country.grid.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/country.windows.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/person.grid.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/person.windows.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/session.grid.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/session.windows.js');
        // $this->addJavascript($this->visax->config['jsUrl'] . 'widgets/currency.grid.js');
        // $this->addJavascript($this->visax->config['jsUrl'] . 'widgets/currency.windows.js');
        // $this->addJavascript($this->visax->config['jsUrl'] . 'widgets/rate.grid.js');
        // $this->addJavascript($this->visax->config['jsUrl'] . 'widgets/rate.windows.js');
        // $this->addJavascript($this->visax->config['jsUrl'] . 'widgets/ratesource.grid.js');
        // $this->addJavascript($this->visax->config['jsUrl'] . 'widgets/ratesource.windows.js');
        $this->addJavascript($this->visax->config['jsUrl'].'widgets/home.panel.js');
        $this->addLastJavascript($this->visax->config['jsUrl'].'sections/home.js');

        $this->addCss($this->visax->config['cssUrl'].'mgr.css');
        $this->addCss($this->visax->config['cssUrl'].'mgr/bootstrap.buttons.css');
        $this->addCss($this->visax->config['cssUrl'].'visax.css');

    }
}
