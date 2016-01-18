var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

window.$ = $;

var Clock = require('./client/components/clock');
var Weather = require('./client/components/weather');

var entryNode = document.getElementById('root');

var MainComponent = React.createClass({
    getInitialState: function() {
        return {
            state: this.props.state,
            active: true,
            prevState: 'center'
        };
    },
    animating: false,
    componentDidMount: function() {
        this.inactiveTimeout = setTimeout(this.goInactive, 1000 * 5);
    },
    componentWillUnmount: function() {
    },
    switchState: function(to) {
        this.setState({
            state: to,
            prevState: this.state.state
        });
    },
    goActive: function() {
        this.setState({ active: true });
        clearTimeout(this.inactiveTimeout);
        setTimeout(this.goInactive, this.props.activeTime);
    },
    goInactive() {
        this.setState({ active: false });
    },
    focus: function(state) {
        if (this.animating || !this.state.active) return;
        this.animating = true;

        $(ReactDOM.findDOMNode(this))
            .removeClass((i, classes) => classes.split(' ').filter(c => c.startsWith('slide')).join(' '));
        setTimeout(() => {
            $(ReactDOM.findDOMNode(this))
                .addClass(`slide-${state}-out`)
                .one('animationend', () => {
                    this.animating = false;
                    this.switchState(state);
                });
        }, 100);
    },
    focusLeft: function() {
        this.focus('left');
    },
    focusRight: function() {
        this.focus('right');
    },
    focusReset: function() {
        this.focus('center');
    },
    render: function() {
        var content;
        var stateClasses = `container state-${this.state.state} state-prev-${this.state.prevState} slide-${this.state.prevState}-in`;
        if (!this.state.active) {
            stateClasses += ' inactive';
        }
        if (this.state.state === 'center') {
            content = (
                <div className="row">
                    <div className="component empty" onClick={this.focusLeft} display="minimal" />
                    <div className="component component-primary center"><Clock /></div>
                    <div className="component center" onClick={this.focusRight}><Weather display="minimal" /></div>
                </div>
            );
        } else if (this.state.state === 'right') {
            content = (
                <div className="">
                    <div className="component center" onClick={this.focusReset}><Weather display="full" /></div>
                </div>
            );
        } else if (this.state.state === 'left') {
            content = (
                <div className="row slide-center-in">
                    <div className="component empty" onClick={this.focusReset} display="full" />
                </div>
            );
        }
        return (
            <div className={stateClasses} onClick={this.goActive}>{content}</div>
        );
    }
});

ReactDOM.render((
    <MainComponent state="center" activeTime={1000 * 60} />
), entryNode);

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
