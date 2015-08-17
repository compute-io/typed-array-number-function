/* jshint evil:true */
'use strict';

// MODULES //

var isArray = require( 'validate.io-array' ),
	isFunction = require( 'validate.io-function' );


// CREATE //

/**
* FUNCTION: create( [fcn,] types )
*	Returns a function for applying a function to each typed array element.
*
* @param {Function} [fcn] - function to apply. If not provided, a function must be provided at runtime.
* @param {String[]} types - argument types
* @returns {Function} apply function
*/
function create() {
	var nargs = arguments.length,
		types,
		flg,
		num,
		fcn,
		n,
		f,
		i;

	if ( nargs === 1 ) {
		types = arguments[ 0 ];
		flg = true;
	}
	else if ( isFunction( arguments[ 0 ] ) ) {
		fcn = arguments[ 0 ];
		types = arguments[ 1 ];
		flg = false;
	}
	else {
		throw new TypeError( 'invalid input arguments. Must provide a function to apply and the number of array arguments. Values: `' + arguments + '`.' );
	}
	if ( !isArray( types ) ) {
		throw new TypeError( 'invalid input arguments. Argument types must be a string array. Value: `' + types + '`.' );
	}
	num = types.length;
	for ( i = 0; i < num; i++ ) {
		if ( types[ i ] === 'array' ) {
			n = i;
		}
		else if ( types[ i ] !== 'number' ) {
			throw new TypeError( 'invalid input argument. An argument type must be either `array` or `number`. Value: `' + types[ i ] + '`.' );
		}
	}
	if ( n === void 0 ) {
		throw new Error( 'invalid input argument. At least one input argument must be a typed array.' );
	}
	// Update the number of input arguments to include the output array...
	n = num;
	num += 1;

	// Code generation. Start with the function definition...
	f = 'return function apply(';

	// Check if a function will be provided at runtime...
	if ( flg ) {
		f += 'fcn,';
	}
	// Create the array arguments...
	// => function apply( [fcn,] o, v1, v2,...) {
	f += 'o,';
	for ( i = 1; i < num; i++ ) {
		f += 'v' + i;
		if ( i < n ) {
			f += ',';
		}
	}
	f += '){';

	// Create the function body...

	// Create internal variables...
	// => var len, i;
	f += 'var len,i;';

	// Perform shape validation (where we assume all input args are arrays)...
	f += 'len=o.length;';
	for ( i = 1; i < num; i++ ) {
		if ( types[ i-1 ] === 'array' ) {
			f += 'if(v'+i+'.length!==len){';
			f += 'throw new Error(\'invalid input argument. All arrays must have the same length.\');';
			f += '}';
		}
	}
	/*
		var len,
			i;

		len = o.length;
		if ( v1.length !== len ) {
			throw new Error(...);
		}
		...
	*/

	// Apply the function to each array element...
	f += 'for(i=0;i<len;i++){';
	f += 'o[i]=';
	if ( flg ) {
		f += 'fcn';
	} else {
		f += 'apply._f';
	}
	f += '(';
	for ( i = 1; i < num; i++ ) {
		if ( types[ i-1 ] === 'array' ) {
			f += 'v' + i + '[i]';
		} else {
			f += 'v' + i;
		}
		if ( i < n ) {
			f += ',';
		}
	}
	f += ');';
	f += '}';
	/*
		for ( i = 0; i < len; i++ ) {
			o[ i ] = fcn( v1[i], v2[i],... );
		}
	*/

	// Return the output array...
	f += 'return o;';

	// Close the function:
	f += '};';

	// Create the function in the global scope...
	f = ( new Function( f ) )();

	// If provided an apply function, bind the apply function to the created function so it may be referenced during invocation...
	if ( flg === false ) {
		f._f = fcn;
	}
	return f;
	/*
		function apply( [fcn,] o, v1, v2,...) {
			var len,
				i;

			len = o.length;
			if ( v1.length !== len ) {
				throw new Error(...);
			}
			...
			for ( i = 0; i < len; i++ ) {
				o[i] = fcn( v1[i], v2[i],...);
			}
			return o;
		}
	*/
} // end FUNCTION create()


// EXPORTS //

module.exports = create;
