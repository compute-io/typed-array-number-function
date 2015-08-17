'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isArray = require( 'validate.io-array' ),
	isNumber = require( 'validate.io-number-primitive' ),
	ctors = require( 'compute-array-constructors' ),
	validate = require( './validate.js' );


// APPLY //

/**
* FUNCTION: apply( fcn, ...value[, opts] )
*	Applies a function to each typed array element.
*
* @param {Function} fcn - function to apply
* @param {Number|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} value - input values
* @param {Object} [opts] - function options
* @param {String} [opts.dtype="float64"] - output data type
* @param {Boolean} [opts.out=false] - boolean indicating whether an output array has been provided
* @returns {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function apply() {
	/* jshint newcap:false */
	var nargs = arguments.length,
		args = new Array( nargs ),
		opts = {},
		isArr,
		ctor,
		err,
		fcn,
		out,
		arr,
		len,
		dt,
		x,
		i, j;

	for ( i = 0; i < nargs; i++ ) {
		args[ i ] = arguments[ i ];
	}
	i = nargs - 1;
	x = args[ i ];
	if (
		!isTypedArrayLike( x ) &&
		(x === x && !isNumber( x ))
	) {
		nargs -= 1;
		err = validate( opts, args[ nargs ] );
		if ( err ) {
			throw err;
		}
		args.length = nargs;
	}
	fcn = args.shift();
	nargs -= 1;
	if ( !isFunction( fcn ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a function. Value: `' + fcn + '`.' );
	}
	if ( opts.out ) {
		out = args.shift();
		if ( !isTypedArrayLike( out ) && !isArray( out ) ) {
			throw new TypeError( 'invalid input argument. Output argument must be either an array or typed array. Value: `' + out + '`.' );
		}
		len = out.length;
		nargs -= 1;
	}
	if ( nargs === 0 ) {
		throw new Error( 'insufficient input arguments. Must provide input values.' );
	}
	isArr = new Array( nargs );
	for ( i = 0; i < nargs; i++ ) {
		x = args[ i ];
		if ( isTypedArrayLike( x ) ) {
			if ( len === void 0 ) {
				len = x.length;
			}
			else if ( x.length !== len ) {
				throw new Error( 'invalid input argument. All input arrays must have the same length.' );
			}
			isArr[ i ] = true;
		}
		else if ( isNumber( x ) || x !== x ) {
			isArr[ i ] = false;
		}
		else {
			throw new TypeError( 'invalid input argument. Input data structures must be either typed arrays or number primitives. Value: `' + x + '`.' );
		}
	}
	if ( len === void 0 ) {
		throw new Error( 'invalid input arguments. At least one argument must be a typed array.' );
	}
	if ( !opts.out ) {
		dt = opts.dtype || 'float64';
		ctor = ctors( dt );
		if ( ctor === null ) {
			throw new Error( 'invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
		}
		out = new ctor( len );
	}
	arr = new Array( nargs );
	for ( i = 0; i < len; i++ ) {
		for ( j = 0; j < nargs; j++ ) {
			if ( isArr[ j ] ) {
				arr[ j ] = args[ j ][ i ];
			} else {
				arr[ j ] = args[ j ];
			}
		}
		out[ i ] = fcn.apply( null, arr );
	}
	return out;
} // end FUNCTION apply()


// EXPORTS //

module.exports = apply;
