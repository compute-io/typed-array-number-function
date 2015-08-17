/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	create = require( './../lib/create.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'create apply', function tests() {

	it( 'should export a function', function test() {
		expect( create ).to.be.a( 'function' );
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
				create( value );
			};
		}
	});

	it( 'should throw an error if provided a types argument which is not a string array containing allowed types', function test() {
		var values = [
			['array','beep'],
			['number',null],
			[1,2,3]
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				create( value );
			};
		}
	});

	it( 'should throw an error if none of the specified types is a typed array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			create( ['number','number','number'] );
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
				create( value, ['array','number'] );
			};
		}
	});

	it( 'should return a function', function test() {
		var apply;

		apply = create( ['array','number'] );
		expect( apply ).to.be.a( 'function' );

		apply = create( noop, ['array','number'] );
		expect( apply ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided incompatible typed-array-like arguments', function test() {
		var values,
			apply1,
			apply2;

		values = [
			new Int8Array( [1,2,3,4] ),
			new Int8Array(),
			new Int8Array( [1,2,3,4,5] )
		];

		apply1 = create( ['array','array'] );
		apply2 = create( noop, ['array','array'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( Error );
			expect( badValue2( values[i] ) ).to.throw( Error );
		}
		function badValue1( value ) {
			return function() {
				apply1( noop, new Int8Array( [1,2,3] ), value );
			};
		}
		function badValue2( value ) {
			return function() {
				apply2( new Int8Array( [1,2,3] ), value );
			};
		}
	});

	it( 'should apply a function to a single typed array', function test() {
		var apply,
			actual,
			arr,
			out;

		arr = new Int8Array( [1,1,1,1] );

		// General apply...
		out = new Array( arr.length );

		apply = create( ['number','array'] );
		actual = apply( add, out, 1, arr );

		assert.strictEqual( actual, out );
		assert.deepEqual( out, [2,2,2,2] );

		// Apply a particular function...
		out = new Array( arr.length );
		apply = create( add, ['array','number'] );

		actual = apply( out, arr, 1 );
		assert.deepEqual( out, [2,2,2,2] );
	});

	it( 'should apply a function to multiple typed arrays', function test() {
		var apply,
			actual,
			arr1,
			arr2,
			out;

		arr1 = new Int8Array( [1,1,1,1] );
		arr2 = new Float32Array( [2,2,2,2] );

		// General apply...
		out = new Array( arr1.length );
		apply = create( ['array','number','array'] );

		actual = apply( add, out, arr1, 5, arr2 );
		assert.strictEqual( actual, out );
		assert.deepEqual( out, [8,8,8,8] );

		// Apply a particular function...
		out = new Array( arr1.length );
		apply = create( add, ['array','number','array'] );

		actual = apply( out, arr1, 5, arr2 );
		assert.strictEqual( actual, out );
		assert.deepEqual( out, [8,8,8,8] );
	});

});
