<?php
$xpdo_meta_map['visaCurrXCoun']= array (
  'package' => 'visax',
  'version' => '1.1',
  'table' => 'visa_curr_x_coun',
  'extends' => 'xPDOObject',
  'fields' => 
  array (
    'country' => NULL,
    'currency' => NULL,
  ),
  'fieldMeta' => 
  array (
    'country' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
    ),
    'currency' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
    ),
  ),
  'indexes' => 
  array (
    'PRIMARY' => 
    array (
      'alias' => 'PRIMARY',
      'primary' => true,
      'unique' => true,
      'columns' => 
      array (
        'country' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'currency' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'aggregates' => 
  array (
    'Country' => 
    array (
      'class' => 'visaCountry',
      'local' => 'country',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'Currency' => 
    array (
      'class' => 'visaCurrency',
      'local' => 'currency',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
