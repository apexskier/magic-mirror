var React = require('react');
var $ = require('jquery');
var emojione = require('emojione');

var Ticker = React.createClass({
    items: [],
    tick: function() {
        this.setState({
            item: this.items[Math.floor(Math.random() * this.items.length)]
        });
    },
    refresh: function() {
        Promise.resolve($.get('/api/ticker', null))
            .then(response => {
                if (this.isMounted()) {
                    this.items = response.data;
                }
            }).catch(err => {
                console.warn(err);
            });
    },
    componentDidMount: function() {
        this.tickInterval = setInterval(this.tick, 1000 * 60 * 60);
        this.refresh();
        this.refreshInterval = setInterval(this.refresh, 1000 * 60 * 60 * 3);
    },
    componentWillUnmount: function() {
        clearInterval(this.tickInterval);
        clearInterval(this.refreshInterval);
    },
    render: function() {
        if (this.items.length > 0 && this.state.item) {
            var content = emojione.unicodeToImage(this.state.item.content);
            return (
                <figure className="ticker">
                    <p className="content" dangerouslySetInnerHTML={{__html: content}} />
                    <figcaption> &mdash; <cite>{this.state.item.source}</cite></figcaption>
                </figure>
            );
        } else {
            return <div />;
        }
    }
});

module.exports = Ticker;
