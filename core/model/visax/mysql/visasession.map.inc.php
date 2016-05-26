<?php
$xpdo_meta_map['visaSession']= array (
  'package' => 'visax',
  'version' => '1.1',
  'table' => 'visa_sessions',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'currency' => 0,
    'country' => 0,
    'phone' => '',
    'email' => '',
    'createdon' => NULL,
    'editedon' => NULL,
    'url_hash' => '',
    'state' => 'filling',
  ),
  'fieldMeta' => 
  array (
    'currency' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'default' => 0,
      'attributes' => 'unsigned',
    ),
    'country' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'default' => 0,
      'attributes' => 'unsigned',
    ),
    'phone' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'email' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'createdon' => 
    array (
      'dbtype' => 'datetime',
      'phptype' => 'datetime',
    ),
    'editedon' => 
    array (
      'dbtype' => 'datetime',
      'phptype' => 'datetime',
    ),
    'url_hash' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '32',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'state' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '20',
      'phptype' => 'string',
      'null' => false,
      'default' => 'filling',
    ),
  ),
  'indexes' => 
  array (
    'url_hash' => 
    array (
      'alias' => 'url_hash',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'url_hash' => 
        array (
          'length' => '32',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'email' => 
    array (
      'alias' => 'email',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'email' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'state' => 
    array (
      'alias' => 'state',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'state' => 
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
    'Person' => 
    array (
      'class' => 'visaPerson',
      'local' => 'id',
      'foreign' => 'session',
      'cardinality' => 'many',
      'owner' => 'local',
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
