'use strict';

/**
* FUNCTION: noop( val )
*	A typed array function which does not change a typed array element.
*
* @param {Number} val - array value
* @returns {Number} array value
*/
function noop( val ) {
	return val;
}

// EXPORTS //

module.exports = noop;
