var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var Clock = require('./clock');
var Weather = require('./weather');
var Ticker = require('./ticker');

const animationend = (() => {
    var el = document.createElement('fakeelement'),
        transitions = {
            'animation': 'animationend',
            'OAnmiation': 'oAnimationEnd',
            'MozAnimation': 'animationend',
            'WebkitAnimation': 'webkitAnimationEnd'
        };
    for (var t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
})();

var hackCount = 0;

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
        this.inactiveTimeout = setTimeout(this.goInactive, this.props.activeTime);
    },
    goInactive() {
        this.setState({ active: false });
        this.inactiveTimeout = setTimeout(() => this.focus('center', true), 1000 * 2);
    },
    focus: function(state, allowWhenInactive) {
        allowWhenInactive = allowWhenInactive || this.state.active;
        if (this.animating || !allowWhenInactive || this.state.state === state) return;

        var $el = $(ReactDOM.findDOMNode(this));
        $el.removeClass((i, classes) => classes.split(' ').filter(c => c.startsWith('slide')).join(' '));

        setTimeout(() => {
            $el.addClass(`slide-${state}-out`).one(animationend, () => {
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
            return (
                <div className={stateClasses} onClick={this.goActive}>
                    <div className="row empty"></div>
                    <div className="row">
                        <div className="component empty" onClick={this.focusLeft} display="minimal" />
                        <div className="component component-primary center"><Clock /></div>
                        <div className="component center" onClick={this.focusRight}><Weather display="minimal" /></div>
                    </div>
                    <div className="row empty">
                        <div className="component center"><Ticker /></div>
                    </div>
                </div>
            );
        } else if (this.state.state === 'right') {
            content = (
                <div className="component center" onClick={this.focusReset}><Weather display="full" /></div>
            );
        } else if (this.state.state === 'left') {
            content = (
                <div className="component empty" onClick={this.focusReset} display="full" />
            );
        }
        return (
            <div className={stateClasses} onClick={this.goActive}>
                <div className="row empty"></div>
                <div className="row">
                    {content}
                </div>
                <div className="row empty"></div>
            </div>
        );
    }
});

module.exports = MainComponent;
