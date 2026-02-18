<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vae</title>
    <link rel="icon" href="https://cdn.bio.link/uploads/profile_pictures/2024-01-07/INFFc2aqsL42wAALtduWMJSBQxSJNatt.png" type="image/png">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="player-container">
        <div class="music-info">
            <h2 id="song-title">未选择歌曲</h2>
            <p class="slogan"><a href="https://open.spotify.com/artist/2hgxWUG24w1cFLBlPSEVcV" target="_blank">vae</a></p>
        </div>
        <div class="player-controls">
            <button id="prev-btn" class="control-btn">上一首</button>
            <button id="play-btn" class="control-btn">播放</button>
            <button id="next-btn" class="control-btn">下一首</button>
        </div>
        
        <div class="extra-controls">
            <button id="mode-btn" class="mode-btn">播放模式: 顺序播放</button>
            <button id="switch-source-btn" class="mode-btn">曲库: Music 1</button>
        </div>

        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
            <div class="time-info">
                <span id="current-time">0:00</span> / 
                <span id="duration">0:00</span>
            </div>
        </div>
        <audio id="audio-player"></audio>
    </div>
    <div class="playlist-container">
        <h3>播放列表</h3>
        <ul id="playlist"></ul>
    </div>
    <script src="js/player.js"></script>
</body>
</html>