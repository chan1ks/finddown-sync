# finddown-sync [![npm version](https://badge.fury.io/js/finddown-sync.svg)](https://badge.fury.io/js/finddown-sync) [![Build Status](https://travis-ci.org/chan1ks/finddown-sync.svg?branch=master)](https://travis-ci.org/chan1ks/finddown-sync)

> Find all files matching a given pattern in the current directory or child directories. The sibling and opposite function to [findup-sync].

Matching is done with [micromatch], please report any matching related issues on that repository.

## Install with [npm](npmjs.org)

```bash
$ npm install --save finddown-sync
```

## Usage

```js
var findDown = require('finddown-sync');
findDown(patternOrPatterns [, micromatchOptions]);

// Start looking in the CWD.
var filepath1 = findDown('{a,b}*.txt');

// Start looking somewhere else, and ignore case.
var filepath2 = findDown('{a,b}*.txt', {cwd: '/some/path', nocase: true});

// Start looking somewhere else, and ignore specific files or directories.
var filepath3 = findDown('{a,b}*.txt', {cwd: '/some/path', exclude: ['directory/', 'some.file']});
```

* `patterns` **{String|Array}**: Glob pattern(s) or file path(s) to match against.
* `options` **{Object}**: Options to pass to [micromatch] and [exclude-match]. Note that if you want to start in a different directory than the current working directory, specify a `cwd` property here. Files and Directories can be excluded by specifying an `exclude` property.
* `returns` **{Array}**: Returns a list of matching files.

## Running tests

Install dev dependencies:

```bash
$ npm install -d && npm test
```

## Contributing

Take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

For bugs or feature requests, [please create an issue](https://github.com/chan1ks/finddown-sync/issues).

## Release History

2016-10-06 - v1.0.2 - Modified CI build config.  
2016-10-06 - v1.0.1 - Updated README build status.  
2016-10-06 - v1.0.0 - Updated README. Refactored for [exclusion-match].  
2016-10-01 - v0.2.0 - Updated dependencies. Deprecated exclude function and moved it into a separate dependency.  
2016-09-20 - v0.1.0 - Initial release.  

## Author

**"Captain" Morgan Worrell**
 
+ [github/chan1ks](https://github.com/chan1ks)
+ [twitter/chan1ks](http://twitter.com/chan1ks)

## License

Copyright © 2016, ["Captain" Morgan Worrell](https://github.com/chan1ks).  
Released under the [MIT license](https://github.com/chan1ks/finddown-sync/blob/master/LICENSE).  

[micromatch]: http://github.com/jonschlinkert/micromatch
[findup-sync]: https://www.npmjs.com/package/findup-sync
[exclude-match]: https://www.npmjs.com/package/exclude-match