require('babel-polyfill');

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var MainComponent = require('./client/components/mainComponent');
var TrackingBubble = require('./client/components/trackingBubble');

// make global to make debugging easier
window.$ = $;

ReactDOM.render((
    <div>
        <MainComponent state="center" activeTime={1000 * 20} />
        <TrackingBubble />
    </div>
), document.getElementById('root'));
