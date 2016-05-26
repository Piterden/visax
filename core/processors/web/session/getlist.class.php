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


class visaxSessionGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'visax.session';
    public $checkListPermission = false;

    /**
	 * @param xPDOQuery $c
	 * @return xPDOQuery
	 */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
		if ($email = $this->getProperty('email', false)) {
			$c->where(array('email' => $email));
		};
		if ($country = $this->getProperty('country', false)) {
			$c->where(array('country' => $country));
		};
		if ($query = $this->getProperty('query', false)) {
			$c->where(array(
				'phone:LIKE' => "%$query%",
				'OR:email:LIKE' => "%$query%",
			));
		}
		$c->select($this->modx->getSelectColumns($this->classKey, $this->classKey));

		return $c;
	}

	/**
     * Prepare the row for iteration
     * @param xPDOObject $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
    	$p = $object->getMany('Person');
    	$persons = array();
    	foreach ($p as $obj) {
    		$persons[] = $obj->toArray();
    	}
    	$country = $object->getOne('Country');
    	$object->set('country_name', $country->get('name'));
    	$object->set('persons_count', count($persons));
    	$object->set('persons', $persons);
    	$object->set('_country', $country->toArray());
        return $object->toArray();
    }

    /**
     * Return arrays of objects (with count) converted to JSON.
     * @param array $array An array of data objects.
     * @param mixed $count The total number of objects. Used for pagination.
     * @return string The JSON output.
     */
    public function outputArray(array $array,$count = false, $message = '') {
        if ($count === false) { $count = count($array); }
        return '{"message":"'.$message.'","success":true,"total":"'.$count.'","results":'.$this->modx->toJSON($array).'}';
    }

}
return 'visaxSessionGetListProcessor';
