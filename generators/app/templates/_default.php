<?php
namespace <%= projectName %>;

use SlampDesk\Site\SiteAutoloader;
use SlampDesk\Site\Site;

require_once('slampdesk/classes/Site/SiteAutoloader.php');
SiteAutoloader::init('<%= classesDir %>', '<%= projectName %>');

$mySite = new <%= projectName %>Site(
    array(
        'menuClass' => false,
        'menuPosition' => Site::MENU_ALL
    )
);
$mainMenu = $mySite->getMainMenu();

$page = new \stdClass();
$page->title = '<%= projectName %>';
$page->metaTitle = '';
$page->metaKeywords = '';
$page->metaDescription = '';
$page->jsFiles = array();
$page->cssFiles = array('css/style.css');

if ($mainMenu) {
    $pageRequest = isset($_GET['idm']) ? intval($_GET['idm']) :
            (isset($_GET['myurl']) ? $_GET['myurl'] : 1);

    $activeMenuItem = $mySite->getActiveMenuItem($pageRequest);
    $activeMenuItem->active = true;

    $page->title = "{$activeMenuItem->voce} - {$page->title}";
    if (!empty($activeMenuItem->meta_title)) {
        $page->metaTitle = $activeMenuItem->meta_title;
    }
    if (!empty($activeMenuItem->meta_keywords)) {
        $page->metaKeywords = $activeMenuItem->meta_keywords;
    }
    if (!empty($activeMenuItem->meta_description)) {
        $page->metaDescription = $activeMenuItem->meta_description;
    }

    $pageToInclude = $mySite->getPageToInclude($pageRequest);
    $pathToInclude = "include/$pageToInclude";
    if ($pathToInclude && file_exists($pathToInclude)) {
        require_once($pathToInclude);
        $page->template = 'templates/' . str_replace('.php', '', $pageToInclude) . '.page.php';
    }
}

require_once('default.page.php');
