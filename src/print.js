
/**
 * Print utility to console
 */

module.exports = {
	error: error
};

/**
 * Print beautiful error on console
 */
function error(content) {

    var errorStr = 
        '\n\n' + 
        'Build Failed!'.red + 
        '\n' + 
        content + 
        '\n\n';

    console.log(errorStr);
    process.exit();
}