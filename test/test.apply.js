/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	apply = require( './../lib/apply.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply', function tests() {

	it( 'should export a function', function test() {
		expect( apply ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided a function', function test() {
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
				apply( value, new Int8Array( [1,2,3] ) );
			};
		}
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
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
				apply( noop, new Int8Array([1,2,3]), value );
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
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				apply( noop, new Int8Array([1,2,3]), {
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
				apply( noop, new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if not provided input values (typed arrays or numbers)', function test() {
		expect( foo ).to.throw( Error );
		expect( bar ).to.throw( Error );
		function foo() {
			apply( noop );
		}
		function bar() {
			apply( noop, [], {
				'out': true
			});
		}
	});

	it( 'should throw an error if not provided at least one typed array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			apply( noop, 1, 2, 3 );
		}
	});

	it( 'should throw an error if provided an output argument which is not an array or typed array', function test() {
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
				apply( noop, value, new Int8Array([1,2,3]), {
					'out': true
				});
			};
		}
	});

	it( 'should throw an error if not provided typed-array-like or numeric arguments', function test() {
		var values = [
			'5',
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
				apply( noop, new Int8Array([1,2,3]), value, 5, {} );
			};
		}
		function badValue2( value ) {
			return function() {
				apply( noop, new Int8Array([1,2,3]), 5, new Int8Array([1,2,3]), value, {} );
			};
		}
	});

	it( 'should throw an error if provided incompatible typed-array-like arguments', function test() {
		var values = [
			new Int32Array([1,2,3,4]),
			new Int32Array(),
			new Int32Array([1,2,3,4,5])
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				apply( noop, new Int32Array([1,2,3]), value );
			};
		}
	});

	it( 'should apply a function to a single typed array', function test() {
		var arr,
			out;

		arr = new Int8Array( [1,1,1,1] );

		out = apply( add, arr, 1 );
		assert.deepEqual( out, new Float64Array([2,2,2,2]) );
	});

	it( 'should apply a function to multiple typed arrays', function test() {
		var arr1,
			arr2,
			out;

		arr1 = new Int8Array( [1,1,1,1] );
		arr2 = new Float32Array( [2,2,2,2] );

		out = apply( add, arr1, 1, arr2 );
		assert.deepEqual( out, new Float64Array( [4,4,4,4] ) );
	});

	it( 'should apply a function and return an array having a specified type', function test() {
		var arr,
			out;

		arr = new Int8Array( [1,1,1,1] );

		out = apply( add, arr, 2, {
			'dtype': 'float32'
		});
		assert.deepEqual( out, new Float32Array( [3,3,3,3] ) );
	});

	it( 'should apply a function to a single typed array and use a provided output array', function test() {
		var arr,
			out,
			actual;

		arr = new Int8Array( [1,1,1,1] );
		out = new Array( arr.length );

		actual = apply( add, out, arr, 2, {
			'out': true
		});
		assert.strictEqual( out, actual );
		assert.deepEqual( out, [3,3,3,3] );
	});

});
