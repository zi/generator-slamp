<!DOCTYPE html>
<html lang="en">
<head>
    <title><?= $mySite->getTitle() ?></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="<?= $mySite->getMetaRobots() ?>" />
    <meta name="description" content="<?= $mySite->getMetaDescription() ?>" />
    <meta name="keywords" content="<?= $mySite->getMetaKeywords() ?>" />

    <!-- build:css -->
        <!-- bower:css -->
        <!-- endbower -->
    <!-- endbuild -->

<?php
foreach ($assets->getCssFiles() as $file) {
    if ($mySite->debug() || file_exists($file)) {
?>
    <link href="<?= $file ?>" rel="stylesheet" type="text/css" media="screen" />
<?php
    }
}
?>
</head>
<body>
    <div id="header"></div>
    <div id="content">

<?php
if (isset($template) && file_exists($template)) {
    require_once($mySite->getTemplate());
}
?>

    </div>
    <div id="footer"></div>

    <!-- build:js -->
        <!-- bower:js -->
        <!-- endbower -->
    <!-- endbuild -->

<?php
foreach ($assets->getJsFiles() as $file) {
    if ($mySite->debug() || file_exists($file)) {
?>
    <script type="text/javascript" src="<?= $file ?>"></script>
<?php
    }
}
?>
</body>
</html>