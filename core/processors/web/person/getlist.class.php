<?php
/**
 * Processor file for visax extra
 *
 * id
 * session
 * firstname
 * sirname
 * patronymic
 * birth_date
 * phone
 * desired_time
 * mother_fio
 * mother_address
 * mother_phone
 * father_fio
 * father_address
 * father_phone
 * trip_target
 * visa_type
 * prev_surnames
 * marital_status
 * registration_region
 * registration_address
 * residential_address
 * employment
 * empl_function
 * empl_address
 * empl_phone
 * last_visa
 * last_visa_scan
 * passport_scan
 * price
 *
 * @package visax
 * @subpackage processors
 */

/* @var $modx modX */


class visaxPersonGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'visaPerson';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'visax.person';
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
		if ($session_id = $this->getProperty('session', false)) {
			$c->where(array('session' => $session_id));
		};
		$c->leftJoin('visaSession', 'Session', 'visaPerson.session = Session.id');
		// $c->leftJoin('visaCurrency', 'visaCurrency', 'visaSession.currency = visaCurrency.id');

		$c->select($this->modx->getSelectColumns($this->classKey, $this->classKey));
		$c->select('visaSession.url_hash as url_hash');

		// if ($query = $this->getProperty('query')) {
		// 	$c->where(array(
		// 		'name:LIKE' => "%$query%",
		// 		'OR:key:LIKE' => "%$query%",
		// 		'OR:sign:LIKE' => "%$query%"
		// 	));
		// }

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
return 'visaxPersonGetListProcessor';
