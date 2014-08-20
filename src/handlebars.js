
/**
 * Handlebars extension for Situs utility
 */

var handlebars  = require('handlebars');

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

module.exports = handlebars;
