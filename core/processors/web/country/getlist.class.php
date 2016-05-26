<?php
/**
 * Processor file for visax extra
 *
 * name
 * key
 * sign
 * rank
 * public
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */

class visaxCountryGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'visaCountry';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'visax.country';
    public $permission = '';
    // public $checkListPermission = false;

    /**
     * @return boolean
     */
    function initialize() {
        return parent::initialize();
    }

    /**
	 * @param xPDOQuery $c
	 * @return xPDOQuery
	 */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
		$c->where(array('public' => 1));

		if ($query = $this->getProperty('query')) {
			$c->where(array(
				'name:LIKE' => "%$query%",
				'OR:key:LIKE' => "%$query%",
				'OR:sign:LIKE' => "%$query%"
			));
		}

		return $c;
	}

    /**
     * @access public
     * @param array $array An array of data objects.
     * @param mixed $count The total number of objects. Used for pagination.
     * @return string The JSON output.
     */
    public function outputArray(array $array,$count = false) {
        if ($count === false) { $count = count($array); }
        return '{"success":true,"total":"'.$count.'","data":'.$this->modx->toJSON($array).',"pos":"'.$this->getProperty("start", 0).'","parent":"0","config":'.$this->modx->toJSON($this->getProperties()).'}';
    }

    /**
     * @return boolean
     */
	public function checkPermissions() { return true; }

}
return 'visaxCountryGetListProcessor';
