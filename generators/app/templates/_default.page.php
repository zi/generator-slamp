<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="INDEX, FOLLOW" />
    <meta name="description" content="<?= $page->metaDescription ?>" />
    <meta name="keywords" content="<?= $page->metaKeywords ?>" />

    <!-- bower:css -->
    <!-- endbower -->

<?php
foreach ($page->cssFiles as $style) {
?>
    <link href="<?= $style ?>" rel="stylesheet" type="text/css" media="screen" />
<?php
}
?>
    
    <title><?= $page->title ?></title>
</head>
<body>
    <div id="header"></div>
    <div id="content">

<?php
if (isset($page->template) && file_exists($page->template)) {
    require_once($page->template);
}
?>

    </div>
    <div id="footer"></div>

    <!-- bower:js -->
    <!-- endbower -->

<?php
foreach ($page->jsFiles as $script) {
?>
    <script type="text/javascript" src="<?= $script ?>"></script>
<?php
}
?>
</body>
</html>
