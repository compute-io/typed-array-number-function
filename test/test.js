/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	arrayfun = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-typed-array-function', function tests() {

	it( 'should export a function', function test() {
		expect( arrayfun ).to.be.a( 'function' );
	});

	it( 'should export a factory function', function test() {
		expect( arrayfun.factory ).to.be.a( 'function' );
	});

	it( 'should export a function to create typed array functions', function test() {
		expect( arrayfun.create ).to.be.a( 'function' );
	});

	it( 'should export an apply function which provides fewer guarantees when validating input arguments', function test() {
		expect( arrayfun.raw ).to.be.a( 'function' );
	});

	it( 'should export a factory function which provides fewer guarantees when validating input arguments', function test() {
		expect( arrayfun.rawFactory ).to.be.a( 'function' );
	});

});
