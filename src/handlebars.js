
/**
 * Handlebars extension for Situs utility
 */

var handlebars  = require('handlebars');
var hljs        = require('highlight.js');

/**
 * Escape string
 */
handlebars.registerHelper('escape', function(options) {
    return options.fn(this)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
        
});

/**
 * Highlight code using highlight.js
 */
handlebars.registerHelper('code', function(options) {

    if (options.hash.hasOwnProperty('lang')) {
        var lang = options.hash.lang;
        string = '<pre><code class="'+lang+'">' + hljs.highlight(lang, options.fn(this)).value;
    } else {
        string = '<pre><code>' + hljs.highlightAuto(options.fn(this)).value;
    }

    return string += '</code></pre>';
});

module.exports = handlebars;
