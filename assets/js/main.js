var player = document.querySelector('.player');
var playlist = document.querySelector('.playlist');
var playerHeight = parseInt(player.clientHeight + 16); 

playlist.style.marginTop = parseInt(player.clientHeight + 16) + 'px';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const app = {
    currentIndex: 0,
    isRepeat: false,
    isRandom: false,
    favorite: [],
    playlistElement: $('.playlist'),
    player_cd: $('.player__cd'),
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    audioElement: $('.playing-song'),
    songs: [
        {
            name: 'Bài ca tôm cá',
            singer: 'Bé Nguyễn Minh Chiến',
            path: 'assets/audio/baiCaTomCa.mp3',
            image: 'assets/img/baiCaTomCa.jpg'
        },
    
        {
            name: "Bèo dạt mây trôi",
            singer: "Thùy Chi",
            path: "assets/audio/beoDatMayTroi.mp3",
            image: "assets/img/beoDatMayTroi.jpg"
        },
        {
            name: "Có Hẹn Với Thanh Xuân",
            singer: "MONSTAR",
            path: "assets/audio/coHenVoiThanhXuan.mp3",
            image: "assets/img/coHenVoiThanhXuan.jpg"
        },
        {
            name: "Đi giữa trời rực rỡ",
            singer: "Ngô Lan Hương",
            path: "assets/audio/diGiuaTroiRucRo.mp3",
            image: "assets/img/diGiuaTroiRucRo.jpg"
        },
        {
            name: "Đừng làm trái tim anh đau",
            singer: "Sơn Tùng MTP",
            path: "assets/audio/dungLamTraiTimAnhDau.mp3",
            image: "assets/img/dungLamTraiTimAnhDau.jpg"
        },
        {
            name: "Lối Nhỏ",
            singer: "Đen Vâu",
            path: "assets/audio/loiNho.mp3",
            image: "assets/img/loiNho.jpg"
        },
        {
            name: "Nấu ăn cho em",
            singer: "Đen Vâu",
            path: "assets/audio/nauAnChoEm.mp3",
            image: "assets/img/nauAnChoEm.jpg"
        },
        {
            name: "Người Gieo Mầm Xanh",
            singer: "Hứa Kim Tuyền x Hoàng Dũng",
            path: "assets/audio/nguoiGieoMamXanh.mp3",
            image: "assets/img/nguoiGieoMamXanh.jpg"
        },
        {
            name: "Niềm vui của em",
            singer: "Chan La Cà",
            path: "assets/audio/niemVuiCuaEm.mp3",
            image: "assets/img/niemVuiCuaEm.jpg"
        },
    
        {
            name: "Nụ cười 18 20",
            singer: "Doãn Hiếu",
            path: "assets/audio/nuCuoi1820.mp3",
            image: "assets/img/nuCuoi1820.jpg"
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render_song: function(song){
        let newSong = document.createElement('div');
        newSong.classList.add('play-item');
        newSong.innerHTML = `
            <div class="play-item__cd">
                <div class="player__cd-thumb" style="background-image: url('${song.image}');"></div>
            </div>
            <div class="play-item__details">
                <h3 class="play-item__details-name">${song.name}</h3>
                <span class="play-item__details-singer">${song.singer}</span>
            </div>
            <div class="play-item__option">
                <i class="fas fa-ellipsis-h"></i>
                <div class="play-item__option-menu">
                    <div class="item-remove">Remove</div>
                    <div class="item-favorite">Favorite</div>
                </div>
            </div>
        `
        this.playlistElement.appendChild(newSong);   
    },

    render: function() {
        this.songs.forEach(song => {
            this.render_song(song);
        });
    },



    handleEvents: function(){
        _this = this;
        let cdWidth = _this.player_cd.clientWidth;
        var playBtn = $('.player__control-play');
        var progress = $('#song-progress__bar');
        var nextBtn = $('.player__control-next');
        var prevBtn = $('.player__control-previous');
        var repeatBtn = $('.player__control-repeat');
        var randomBtn = $('.player__control-shuffle');
        var itemRemove = $$('.item-remove');
        var itemFavorite = $$('.item-favorite');
        var playerOptionElement = $('.player__option');
        var darkmode = playerOptionElement.querySelector('.player__option-dark-mode');
        var filterFavoriteElement = playerOptionElement.querySelector('.filter-favorite')
        window.addEventListener("scroll", function () {
            let newWidth = cdWidth - window.scrollY;
            _this.player_cd.style.width =  newWidth + 'px';
            _this.player_cd.style.opacity = _this.player_cd.clientWidth / cdWidth;
            if (newWidth < 0){
                _this.player_cd.style.width = 0;
            }
        });

        function changeSong(){
            _this.loadSong();
            if (playBtn.classList.contains('onpause')){
                playBtn.click()
            }
            else{
                _this.audioElement.play();
            }
        }
        

        
        playBtn.addEventListener('click', function(){
            playBtn.classList.toggle('onplay');
            playBtn.classList.toggle('onpause');
            if (playBtn.classList.contains('onplay')){
                _this.audioElement.play();
                _this.player_cd.style.animationPlayState  = 'running';
            } else {
                _this.audioElement.pause();
                _this.player_cd.style.animationPlayState  = 'paused';
            }
        });

        progress.addEventListener("input", function(){
            _this.audioElement.currentTime = progress.value / 100 * _this.audioElement.duration;
        });

        _this.audioElement.addEventListener("timeupdate", function () {
            let duration = _this.audioElement.duration;
            if (!isNaN(duration) && duration > 0) {  // Đảm bảo duration hợp lệ
                let currentTime = _this.audioElement.currentTime;
                progress.value = (currentTime / duration) * 100;
            }
        });

        nextBtn.addEventListener('click', function(){
            if (_this.isRandom){
                _this.currentIndex = Math.floor(Math.random() * _this.songs.length);
            }
            else{
                _this.currentIndex++;
                if (_this.currentIndex >= _this.songs.length){
                    _this.currentIndex = 0;
                }
            }
            changeSong();
        });

        prevBtn.addEventListener('click', function(){
            if (_this.isRandom){
                _this.currentIndex = Math.floor(Math.random() * _this.songs.length);
            }
            else{
                _this.currentIndex--;
                if (_this.currentIndex < 0){
                    _this.currentIndex = _this.songs.length - 1;
                }
            }
            changeSong();
        });
        
        randomBtn.addEventListener('click', function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active');
        });

        repeatBtn.addEventListener('click', function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active');
        });

        _this.audioElement.addEventListener("ended", function() {
            if (_this.isRepeat){
                _this.audioElement.play();
            }
            else{
                nextBtn.click();
            }
        });

        itemRemove.forEach((item) => {
            item.addEventListener('click', function(){
                var playItemElement = item.closest('.play-item');
                var index = Array.from(_this.playlistElement.children).indexOf(playItemElement);
                if (_this.currentIndex > index){
                    _this.currentIndex--;
                }
                else if (_this.currentIndex == index){
                    _this.currentIndex ++;
                    changeSong();
                }
                _this.songs.splice(index, 1);
                _this.playlistElement.children[index].remove();

               console.log(item, index);
            });
        });

        itemFavorite.forEach((item) => {
            item.addEventListener('click', function(){
                var playItemElement = item.closest('.play-item');
                playItemElement.classList.toggle('favorite');
                if (playItemElement.classList.contains('favorite')){
                    item.innerHTML = 'Unfavorite';
                }
                else{
                    item.innerHTML = 'Favorite';
                }
                _this.favorite.push(playItemElement);
                _this.setConfig('favorite', _this.favorite);
            });

        });

        playerOptionElement.addEventListener('click', function(){
            let playerOptionMenu = playerOptionElement.querySelector('.player__option-menu');
            playerOptionMenu.classList.toggle('active');
        })

        darkmode.addEventListener('click', function(){
            document.documentElement.classList.toggle("dark-mode");
        })

        filterFavoriteElement.addEventListener('click', function(){
            document.documentElement.classList.toggle("favorite-filtered");
            let SongElements = Array.from(_this.playlistElement.children)
            if (document.documentElement.classList.contains('favorite-filtered')){
                filterFavoriteElement.innerHTML = 'All'
                SongElements.forEach(function(item){
                    if (!item.classList.contains('favorite')){
                        item.style.display = 'none';
                    }
                })
            }
            else{
                filterFavoriteElement.innerHTML = 'Favorite';
                SongElements.forEach(function(item){
                    item.style.display = 'flex';
                })
            }
        })

        _this.playlistElement.addEventListener('click', function(e){
            var optionElement = e.target.closest('.play-item__option');
            if (optionElement){
                optionElement.querySelector('.play-item__option-menu').classList.toggle('active');
                return;
            }
            var songNode = e.target.closest('.play-item:not(.active)');
            if (songNode){
                _this.currentIndex = Array.from(_this.playlistElement.children).indexOf(songNode);
                changeSong();
            }
        });


        

    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    loadSong: function(){
        this.setConfig('currentIndex', this.currentIndex);
        var songName = $('.player__song-name');
        var playingSong = $('.play-item.active');
        if (playingSong){
            playingSong.classList.remove('active');
        }
        var curentSongElement =this.playlistElement.children[this.currentIndex];
        curentSongElement.classList.add('active');

        this.audioElement.src = this.currentSong.path;
        this.player_cd.innerHTML = `<div class="player__cd-thumb" style="background-image: url(${this.currentSong.image});"></div>`
        if (curentSongElement.offsetTop + curentSongElement.clientHeight > window.innerHeight + window.scrollY || curentSongElement.offsetTop - player.clientHeight < window.scrollY ){
            curentSongElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        }        
        songName.innerHTML = this.currentSong.name;
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = this.config.currentIndex;

        if (this.isRandom){
            $('.player__control-shuffle').classList.add('active');
        }
        if (this.isRepeat){
            $('.player__control-repeat').classList.add('active');
        }
    },


    start: function() {
        this.defineProperties();
        this.render();
        this.loadConfig();
        this.loadSong();
        this.handleEvents();
    },

};

app.start();




