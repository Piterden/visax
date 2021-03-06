<?php
/**
 * Processor file for visax extra.
 *
 * currency
 * country
 * phone
 * email
 * createdon
 * editedon
 * url_hash
 * state
 */

/* @var $modx modX */

class VisaxSessionGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'visaSession';
    public $languageTopics = array('visax:default');
    public $objectType = 'visax.session';

    /**
     * Used for adding custom data in derivative types.
     */
    public function beforeOutput()
    {
        // $currency = $this->object->getOne('Currency');
        // $this->object->set('_currency', $currency);
        $p = $this->object->getMany('Persons');
        $persons = array();
        foreach ($p as $person) {
            $arr = $person->toArray();
            if (!$arr['deleted']) {
                $persons[] = $arr;
            }
        }
        $country = $this->object->getOne('Country');
        $this->object->set('country_name', $country->get('name'));
        $this->object->set('persons_count', count($persons));
        $this->object->set('persons', $persons);
        $this->object->set('_country', $country->toArray());
    }

    /**
     * Return the response.
     *
     * @return array
     */
    public function cleanup()
    {
        return $this->outputArray($this->object->toArray(), 1, 'load_session');
    }

    /**
     * Return arrays of objects (with count) converted to JSON.
     *
     * @param array $array An array of data objects.
     * @param mixed $count The total number of objects. Used for pagination.
     *
     * @return string The JSON output.
     */
    public function outputArray(array $array, $count = false, $message = '')
    {
        if (false === $count) {
            $count = count($array);
        }

        return '{"message":"'.$message.'","success":true,"total":'.$count.',"results":'.$this->modx->toJSON($array).'}';
    }
}

return 'VisaxSessionGetProcessor';
