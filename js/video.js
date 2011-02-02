/*
* Universal Primer - Video components
*
* AGPL - Halfdan Mouritzen
*
*/

var upVideo = function() {
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

    var __init__ = function() {
        // Do initial setup

        // This sets up the HTML5 video element
        // Make a fallback for flash etc.
        videoDisplay = document.createElement('video');
        videoDisplay.width = '550';
        videoDisplay.height = '400';
        videoDisplay.addEventListener('click', function() { upVideo.controls.toggle(); }, false );

        // This places the play icon inside the displayContainer
        playIcon = document.createElement('img');
        playIcon.src = 'images/play.png';
        playIcon.className = 'playicon';
        playIcon.addEventListener('click', function() { upVideo.controls.play(); }, false );

        // Some more EventListeners
        videoDisplay.addEventListener('ended', function() { upVideo.controls.pause(); }, false);
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

        check: function() {
            return displayContainer;
        },

        setup: function(div) {
            displayContainer = div;
            div.appendChild(playIcon);
            div.appendChild(videoDisplay);
            div.appendChild(controlDisplay);
            displayContainer.className = 'paused';
        },

        loadVideo : function(videoId) {
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

            updateBufferedTimer = setInterval(updateBuffered, 100);
        },

        controls : {
            play : function() {
                // Start the timer that counts our progress
                updateScrubberTimer = setInterval(updateScrubber, 100);
                displayContainer.className = '';
                return videoDisplay.play();
            },
            pause : function() {
                // Stop the timer that counts our progress
                clearInterval(updateScrubberTimer);
                displayContainer.className = 'paused';
                return videoDisplay.pause();
            },
            toggle : function() {
                if (videoDisplay.paused) {
                    upVideo.controls.play();
                } else {
                    upVideo.controls.pause();
                }

                return videoDisplay.paused
            }
        }
    }
}();
