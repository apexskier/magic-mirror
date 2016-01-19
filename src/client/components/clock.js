var moment = require('moment');
var React = require('react');

var Clock = React.createClass({
    getDefaultProps: function() {
        return {
            format: 'h:mm'
        };
    },
    propTypes: {
        format: React.PropTypes.string
    },
    getInitialState: function() {
        return {
            time: moment()
        };
    },
    getTime: function() {
        return this.state.time.format(this.props.format).toString();
    },
    tick: function() {
        this.setState({time: moment()});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    render: function() {
        return (
            <div className="clock">{this.getTime()}</div>
        );
    }
});

module.exports = Clock;
