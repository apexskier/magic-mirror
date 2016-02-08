var React = require('react');
var socket = require('../websocket');

var TrackingBubble = React.createClass({
    getInitialState: function() {
        return {
            visible: false,
            left: 0.5,
            top: 0.5
        };
    },
    componentDidMount: function() {
        this.trackingTimeout = null;
        socket.on('tracking', (data) => {
            if (data && data.x && data.y && data.x > 0 && data.y > 0) {
                this.setState({
                    visible: true,
                    left: data.x,
                    top: data.y
                });
                this.trackingTimeout = setTimeout(() => {
                    if (this.isMounted()) {
                        this.setState({ visible: false });
                    }
                }, 1000);
            }
        });
        window.test = (v) => { this.setState(v); };
    },
    componentWillUnmount: function() {
        socket.off('tracking');
        clearTimeout(this.trackingTimeout);
    },
    render: function() {
        var classes = 'tracking-bubble';
        var xfactor = 0.5;
        var yfactor = 0.9;
        var left = (((1 - this.state.left) * yfactor) + ((1 - yfactor) / 2)) * 100;
        var top = ((this.state.top * xfactor) + ((1 - xfactor) / 2)) * 100;
        var style = {
            left: `${left}%`,
            top: `${top}%`
        };
        if (this.state.visible) {
            classes += ' visible';
        }
        return <div className={classes} style={style} />;
    }
});

module.exports = TrackingBubble;
