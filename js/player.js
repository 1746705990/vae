document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const modeBtn = document.getElementById('mode-btn');
    const songTitle = document.getElementById('song-title');
    const playlist = document.getElementById('playlist');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');

    // --- 新增 ---
    const switchSourceBtn = document.getElementById('switch-source-btn');

    // *** 这是你需要配置的地方 ***
    // 'key' 必须和 get_songs.php 中的 'key' 保持一致
    // 'name' 是显示在按钮上的文字
    const musicSources = [
        { key: 'lib1',  name: '早期翻唱' },
        { key: 'lib2',  name: '早期原创' }
    ];
    
    let currentSourceIndex = 0; // 跟踪当前曲库的索引
    let currentSource = musicSources[currentSourceIndex].key; // 默认加载第一个
    // --- 结束 ---

    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let playMode = 'sequence'; // sequence, single, random

    // --- 封装加载歌曲的函数 ---
    function loadSongs(source) {
        fetch(`get_songs.php?source=${source}`)
            .then(response => response.json())
            .then(data => {
                songs = data;
                resetPlayer(); // 重置播放器
                displayPlaylist();
                if (songs.length > 0) {
                    // 预加载第一首歌曲的信息
                    audioPlayer.src = songs[0].path; 
                    songTitle.textContent = songs[0].title;
                }
            })
            .catch(error => console.error('Error loading songs:', error));
    }

    // --- 新增：重置播放器状态函数 ---
    function resetPlayer() {
        audioPlayer.pause();
        audioPlayer.src = '';
        isPlaying = false;
        currentSongIndex = 0;
        songTitle.textContent = songs.length > 0 ? songs[0].title : '未选择歌曲';
        playBtn.textContent = '播放';
        progress.style.width = '0%';
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = formatTime(audioPlayer.duration || 0);
    }

    // 显示播放列表
    function displayPlaylist() {
        playlist.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.onclick = () => playSong(index);
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            playlist.appendChild(li);
        });
    }

    // 播放音乐
    function playSong(index) {
        if (index >= 0 && index < songs.length) {
            currentSongIndex = index;
            audioPlayer.src = songs[index].path;
            songTitle.textContent = songs[index].title;
            audioPlayer.play();
            isPlaying = true;
            playBtn.textContent = '暂停';
            displayPlaylist();
        }
    }

    // 播放/暂停
    playBtn.onclick = () => {
        if (songs.length === 0) return;

        if (audioPlayer.src === '' || !audioPlayer.src.includes('.mp3')) {
            playSong(0);
        } else if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            playBtn.textContent = '播放';
        } else {
            audioPlayer.play();
            isPlaying = true;
            playBtn.textContent = '暂停';
        }
    };

    // --- (*** 修改 ***) ---
    // 上一首
    prevBtn.onclick = () => {
        playPreviousSong(); // 调用新函数
    };

    // 下一首
    nextBtn.onclick = () => {
        playNextSong();
    };

    // --- (*** 新增函数 ***) ---
    // 根据播放模式播放上一首
    function playPreviousSong() {
        if (songs.length === 0) return;

        let prevIndex;
        switch (playMode) {
            case 'sequence':
                prevIndex = currentSongIndex - 1;
                if (prevIndex < 0) prevIndex = songs.length - 1;
                break;
            case 'single':
                prevIndex = currentSongIndex; // 单曲循环：重新播放当前歌曲
                break;
            case 'random':
                // 随机模式：播放另一首随机歌曲
                prevIndex = Math.floor(Math.random() * songs.length);
                break;
        }
        playSong(prevIndex);
    }

    // 根据播放模式播放下一首
    function playNextSong() {
        if (songs.length === 0) return;

        let nextIndex;
        switch (playMode) {
            case 'sequence':
                nextIndex = (currentSongIndex + 1) % songs.length;
                break;
            case 'single':
                nextIndex = currentSongIndex;
                break;
            case 'random':
                nextIndex = Math.floor(Math.random() * songs.length);
                break;
        }
        playSong(nextIndex);
    }

    // 切换播放模式
    modeBtn.onclick = () => {
        switch (playMode) {
            case 'sequence':
                playMode = 'single';
                modeBtn.textContent = '播放模式: 单曲循环';
                break;
            case 'single':
                playMode = 'random';
                modeBtn.textContent = '播放模式: 随机播放';
                break;
            case 'random':
                playMode = 'sequence';
                modeBtn.textContent = '播放模式: 顺序播放';
                break;
        }
    };

    // --- 修改：切换曲库 ---
    switchSourceBtn.onclick = () => {
        // 索引 +1，如果超出数组长度，则循环回 0
        currentSourceIndex = (currentSourceIndex + 1) % musicSources.length;
        
        // 更新当前 source 的 key 和按钮文字
        currentSource = musicSources[currentSourceIndex].key;
        switchSourceBtn.textContent = `曲库: ${musicSources[currentSourceIndex].name}`;
        
        // 加载新曲库的歌曲
        loadSongs(currentSource);
    };

Object.assign(String.prototype, {
    toHHMMSS() {
        const sec_num = parseInt(this, 10);
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return (hours == '00' ? '' : hours + ':') + minutes + ':' + seconds;
    }
});
    // 更新进度条
    audioPlayer.ontimeupdate = () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        currentTimeSpan.textContent = formatTime(currentTime);
        // 只有在 duration 有效时才更新
        if (!isNaN(duration)) {
            durationSpan.textContent = formatTime(duration);
        }
    };

    // 点击进度条跳转
    progressBar.onclick = (e) => {
        if (!audioPlayer.duration) return; // 防止在NaN时点击
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    };

    // 播放结束时根据播放模式继续播放
    audioPlayer.onended = () => {
        playNextSong();
    };

    // 格式化时间
    function formatTime(time) {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // --- 初始加载 ---
    // 设置初始按钮文字
    switchSourceBtn.textContent = `曲库: ${musicSources[currentSourceIndex].name}`;
    loadSongs(currentSource);
});

