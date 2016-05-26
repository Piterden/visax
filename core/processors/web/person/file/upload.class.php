<?php
/*
Загружаем файл
 */
require_once MODX_PROCESSORS_PATH.'browser/file/upload.class.php';
class visaxPersonFileUploadProcessor extends modBrowserFileUploadProcessor
{
    public function checkPermissions() {
        return true;
    }

    public function initialize(){

        $this->setProperties(array(
            "path" => '/' . $this->getProperty('path'),
            "ctx" => 'web'
        ));

        if (!$this->getSource()) {
            return $this->modx->lexicon('permission_denied');
        }

        $this->source->prepareProperties($this->getProperties());
        $this->source->setRequestProperties($this->getProperties());
        $this->source->initialize();
        if (!$this->source->checkPolicy('create')) {
            return $this->modx->lexicon('permission_denied');
        }

        return parent::initialize();
    }

    public function process() {


        // print_r($_FILES);
        // print_r($this->getProperties());

        // Проверяем наличие файла
        if(!$file = $this->getProperty('upload')){
            return $this->failure("Не был получен файл");
        }

        // else

        $imagesExts = $this->source->getOption('imageExtensions', null,'jpg,jpeg,png,gif');
        $imagesExtsArray = explode(',',$imagesExts);
        $imagesExtsArray = array_map("trim", $imagesExtsArray);
        $imagesExtsArray = array_map("strtolower", $imagesExtsArray);

        // Получаем или создаем объект файла
        $path = $this->getProperty('path');

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if(!in_array($ext, $imagesExtsArray)){
            return $this->failure("Расширение '{$ext}' не разрешено . Разрешенные: {$imagesExts}");
        }

        $size = $file['size'];

        $name = md5($file['name'] . $size . time())  . ".{$ext}";

        $original_name = $file['name'];
        $file['name'] = $name;


        $files = array($file);

        $pathRelative = trim($path.$name, '/');
        $data = array(
            "source"  => $this->source->id,
            "pathRelative"  => $pathRelative,
        );

        $abs_path = $this->source->getBasePath() . $pathRelative;
        $this->setProperty('abs_path', $abs_path);


        /*
            Сохраняем файл
        */
        $success = $this->saveFile($path, $name, $files);
        if ($success !== true) {
            return $this->failure($success);
        }

        // else

        // return $this->failure($data);

        if($mediafile = $this->modx->getObject("modFileMediaSource", $data)){
            // $mediafile->fromArray(array(
            //     "modifiedby" => $this->modx->user->get('id'),
            //     "modifiedon" => time(),
            // ));
        }
        else{
            $mediafile = $this->modx->newObject("modFileMediaSource", $data);
            $mediafile->fromArray(array(
                "name"      => $original_name,
                "basename"  => $name,
                "type"      => 'file',
                "createdby" => $this->modx->user->get('id'),
                "createdon" => time(),
            ));
        }

        /*
            Получаем миме-тайп
        */
        $mediafile->fromArray(array(
            // "size"  => filesize($abs_path),
            "size"  => $size,
        ));

        /*
            Получаем мета-данные из самого файла
        */
        // print $abs_path;
        if(@$meta = getimagesize($abs_path)){
            // print_r($data);
            $mediafile->fromArray(array(
                "image_width"  => $meta[0],
                "image_height"  => $meta[1],
                "meta"  => $meta['mime'],
            ));
        }
        // print_r($data);

        if(@$filemtime = filemtime($abs_path)){
            $mediafile->lastmod = $filemtime;
        }


        $mediafile->save();

        return $this->success('', array(
            "url"   => $this->source->getBaseUrl() . $pathRelative,
            "src"   => $pathRelative,
            "name" => $name,
        ));
    }


    protected function saveFile($path, $name, $files){

        $success = $this->source->uploadObjectsToContainer($path, $files);
        if (empty($success)) {
            $msg = '';
            $errors = $this->source->getErrors();
            foreach ($errors as $k => $msg) {
                $this->modx->error->addField($k,$msg);
            }
            return $this->failure($msg);
        }

        return true;
    }

}
return 'visaxPersonFileUploadProcessor';
