require('babel-polyfill');

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var MainComponent = require('./client/components/mainComponent');

// make global to make debugging easier
window.$ = $;

ReactDOM.render((
    <div>
        <MainComponent state="center" activeTime={1000 * 20} />
    </div>
), document.getElementById('root'));
