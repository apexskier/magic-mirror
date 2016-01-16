var moment = require('moment');
var React = require('react');

var Clock = React.createClass({
    getDefaultProps: function() {
        return {
            format: 'h:mm'
        };
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
            <div className="clock component center component-primary"><div>{this.getTime()}</div></div>
        );
    }
});

module.exports = Clock;
