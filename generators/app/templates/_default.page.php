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

    <!-- bower:css -->
    <!-- endbower -->

<?php
foreach ($mySite->getCssFiles() as $file) {
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
if ($mySite->getTemplate() && file_exists($mySite->getTemplate())) {
    require_once($mySite->getTemplate());
}
?>

    </div>
    <div id="footer"></div>

    <!-- bower:js -->
    <!-- endbower -->

<?php
foreach ($mySite->getJsFiles() as $file) {
    if ($mySite->debug() || file_exists($file)) {
?>
    <script type="text/javascript" src="<?= $file ?>"></script>
<?php
    }
}
?>
</body>
</html>