<?php
$xpdo_meta_map['visaCurrency']= array (
  'package' => 'visax',
  'version' => '1.1',
  'table' => 'visa_currencies',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'name' => NULL,
    'key' => NULL,
    'sign' => NULL,
  ),
  'fieldMeta' => 
  array (
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'key' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'sign' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '3',
      'phptype' => 'string',
      'null' => false,
    ),
  ),
  'indexes' => 
  array (
    'name' => 
    array (
      'alias' => 'name',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'name' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'key' => 
    array (
      'alias' => 'key',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'key' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'sign' => 
    array (
      'alias' => 'sign',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sign' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'composites' => 
  array (
    'RateFrom' => 
    array (
      'class' => 'visaRate',
      'local' => 'id',
      'foreign' => 'from',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'RateTo' => 
    array (
      'class' => 'visaRate',
      'local' => 'id',
      'foreign' => 'to',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Session' => 
    array (
      'class' => 'visaSession',
      'local' => 'id',
      'foreign' => 'currency',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Countries' => 
    array (
      'class' => 'visaCurrXCoun',
      'local' => 'id',
      'foreign' => 'currency',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
