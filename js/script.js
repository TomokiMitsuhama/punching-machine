window.onload = function(){
    const displayDom = document.getElementsByClassName("display")[0];
    const targetDom = document.getElementsByClassName("target")[0];
    const startcountDom = document.getElementsByClassName("startcount")[0];
    const endcountDom = document.getElementsByClassName("endcount")[0];
    const startDom = document.getElementsByClassName("start")[0];
    const resultDom = document.getElementsByClassName("result")[0];
    const finishDom = document.getElementsByClassName("finish")[0];
    const clickcountDom = document.getElementsByClassName("clickcount")[0];
    const restartDom = document.getElementsByClassName("restart")[0];
    const bgDom = document.getElementsByClassName("bg-cover")[0];

    const eventType = window.ontouchstart !== null ? "click" : "touchstart";

    let clickcount;

    innerwidth = window.innerWidth;
    innerheight = window.innerHeight;

    const addCount = function () {
        clickcount++;
        const playSource = context.createBufferSource();
        playSource.buffer = globalBufferList[0];
        playSource.connect(context.destination);
        playSource.start(0);
    };

    const gameready = function () {
        displayDom.removeEventListener(eventType, gameready);
        let startcount = 3;
        startcountDom.textContent = startcount;
        startDom.style.display = "None";
        startcountDom.style.display = "Block";

        // 位置調整
        startcountDom.style.top = (innerheight -150)/2 + "px";
        startcountDom.style.left = (innerwidth -150)/2 + "px";

        function countdownstart() {
            if(startcount > 1) {
                startcount--;
                startcountDom.textContent = startcount;
            } else {
                clearInterval(startintervalid)
                gamestart()
            }
        }
        let startintervalid = setInterval(countdownstart, 1000);
    }

    const gamestart = function () {
        let endcount = 10;
        endcountDom.textContent = endcount;
        targetDom.addEventListener(eventType, addCount);
        endcountDom.style.display = "Block";
        startcountDom.style.display = "None";
        bgDom.style.display = "None";

        function countdowningame() {
            if(endcount > 1) {
                endcount--;
                endcountDom.textContent = endcount;
            } else {
                clearInterval(gameintervalid)
                gameend()
            }
        }
        let gameintervalid = setInterval(countdowningame, 1000)
    }

    const gameend = function () {
        targetDom.removeEventListener(eventType, addCount);
        endcountDom.style.display = "None";
        finishDom.style.display = "Block";
        bgDom.style.display = "Block";

        // 位置調整
        finishDom.style.top = (innerheight -150)/2 + "px";
        finishDom.style.left = (innerwidth -400)/2 + "px";

        setTimeout(viewresult, 2000);
    }

    const viewresult = function () {
        finishDom.style.display = "None";
        resultDom.style.display = "Block";
        clickcountDom.textContent = clickcount;
        restartDom.addEventListener(eventType, gamerestart);

        // 位置調整
        resultDom.style.top = (innerheight -250)/2 + "px";
        resultDom.style.left = (innerwidth -300)/2 + "px";
    }

    const gamerestart = function () {
        // 表示設定
        clickcount = 0;
        resultDom.style.display = "None";
        finishDom.style.display = "None";
        startDom.style.display = "Block";
        // 位置調整
        targetDom.style.top = (innerHeight - 500)/2 +"px";
        targetDom.style.left = (innerWidth - 250)/2 +"px";
        startDom.style.bottom = (innerHeight - 500)/8 +"px";
        startDom.style.left = (innerWidth - 400)/2 +"px";
        startDom.addEventListener(eventType, gameready);
    }

    // 音設定
    let soundArray = [];
    let globalBufferList = [];
    function BufferLoader(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
      }

    BufferLoader.prototype.loadBuffer = function(url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        var loader = this;
        request.onload = function() {
          // Asynchronously decode the audio file data in request.response
          loader.context.decodeAudioData(
            request.response,
            function(buffer) {
              if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
              }
              loader.bufferList[index] = buffer;
              if (++loader.loadCount == loader.urlList.length)
                loader.onload(loader.bufferList);
            },
            function(error) {
              console.error('decodeAudioData error', error);
            }
          );
        }
        request.onerror = function() {
          alert('BufferLoader: XHR error');
        }
        request.send();
    }
    BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
      }
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    var context = new AudioContext();
    var bufferLoader = new BufferLoader(
        context,
        [ './src/punch.mp3',
        ],
        finishedLoading
    );
    bufferLoader.load();
    function finishedLoading(bufferList) {
        globalBufferList = bufferList;
        for( var i = 0; i < bufferList.length ; i++ ) {
          var source = context.createBufferSource();
          source.buffer = bufferList[i];
          source.connect(context.destination);
          soundArray.push(source);
          }
        document.addEventListener('click', function() {
          var buf = context.createBuffer(1, 1, 22050);
          var src = context.createBufferSource();
          src.buffer = buf;
          src.connect(context.destination);
          src.start(0);
        });
    }
    
    gamerestart();
}


