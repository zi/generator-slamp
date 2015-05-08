<?php
namespace <%= projectName %>;

use SlampDesk\Site\SiteAutoloader;
use SlampDesk\Site\Site;

require_once('slampdesk/classes/Site/SiteAutoloader.php');
SiteAutoloader::init('classes', '<%= projectName %>');

$language = Site::parseLanguageUrl('language');
$mySite = new <%= projectName %>Site(
    array(
        'templatesDir' => 'templates',
        'language' => $language ? $language : Site::LANG_IT,
        'debug' => true,
        'defaultPage' => 'static.php',
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

$mySite->addCssFile('css/style.css', 'css/min/style.min.css');
$mySite->addJsFile('js/default.js', 'js/min/default.min.js');

$mainMenu = $mySite->getMainMenu();

if ($mainMenu) {
    $pageRequest = isset($_GET['idm']) ? intval($_GET['idm']) :
            (isset($_GET['myurl']) ? $_GET['myurl'] : null);

    $activeMenuItem = $mySite->getActiveMenuItem($pageRequest);
    $activeMenuItem->active = true;
    
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

    $pageToInclude = $mySite->getPageToInclude($pageRequest);
    $pathToInclude = "controllers/$pageToInclude";
    if ($pathToInclude && file_exists($pathToInclude)) {
        require_once($pathToInclude);
        $mySite->setTemplate(str_replace('.php', '.page.php', $pageToInclude));
    }
}

require_once('default.page.php');
