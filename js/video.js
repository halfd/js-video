/*
* Universal Primer - Video components
*
* AGPL - Halfdan Mouritzen
*
*/

var upVideo = Class.extend({
    /*************************************************************
     *
     * upVideo autoinitiates itself when you include the javascript, 
     * so you just have to tell it which div you want it to inject the 
     * player into : 
     * 
     * var display = document.getElementById('display');
     * upVideo.setup(display);
     *
     *************************************************************/

    // Private
    var displayContainer = null;
    var videoDisplay = null;
    var playIcon = null;
    var controlDisplay = null;
    var updateScrubberTimer = null;

    var totalVideoTime = null;
    var currentVideoTime = null;

    var playedDisplay = null;
    var bufferedDisplay = null;

    var videoSource = null;

    // Testing
    var html5video = (getUrlVars()['html5'] == 'oui');
    var flashvideo = (!html5video);

    var __init__ = function() {
        // Do initial setup

        // This sets up the HTML5 video element
        // Make a fallback for flash etc.
        if (html5video) {
            videoDisplay = document.createElement('video');
            videoDisplay.width = '640';
            videoDisplay.height = '390';
            //videoDisplay.addEventListener('click', function() { upVideo.controls.toggle(); }, false );
            videoDisplay.addEventListener('ended', function() { upVideo.controls.pause(); }, false);
        } else if (flashvideo) {
            videoDisplay = document.createElement('object');
            videoDisplay.width = '640';
            videoDisplay.height = '390';
            videoDisplay.id = 'videoDisplay';
            param = document.createElement('param');
            param.value = '../flex-test/callBack.swf';
            param.name = 'movie';

            var wmode = document.createElement('param');
            wmode.name = 'wmode';
            wmode.value = 'transparent';

            embed = document.createElement('embed');
            embed.id = 'videoDisplay';
            embed.src = '../flex-test/callBack.swf';

            videoDisplay.appendChild(param);
            videoDisplay.appendChild(wmode);
            videoDisplay.appendChild(embed);
        }

        // This places the play icon inside the displayContainer
        playIcon = document.createElement('img');
        playIcon.src = 'images/play.png';
        playIcon.className = 'playicon';

        playIconWrapper = document.createElement('div');
        playIconWrapper.id = 'playiconwrapper';
        playIconWrapper.appendChild(playIcon);
        playIconWrapper.addEventListener('click', function() {
        controls.toggle(); }, false );

        buildControls();

        return null
    }

    var buildControls = function() {
        var controls = document.createElement('div');
        controls.id = 'up-controls';

        var toggle = document.createElement('div');
        toggle.id = 'up-toggle';

        toggle.addEventListener('click', function() { upVideo.controls.toggle(); }, false );

        var scrubber = document.createElement('div');
        scrubber.id = 'up-scrubber';

        playedDisplay = document.createElement('div');
        playedDisplay.id = 'up-played';

        bufferedDisplay = document.createElement('div');
        bufferedDisplay.id = 'up-buffered';

        scrubber.appendChild(bufferedDisplay);
        scrubber.appendChild(playedDisplay);

        controls.appendChild(scrubber);
        controls.appendChild(toggle);
        //controls.appendChild(pause);

        controlDisplay = controls;
    }

    var updateScrubber = function() {
        currentVideoTime = videoDisplay.currentTime;
        totalVideoTime = videoDisplay.duration;

        var per = (currentVideoTime / totalVideoTime) * 100;

        playedDisplay.style.width = per + '%';
    }

    var updateBuffered = function() {
        var buffered = videoDisplay.buffered.length;

        var per = buffered * 100;

        bufferedDisplay.style.width = per + '%';
        if (per === 100) {
            clearInterval(updateBufferedTimer);            
        }
    }

    var setControls = function() {
        // Set the status of the play/pause button
    }

    // initiate
    __init__();

    // return public methods
    return {
        video: videoDisplay,
        autoPlay : false,

        check: function() {
            return displayContainer;
        },

        setup: function(div) {
            /****************************************************
             * 
             * Pass it a container DIV, then upVideo fills it with
             * the video and controllers
             * 
             ****************************************************/

            displayContainer = div;
            div.appendChild(videoDisplay);
            div.appendChild(playIconWrapper);
            div.appendChild(controlDisplay);
            displayContainer.className = displayContainer.className + ' paused';
        },

        loadVideo : function(videoId) {
            videoUrl = videoId;
            if (html5video) {
                upVideo.setSource();
            } else if (flashvideo) {
                // Wait for the flash element to be loaded before we try to set
                // source
            }
        },

        setSource : function() {
            var videoId = videoUrl;
            if (html5video) {
                videoDisplay.poster = 'video/' + videoId + '.jpg';

                // Add the webm source
                var source = document.createElement('source');
                source.src = 'video/' + videoId + '.webm';
                source.type = 'video/webm; codecs="vp8, vorbis"';
                videoDisplay.appendChild(source);

                // Add the ogg source
                var source = document.createElement('source');
                source.src = 'video/' + videoId + '.ogg';
                source.type = 'video/ogg; codecs="theora, vorbis"';
                videoDisplay.appendChild(source);

            } else if (flashvideo) {
                videoDisplay.setSource('/js-video/video/' + videoId + '.mp4');
            }

            if (upVideo.autoPlay) {
                upVideo.controls.play();
            }
        },

        playerIsReady : function() {
            upVideo.setSource();
        },

        controls : {
            play : function() {
                // Start the timer that counts our progress
                updateScrubberTimer = setInterval(updateScrubber, 100);
                displayContainer.className = 'upVideoDisplay';
                return videoDisplay.play();
            },
            pause : function() {
                // Stop the timer that counts our progress
                clearInterval(updateScrubberTimer);
                displayContainer.className = 'upVideoDisplay paused';
                return videoDisplay.pause();
            },
            toggle : function() {
                if (/paused/.test(displayContainer.className)) {
                    upVideo.controls.play();
                } else {
                    upVideo.controls.pause();
                }

                return videoDisplay.paused
            },
            setCallback : function(funcStr, ms) {
                videoDisplay.setTimerCallback(funcStr, ms);
            },
            status : function() {
                videoDisplay.status();
            }
        },
    }
});

// Helpers and temporary stuff

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function besked(str) {
    console.info(str);
}

