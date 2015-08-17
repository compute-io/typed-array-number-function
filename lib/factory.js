'use strict';

// MODULES //

var isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isFunction = require( 'validate.io-function' ),
	isArray = require( 'validate.io-array' ),
	isNumber = require( 'validate.io-number-primitive' ),
	ctors = require( 'compute-array-constructors' ),
	validate = require( './validate.js' ),
	create = require( './create.js' );


// FACTORY //

/**
* FUNCTION: factory( [fcn,] types[, options] )
*	Returns a function for applying a function to each typed array element.
*
* @param {Function} [fcn] - function to apply
* @param {String[]} types - argument types
* @param {Object} [options] - function options
* @param {String} [options.dtype="float64"] - output data type
* @returns {Function} apply function
*/
function factory() {
	var opts = {},
		arrayFcn,
		options,
		types,
		vFLG,
		ctor,
		num,
		fcn,
		err,
		flg,
		idx,
		dt,
		i;

	// Parse the input arguments (polymorphic interface)...
	if ( arguments.length === 1 ) {
		types = arguments[ 0 ];
		vFLG = 2; // arg #s
	}
	else if ( arguments.length === 2 ) {
		if ( isFunction( arguments[ 0 ] ) ) {
			fcn = arguments[ 0 ];
			types = arguments[ 1 ];
			vFLG = 12; // arg #s
		} else {
			types = arguments[ 0 ];
			options = arguments[ 1 ];
			vFLG = 23; // arg #s
		}
	}
	else {
		fcn = arguments[ 0 ];
		types = arguments[ 1 ];
		options = arguments[ 2 ];
		vFLG = 123; // arg #s
	}
	if ( !isArray( types ) ) {
		throw new TypeError( 'invalid input argument. Argument specifying argument types must be a string array. Value: `' + types + '`.' );
	}
	// If an apply function has been provided, validate...
	if ( vFLG === 123 ) {
		if ( !isFunction( fcn ) ) {
			throw new TypeError( 'invalid input argument. Apply function must be a function. Value: `' + fcn + '`.' );
		}
	}
	// If an `options` argument has been provided, validate...
	if ( vFLG === 23 || vFLG === 123 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	num = types.length;
	for ( i = 0; i < num; i++ ) {
		if ( types[ i ] === 'array' ) {
			idx = i;
			break;
		}
	}
	dt = opts.dtype || 'float64';
	ctor = ctors( dt );
	if ( ctor === null ) {
		throw new Error( 'invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
	}
	flg = !fcn;
	if ( flg ) {
		arrayFcn = create( types );
		num += 1;
		idx += 1;
	} else {
		arrayFcn = create( fcn, types );
	}
	/**
	* FUNCTION: apply( [fcn,]...value )
	*	Applies a function to each typed array element.
	*
	* @private
	* @param {Function} [fcn] - function to apply
	* @param {Number|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} value - input values
	* @returns {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
	*/
	return function apply() {
		/* jshint newcap:false */
		var nargs = arguments.length,
			args = new Array( nargs ),
			k = 0,
			fcn,
			out,
			x,
			i, j;

		for ( i = 0; i < nargs; i++ ) {
			args[ i ] = arguments[ i ];
		}
		if ( flg ) {
			fcn = args[ 0 ];
			k = 1;
			if ( !isFunction( fcn ) ) {
				throw new TypeError( 'invalid input argument. First argument must be a function. Value: `' + fcn + '`.' );
			}
		}
		if ( nargs !== num ) {
			throw new Error( 'insufficient input arguments. Must provide ' + num + ' input values.' );
		}
		for ( i = k; i < nargs; i++ ) {
			j = i - k;
			x = args[ i ];
			if ( types[ j ] === 'array' && !isTypedArrayLike( x ) ) {
				throw new TypeError( 'invalid input argument. Input data structures must be a typed array. Value: `' + x + '`.' );
			}
			else if (
				types[ j ] === 'number' &&
				(x === x && !isNumber( x ))
			) {
				throw new TypeError( 'invalid input argument. Input data structure must be a number primitive. Value: `' + x + '`.' );
			}
		}
		out = new ctor( args[ idx ].length );
		if ( flg ) {
			// Make sure that the output array comes after the function to apply...
			args.unshift( null );
			args[ 0 ] = fcn;
			args[ 1 ] = out;
		} else {
			args.unshift( out );
		}
		return arrayFcn.apply( null, args );
	};
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
