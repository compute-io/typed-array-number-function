Typed-Array-Number Function
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Applies a function to each [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) element.


## Installation

``` bash
$ npm install compute-typed-array-number-function
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var arrayfun = require( 'compute-typed-array-number-function' );
```

<a name="arrayfun"></a>
#### arrayfun( fcn, ...value[, options] )

Applies a `function` to each [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) element. `value` arguments may be either [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or `number` primitives.

``` javascript
var arr = new Int8Array( [1,2,3,4,5] );

function add( x, y ) {
	return x + y;
}

var out = arrayfun( add, arr, 5 );
// returns Float64Array( [6,7,8,9,10] )
```

The function accepts the following `options`:

*	__dtype__: output data type. Default: `float64`.
*	__out__: `boolean` indicating whether an output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) has been provided. Default: `false`.

By default, the output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) data type is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`compute-array-constructors`](https://github.com/compute-io/array-constructors) for a list of acceptable data types).

``` javascript
var out = arrayfun( add, arr, 5, {
	'dtype': 'int8';
});
// return Int8Array( [6,7,8,9,10] )
```

By default, the `function` returns a new [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays). To mutate a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) (e.g., when input values can be discarded or when optimizing memory usage), set the `out` option to `true` to indicate that an output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) has been provided as the __first__ [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) argument.

``` javascript
var out = Uint8Array( 5 );

arrayfun( add, out, arr, 5, {
	'out': 'true';
});
// returns Uint8Array( [6,7,8,9,10] )

// Works with generic arrays, as well...
out = [ 0, 0, 0, 0, 0 ];

arrayfun( add, out, arr, 5, {
	'out': 'true';
});
// returns [ 6, 7, 8, 9, 10 ]
```

===
### Factory

The main exported `function` does __not__ make any assumptions regarding the number of input [`typed arrays`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or `numbers`. To create a reusable [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) function where arguments `types` are known, a factory method is provided.


<a name=\
"arrayfun-factory"></a>
#### arrayfun.factory( [fcn,] types[, options] )

Creates an apply `function` to apply a `function` to each [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) element. The `types` argument defines the input argument types (either [`'array'`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or `'number'`).

``` javascript
var afun = arrayfun.factory( ['array', 'number'] );

function add( x, y ) {
	return x + y;
}

var arr = new Int16Array( 5 );

for ( var i = 0; i < 5; i++ ) {
	arr[ i ] = i + 5;
}
// arr = Int16Array( [5,6,7,8,9] )

var out = afun( add, arr, 5 );
// returns Float64Array( [10,11,12,13,14] )
```

An apply `function` may be provided during `function` creation.

``` javascript
var aadd = arrayfun.factory( add, ['array', 'number'] );

var out = aadd( arr, 5 );
// returns Float64Array( [10,11,12,13,14] )
```

The function accepts the following `options`:

*	__dtype__: output data type. Default: `float64`.

By default, the output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) data type is `float64`. To specify a different data type, set the `dtype` option.

``` javascript
var aadd = arrayfun.factory( add, ['array', 'number'], {
	'dtype': 'int32';
});

var out = aadd( arr, 5 );
// returns Int32Array( [10,11,12,13,14] )

// ...and for all subsequent calls...
out = aadd( arr, 5 );
// returns Int32Array( [10,11,12,13,14] )
```

__Note__: a factory `function` __always__ returns a new [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays).


===
### Create

To facilitate using [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) functions within an application where input arguments are of known types and where memory management occurs externally, a method to create minimal [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) functions is provided.

#### arrayfun.create( [fcn,] types )

Creates an apply `function` to apply a `function` to each [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) element. The `types` argument defines the input argument types (either [`'array'`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or `'number'`).

``` javascript
var afcn = arrayfun.create( ['number','array'] ),
	out = new Array( 5 );

out = afcn( add, out, 5, arr );
// returns [ 10, 11, 12, 13, 14 ]

function subtract( x, y ) {
	return x - y;
}

out = afcn( subtract, out, 5, arr );
// returns [ 0, -1, -2, -3, -4 ]
```

An apply `function` may be provided during `function` creation.

``` javascript
var aadd = arrayfun.create( add, ['array','number'] );

var out = aadd( out, arr, 5 );
// returns [ 10, 11, 12, 13, 14 ]
```



===
### Raw

Lower-level APIs are provided which forgo some of the guarantees of the above APIs, such as input argument validation. While use of the above APIs is encouraged in REPL environments, use of the lower-level interfaces may be warranted when arguments are of a known type or when performance is paramount.

#### arrayfun.raw( fcn, ...value[, options] )

Applies a `function` to each [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) element.

``` javascript
var arr = new Float32Array( 5 );

var out = arrayfun.raw( add, arr, 5 );
// returns Float64Array( [10,11,12,13,14] )
```

The function accepts the same `options` as the main exported [function](#arrayfun).


#### arrayfun.rawFactory( [fcn,] types[, options] )

Creates an apply `function` to apply a `function` to each [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) element.

``` javascript
var afun = arrayfun.rawFactory( ['number','array'] );

var out = afun( add, 5, arr );
// returns Float64Array( [10,11,12,13,14] )
```

The function accepts the same `options` as [`arrayfun.factory()`](#arrayfun-factory).



## Notes

*	Both factory methods, as well as the `.create()` method, use dynamic code evaluation. Beware when using these methods in the browser as they may violate your [content security policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) (CSP).



## Examples

``` javascript
var arrayfun = require( 'compute-typed-array-number-function' );

var arr1,
	arr2,
	out,
	i;

arr1 = new Float32Array( 25 );
for ( i = 0; i < arr1.length; i++ ) {
	arr1[ i ] = i;
}

arr2 = new Uint8Array( 25 );
for ( i = 0; i < arr2.length; i++ ) {
	arr2[ i ] = 5;
}

function add( x, y, z ) {
	return x + y + z;
}

out = arrayfun( add, arr1, 10, arr2 );
console.log( out );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-typed-array-number-function.svg
[npm-url]: https://npmjs.org/package/compute-typed-array-number-function

[travis-image]: http://img.shields.io/travis/compute-io/typed-array-number-function/master.svg
[travis-url]: https://travis-ci.org/compute-io/typed-array-number-function

[codecov-image]: https://img.shields.io/codecov/c/github/compute-io/typed-array-number-function/master.svg
[codecov-url]: https://codecov.io/github/compute-io/typed-array-number-function?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/typed-array-number-function.svg
[dependencies-url]: https://david-dm.org/compute-io/typed-array-number-function

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/typed-array-number-function.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/typed-array-number-function

[github-issues-image]: http://img.shields.io/github/issues/compute-io/typed-array-number-function.svg
[github-issues-url]: https://github.com/compute-io/typed-array-number-function/issues
