var React = require('react');
var $ = require('jquery');
var emojione = require('emojione');

var Ticker = React.createClass({
    getInitialState: function() {
        return {
            item: 0,
            items: []
        };
    },
    tick: function() {
        this.setState({
            item: (this.state.item + 1) % this.state.items.length
        });
    },
    refresh: function() {
        Promise.resolve($.get('/api/ticker', null))
            .then(response => {
                if (this.isMounted()) {
                    this.setState({
                        items: response.data
                    });
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
        if (this.state.items.length > 0) {
            var item = this.state.items[this.state.item];
            var content = emojione.unicodeToImage(item.content);
            return (
                <figure className="ticker">
                    <p className="content" dangerouslySetInnerHTML={{__html: content}} />
                    <figcaption> &mdash; <cite>{item.source}</cite></figcaption>
                </figure>
            );
        } else {
            return <div />;
        }
    }
});

module.exports = Ticker;
