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
        });
    },
    componentWillUnmount: function() {
        socket.off('tracking');
        clearTimeout(this.trackingTimeout);
    },
    render: function() {
        var classes = 'tracking-bubble';
        var style;
        if (this.state.visible) {
            style = {
                left: this.state.left * 100 + '%',
                top: this.state.top * 100 + '%'
            };
            classes += ' visible';
        }
        return <div className={classes} style={style} />;
    }
});

module.exports = TrackingBubble;
