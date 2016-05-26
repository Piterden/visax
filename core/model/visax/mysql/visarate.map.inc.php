<?php
$xpdo_meta_map['visaRate']= array (
  'package' => 'visax',
  'version' => '1.1',
  'table' => 'visa_rates',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'from' => NULL,
    'to' => NULL,
    'rate' => NULL,
    'updatedon' => NULL,
    'source' => NULL,
    'active' => 0,
  ),
  'fieldMeta' => 
  array (
    'from' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
    ),
    'to' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
    ),
    'rate' => 
    array (
      'dbtype' => 'float',
      'precision' => '10',
      'phptype' => 'float',
      'attributes' => 'unsigned',
    ),
    'updatedon' => 
    array (
      'dbtype' => 'datetime',
      'phptype' => 'datetime',
      'null' => false,
      'attributes' => 'ON UPDATE CURRENT_datetime',
    ),
    'source' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => true,
      'attributes' => 'unsigned',
    ),
    'active' => 
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
    'rel' => 
    array (
      'alias' => 'rel',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'from' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'to' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'source' => 
    array (
      'alias' => 'source',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'source' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'active' => 
    array (
      'alias' => 'active',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'active' => 
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
    'From' => 
    array (
      'class' => 'visaCurrency',
      'local' => 'from',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'To' => 
    array (
      'class' => 'visaCurrency',
      'local' => 'to',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'Source' => 
    array (
      'class' => 'visaRateSource',
      'local' => 'source',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
