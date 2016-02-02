var React = require('react');
var ReactDOM = require('react-dom');
var geolocation = require('../geolocation');
var moment = require('moment');
var skycons = new (require('skycons'))({'color': 'white'});
var $ = require('jquery');

const eveningHour = 12 + 5;
const morningHour = 10;
/* const animationstart = (() => {
    var el = document.createElement('fakeelement'),
        transitions = {
            'animation': 'animationstart',
            'OAnmiation': 'oAnimationStart',
            'MozAnimation': 'animationstart',
            'WebkitAnimation': 'webkitAnimationStart'
        };
    for (var t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
})(); */

var Weather = React.createClass({
    getDefaultProps: function() {
        return {
            display: 'minimal',
            tickDuration: 1000 * 60 * 5 // 5 minutes
        };
    },
    propTypes: {
        display: React.PropTypes.oneOf(['minimal', 'full']),
        tickDuration: React.PropTypes.number
    },
    getInitialState: function() {
        return {
            loading: true
        };
    },
    tick: function() {
        this.setState({ error: undefined });

        Promise.resolve($.get(`/api/weather/${this.state.lat}/${this.state.lng}`, null))
            .then(response => {
                if (this.isMounted()) {
                    this.setState({
                        weather: response.data,
                        loading: false
                    });
                }
            }).catch(err => {
                if (this.isMounted()) {
                    console.warn(err);
                    if (typeof err === 'string') {
                        this.setState({ error: err });
                    } else {
                        this.setState({ error: "Couldn't fetch weather" });
                    }
                }
            });
    },
    isEvening: function(nowHours) {
        return (nowHours || new Date().getHours()) > eveningHour;
    },
    componentDidMount: function() {
        geolocation.then(position => {
            if (this.isMounted()) {
                this.setState({
                    lat: position.latitude,
                    lng: position.longitude
                });
                this.tick();
                this.interval = setInterval(this.tick, this.props.tickDuration);
            }
        }).catch(err => {
            if (this.isMounted()) {
                // try again in 1 minute
                setTimeout(this.componentDidMount, 1000 * 60);
                console.log('Trying again in 1 minute', err);
                this.setState({error: err});
            }
        });
        this.componentDidUpdate();
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    componentDidUpdate: function() {
        this.updateIcons();
        /* $(ReactDOM.findDOMNode(this)).find('.fadein-invisible').one(animationstart, function(e) {
            $(e.target).removeClass('fadein-invisible');
        });*/
    },
    updateIcons: function() {
        Array.prototype.forEach.call(ReactDOM.findDOMNode(this).querySelectorAll('.skycon'), function(el) {
            skycons.add(el, el.dataset.skycon);
        });
        skycons.play();
    },
    render: function() {
        if (this.state.error) {
            return (
                <div className="weather error"><div>{this.state.error}</div></div>
            );
        } else if (this.state.loading) {
            return (
                <div className="weather"><div className="loading"></div></div>
            );
        } else {
            var nowHours = new Date().getHours();
            if (this.props.display === 'full') {
                var data = this.state.weather.hourly.data.slice(0, 18);

                var roundProbs = data.map(d => Math.round(d.precipProbability * 100));
                var probRange = [
                    Math.min.apply(null, roundProbs),
                    roundProbs.reduce((p, c) => p + c, 0) / roundProbs.length,
                    Math.max.apply(null, roundProbs)
                ];

                var roundTemps = data.map(d => Math.round(d.apparentTemperature));
                var tempRange = [
                    Math.min.apply(null, roundTemps),
                    roundTemps.reduce((p, c) => p + c, 0) / roundTemps.length,
                    Math.max.apply(null, roundTemps)
                ];

                var iconGroups = [];
                var currentGroup = { times: [] };
                iconGroups.push(currentGroup);
                data.forEach(d => {
                    if (currentGroup.times.length !== 0 && currentGroup.icon !== d.icon) {
                        currentGroup = { times: [] };
                        iconGroups.push(currentGroup);
                    }
                    currentGroup.icon = d.icon;
                    currentGroup.times.push(d.time);
                });
                var timeIcons = {};
                iconGroups.forEach(d => {
                    if (d.times.length === 1) {
                        timeIcons[d.times[0]] = {
                            icon: true,
                            classes: 'icon icon-visible icon-group-start icon-group-end'
                        };
                    } else {
                        timeIcons[d.times[0]] = {
                            icon: false,
                            classes: 'icon icon-group-start'
                        };
                        if (d.times.length === 2) {
                            timeIcons[d.times[1]] = {
                                icon: true,
                                classes: 'icon icon-visible icon-uphalf icon-group-end'
                            };
                        } else {
                            timeIcons[d.times[d.times.length - 1]] = {
                                icon: false,
                                classes: 'icon icon-group-end'
                            };
                            if (d.times.length % 2 === 0) {
                                timeIcons[d.times[d.times.length / 2]] = {
                                    icon: true,
                                    classes: 'icon icon-visible icon-uphalf'
                                };
                            } else {
                                timeIcons[d.times[Math.floor(d.times.length / 2)]] = {
                                    icon: true,
                                    classes: 'icon icon-visible'
                                };
                            }
                        }
                    }
                });

                // var fadeinDelay = 0;

                var hourly = data.slice(0, 18).map(d => {
                    var prob = Math.round(d.precipProbability * 100);
                    var temp = Math.round(d.apparentTemperature);

                    var probStatus = '';
                    if (prob === probRange[0]) {
                        probStatus = 'min';
                    } else if (prob === probRange[2]) {
                        probStatus = 'max';
                    } else if (prob < probRange[1]) {
                        probStatus = 'less';
                    } else if (prob > probRange[1]) {
                        probStatus = 'more';
                    }
                    probStatus += ` prob`;

                    var tempStatus = '';
                    if (temp === tempRange[0]) {
                        tempStatus = 'min';
                    } else if (temp === tempRange[2]) {
                        tempStatus = 'max';
                    } else if (temp < tempRange[1]) {
                        tempStatus = 'less';
                    } else if (temp > tempRange[1]) {
                        tempStatus = 'more';
                    }
                    tempStatus += ` temp`;

                    var probEl = <td className={probStatus} />;
                    if (prob > 0) probEl = <td className={probStatus}><small>{prob}%</small></td>;

                    var iconEl = <td className="icon" />;
                    if (timeIcons.hasOwnProperty(d.time)) {
                        iconEl = (
                            <td className={timeIcons[d.time].classes}>
                                <div className="arrow">
                                    {timeIcons[d.time].icon ? <canvas className="skycon" data-skycon={d.icon} width="32" height="32"></canvas> : ''}
                                </div>
                            </td>
                        );
                    }

                    // var classes = `fadein-invisible fadein-after-${fadeinDelay}`;
                    // fadeinDelay += 20;
                    //  className={classes}>

                    return (
                        <tr key={d.time}>
                            <td className="time">{moment(d.time * 1000).format('h a')}</td>
                            <td className={tempStatus}>{temp}℉</td>
                            {probEl}
                            {iconEl}
                        </tr>
                    );
                });
                return (
                    <div className="weather full">
                        <h3>{this.state.weather.hourly.summary}</h3>
                        <table className="hourly">
                            <tbody>
                                {hourly}
                            </tbody>
                        </table>
                    </div>
                );
            } else {
                var summary = (() => {
                    if (nowHours < morningHour) { // morning
                        return this.state.weather.hourly.summary;
                    // } else if (this.isEvening(nowHours)) { // evening
                    //     return this.state.weather.hourly.summary;
                    } else {
                        return this.state.weather.minutely.summary;
                    }
                })();
                var current = Math.round(this.state.weather.currently.apparentTemperature);
                var temps = this.state.weather.hourly.data.map(d => d.apparentTemperature);
                var high = Math.round(Math.max.apply(null, temps));
                var low = Math.round(Math.min.apply(null, temps));
                return (
                    <div className="weather">
                        <p>{summary}</p>
                        <p>{low}℉ / {current}℉ / {high}℉</p>
                    </div>
                );
            }
        }
    }
});

module.exports = Weather;
