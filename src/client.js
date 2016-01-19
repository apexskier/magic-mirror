var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var MainComponent = require('./client/components/mainComponent');

window.$ = $;

ReactDOM.render((
    <MainComponent state="center" activeTime={1000 * 60} />
), document.getElementById('root'));

/*
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

function createSrc(stream) {
    if (window.URL) {
        return window.URL.createObjectURL(stream);
    } else {
        return stream;
    }
}

if (navigator.getUserMedia && typeof MediaStreamTrack !== 'undefined') {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        // video = document.createElement('video');
        video = document.createElement('video');

    navigator.getUserMedia({video: true}, function(stream) {
        video.src = createSrc(stream);
        // video.play();

        setTimeout(function() {
            context.drawImage(video, 0, 0, 640, 480);

            var image = new Image();
            image.id = 'test';
            image.src = canvas.toDataURL();
            $('body').prepend(image);
        }, 1000);
    }, function err(e) {
        console.warn(e);
    })
} else {
    console.warn('webcam not supported');
}
*/
