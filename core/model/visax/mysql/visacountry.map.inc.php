<?php
$xpdo_meta_map['visaCountry']= array (
  'package' => 'visax',
  'version' => '1.1',
  'table' => 'visa_countries',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'name' => NULL,
    'key' => NULL,
    'sign' => NULL,
    'rank' => 0,
    'public' => 0,
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
    'rank' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'default' => 0,
    ),
    'public' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 0,
      'attributes' => 'unsigned',
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
    'Session' => 
    array (
      'class' => 'visaSession',
      'local' => 'id',
      'foreign' => 'country',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Currencies' => 
    array (
      'class' => 'visaCurrXCoun',
      'local' => 'id',
      'foreign' => 'country',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
