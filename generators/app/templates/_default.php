<?php
namespace <%= projectName %>;

use SlampDesk\Site\SiteAutoloader;
use SlampDesk\Site\Site;
use SlampDesk\Common\Language;

require_once('slampdesk/classes/Site/SiteAutoloader.php');
SiteAutoloader::init('classes', '<%= projectName %>');

$language = isset($_GET['language']) ? $_GET['language'] : false;
$mySite = new <%= projectName %>Site(
    array(
        'templatesDir' => 'templates',
        'language' => $language ? $language : Language::LANG_IT,
        'debug' => true,
        'startPage' => false,
        'errorPage' => '404.php',
        'urlField' => 'myurl',
        'pageField' => 'page',
        'menuClass' => '<%= projectName %>\Generated\Menu',
        'menuPosition' => Site::MENU_ALL,
        'menuFilterEnabled' => true,
        'siteDir' => dirname(__FILE__)
    )
);
$mySite->setTitle('<%= projectName %>');
$mySite->setMetaKeywords('');
$mySite->setMetaDescription('');

$assets = $mySite->getAssetManager();
$assets->addCssFile('css/style.css', 'css/style.min.css');
$assets->addJsFile('js/default.js', 'js/default.min.js');

$mainMenu = $mySite->getMainMenu();

if ($mainMenu) {
    $pageRequest = isset($_GET['idm']) ? intval($_GET['idm']) :
            (isset($_GET['myurl']) ? $_GET['myurl'] : null);

    $activeMenuItem = $mySite->getActiveMenuItem($pageRequest);
    
    if ($activeMenuItem) {
        $activeMenuItem->active = true;
        $mySite->setTitle("{$activeMenuItem->voce} - {$mySite->getTitle()}");
        if (!empty($activeMenuItem->meta_title)) {
            $mySite->setMetaTitle($activeMenuItem->meta_title);
        }
        if (!empty($activeMenuItem->meta_keywords)) {
            $mySite->setMetaKeywords($activeMenuItem->meta_keywords);
        }
        if (!empty($activeMenuItem->meta_description)) {
            $mySite->setMetaDescription($activeMenuItem->meta_description);
        }
    }

    
    $controller = $mySite->getController($pageRequest);
    $template = $mySite->getTemplate($pageRequest);
    if ($controller && file_exists($controller)) {
        require_once($controller);
    }

    if ($pageToInclude === $mySite->getErrorPage()) {
        header("HTTP/1.0 404 Not Found");
    }
}

require_once('default.page.php');
