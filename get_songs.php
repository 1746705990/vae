<?php
header('Content-Type: application/json');

// 1. 建立一个允许访问的目录白名单
// *** 请确保这个配置和您 js/player.js 中的 'key' 完全一致 ***
$allowedDirs = [
    'lib1'   => './music1',
    'lib2'   => './music2',
];

// 2. 获取前端请求的源，默认为 'lib1' (music1)
$sourceKey = 'lib1'; // 默认值
if (isset($_GET['source']) && array_key_exists($_GET['source'], $allowedDirs)) {
    $sourceKey = $_GET['source'];
}

// 3. 确定要扫描的目录
$musicDir = $allowedDirs[$sourceKey];
$songs = [];

if (is_dir($musicDir)) {
    $files = scandir($musicDir);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'mp3') {
            $songs[] = [
                'title' => pathinfo($file, PATHINFO_FILENAME),
                'path'  => $musicDir . '/' . $file
            ];
        }
    }
}

// 4. 返回 JSON 数据
echo json_encode($songs);

