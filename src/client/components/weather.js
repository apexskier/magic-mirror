var React = require('react');
var geolocation = require('../geolocation');
var $ = require('jquery');

const eveningHour = 12 + 5;
const morningHour = 10;

var Weather = React.createClass({
    getDefaultProps: function() {
        return {
            tickDuration: 1000 * 60 * 5 // 5 minutes
        };
    },
    getInitialState: function() {
        return {
            loading: true
        };
    },
    tick: function() {
        console.log('tick');
        this.setState({ error: undefined });

        Promise.resolve($.get(`/api/weather/${this.state.lat}/${this.state.lng}`, null))
        .then(response => {
            if (response.status !== 'error') {
                this.setState({ weather: response.data });
            } else {
                this.setState({ error: response.data });
            }
            this.setState({ loading: false });
        }).catch(err => {
            console.warn(err);
            if (typeof err === 'string') {
                this.setState({ error: err });
            } else {
                this.setState({ error: "Couldn't fetch weather" });
            }
        });
    },
    isEvening: function(nowHours) {
        return (nowHours || new Date().getHours()) > eveningHour;
    },
    componentDidMount: function() {
        geolocation.then(position => {
            this.setState({
                lat: position.latitude,
                lng: position.longitude
            });
            this.tick();
            this.interval = setInterval(this.tick, this.props.tickDuration);
        }).catch(err => {
            // try again in 1 minute
            setTimeout(this.componentDidMount, 1000 * 60);
            console.log('Trying again in 1 minute', err);
            this.setState({error: err});
        });
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    render: function() {
        if (this.state.error) {
            return (
                <div className="weather component error center"><div>{this.state.error}</div></div>
            );
        } else if (this.state.loading) {
            return (
                <div className="weather component center"><div className="loading"></div></div>
            );
        } else {
            var nowHours = new Date().getHours();
            var summary = `${(() => {
                if (nowHours < morningHour) { // morning
                    return this.state.weather.hourly.summary;
                } else if (this.isEvening(nowHours)) { // evening
                    return this.state.weather.hourly.summary;
                } else {
                    return this.state.weather.minutely.summary;
                }
            })().slice(0, -1)}${this.isEvening(nowHours) ? ' tomorrow' : ''}.`;
            var current = Math.round(this.state.weather.currently.apparentTemperature);
            var temps = this.state.weather.hourly.data.map(d => d.apparentTemperature);
            var high = Math.round(Math.max.apply(null, temps));
            var low = Math.round(Math.min.apply(null, temps));
            return (
                <div className="weather component text-center">
                    <p>{summary}</p>
                    <p>{low}℉ / {current}℉ / {high}℉</p>
                </div>
            );
        }
    }
});

module.exports = Weather;
