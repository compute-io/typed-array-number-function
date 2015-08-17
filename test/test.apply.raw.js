/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	apply = require( './../lib/apply.raw.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply (raw)', function tests() {

	it( 'should export a function', function test() {
		expect( apply ).to.be.a( 'function' );
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
				apply( noop, new Int8Array( [1,2,3] ), {
					'dtype': value
				});
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

		out = apply( add, arr1, 2, arr2 );
		assert.deepEqual( out, new Float64Array( [5,5,5,5] ) );
	});

	it( 'should apply a function and return an array having a specified type', function test() {
		var arr,
			out;

		arr = new Int8Array( [1,1,1,1] );

		out = apply( add, 2, arr, {
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

		actual = apply( add, out, 2, arr, {
			'out': true
		});
		assert.strictEqual( out, actual );
		assert.deepEqual( out, [3,3,3,3] );
	});

});
