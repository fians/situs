
/**
 * Handlebars extension for Situs utility
 */

var handlebars  = require('handlebars');

/**
 * Escape function
 */
function escapeString(string) {
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Escape string
 */
handlebars.registerHelper('escape', function(options) {
    return escapeString(options.fn(this));
});

/**
 * Highlight code using highlight.js
 */
handlebars.registerHelper('code', function(options) {

    var attribute = 'none';
    var string = escapeString(options.fn(this));

    if (options.hash.hasOwnProperty('class')) {
        attribute = options.hash.class;
    }

    return '<pre><code class="'+attribute+'">' + string + '</code></pre>';
});

module.exports = handlebars;
