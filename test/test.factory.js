/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	factory = require( './../lib/factory.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply factory', function tests() {

	it( 'should export a function', function test() {
		expect( factory ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided a types argument which is not a string array', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( value );
			};
		}
	});

	it( 'should throw an error if provided a types argument which is not a string array containing allowed types', function test() {
		var values = [
			['array',2,3],
			['array',null],
			['array','number','beep']
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( value );
			};
		}
	});

	it( 'should throw an error if none of the specified types is a typed array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			factory( ['number','number'] );
		}
	});

	it( 'should throw an error if provided an apply function argument which is not a function', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( value, ['array','number'], {} );
			};
		}
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( noop, ['array','number'], value );
			};
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				factory( ['array','number'], {
					'dtype': value
				});
			};
		}
		function badValue2( value ) {
			return function() {
				factory( noop, ['array','number'], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided an invalid output data type', function test() {
		var values = [
			'beep',
			'boop',
			'object'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				factory( noop, ['array','number'], {
					'dtype': value
				});
			};
		}
	});

	it( 'should return a function', function test() {
		var apply;

		apply = factory( ['array','number'] );
		assert.isFunction( apply );

		apply = factory( noop, ['array','number'] );
		assert.isFunction( apply );

		apply = factory( noop, ['array','number'], {} );
		assert.isFunction( apply );
	});

	it( 'should throw an error if not provided the correct number of input arrays', function test() {
		var apply;

		apply = factory( ['array','array'] );
		expect( foo ).to.throw( Error );
		expect( foo2 ).to.throw( Error );

		apply = factory( noop, ['array','array'] );
		expect( bar ).to.throw( Error );

		function foo() {
			apply( noop );
		}
		function foo2() {
			var a = new Int8Array( [1,2,3] );
			apply( noop, a, a, a );
		}
		function bar() {
			apply( new Int16Array( [1,2,3] ) );
		}
	});

	it( 'should throw an error if not provided typed-array-like arguments', function test() {
		var values,
			apply1,
			apply2,
			apply3,
			apply4;

		values = [
			'5',
			true,
			null,
			undefined,
			{},
			[],
			function(){}
		];

		apply1 = factory( noop, ['array'] );
		apply2 = factory( ['array','number','array'] );
		apply3 = factory( noop, ['number','array','array','array'] );
		apply4 = factory( ['number','array'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
			expect( badValue3( values[i] ) ).to.throw( TypeError );
			expect( badValue4( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				apply1( value );
			};
		}
		function badValue2( value ) {
			return function() {
				apply2( noop, new Int32Array( [1,2,3] ), 4, value );
			};
		}
		function badValue3( value ) {
			return function() {
				apply3( 5, new Int32Array( [1,2,3] ), new Uint32Array( [1,2,3] ), value );
			};
		}
		function badValue4( value ) {
			return function() {
				apply4( noop, value, new Int32Array( [1,2,3] ) );
			};
		}
	});

	it( 'should throw an error if provided incompatible typed-array-like arguments', function test() {
		var values,
			apply;

		values = [
			new Float64Array( [1,2,3,4] ),
			new Int32Array(),
			new Int16Array( [1,2] )
		];

		apply = factory( ['array','array'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				apply( noop, new Int8Array( [1,2,3] ), value );
			};
		}
	});

	it( 'should throw an error if provided an apply function argument which is not a function', function test() {
		var values,
			apply;

		values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		apply = factory( ['array'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				apply( value, new Int16Array( [1,2,3] ) );
			};
		}
	});

	it( 'should apply a function to a single typed array', function test() {
		var apply,
			arr,
			out;

		arr = new Int16Array( [1,1,1,1] );

		// General apply function...
		apply = factory( ['number','array'] );
		out = apply( add, 1, arr );
		assert.deepEqual( out, new Float64Array( [2,2,2,2] ) );

		// Specialized apply function...
		apply = factory( add, ['array','number'] );
		out = apply( arr, 1 );
		assert.deepEqual( out, new Float64Array( [2,2,2,2] ) );
	});

	it( 'should apply a function to multiple typed arrays', function test() {
		var apply,
			arr1,
			arr2,
			out;

		arr1 = new Uint16Array( [1,1,1,1] );
		arr2 = new Uint32Array( [2,2,2,2] );

		// General apply function...
		apply = factory( ['array','number','array'] );
		out = apply( add, arr1, 5, arr2 );
		assert.deepEqual( out, new Float64Array( [8,8,8,8] ) );

		// Specialized apply function...
		apply = factory( add, ['number','array','array'] );
		out = apply( 5, arr1, arr2 );
		assert.deepEqual( out, new Float64Array( [8,8,8,8] ) );
	});

	it( 'should apply a function and return an array having a specified type', function test() {
		var apply,
			arr,
			out;

		arr = new Uint16Array( [1,1,1,1] );

		apply = factory( add, ['number','array'], {
			'dtype': 'float32'
		});
		out = apply( 1, arr );

		assert.deepEqual( out, new Float32Array( [2,2,2,2] ) );
	});

});
