'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var exists = require('fs-exists-sync');
var resolve = require('resolve');
var findDown = require('../');

describe('finddown-sync', function() {
    it('should throw an error when first argument is not a string or array', function(done) {
        try {
            findDown();
            done(new Error('error expected'));
        } catch (e) {
            assert.equal(e.message, 'finddown-sync uses a string or array as the first argument');
            done();
        }
    });

    it('should work without a cwd', function() {
        var actual = findDown('file.txt')[0];
        assert(actual);
        assert.equal(typeof actual, 'string');
        assert.equal(path.dirname(path.resolve(actual)), path.resolve(__dirname, 'fixtures'));
        assert.equal(path.basename(actual), 'file.txt');
    });

    it('should find files from absolute paths as cwd', function() {
        var expected = path.resolve(__dirname, 'fixtures/a/b/c/c.txt');
        var actual = findDown('fixtures/a/b/c/c.txt')[0];
        assert(actual);
        assert(exists(actual));
        assert.equal(expected, actual);
    });

    it('should find case sensitive files in child directory', function() {
        var expected = path.resolve(__dirname, 'fixtures/a/b/c/Configfile.txt')
        var actual = findDown('a/b/c/configfile.txt', {nocase: true})[0];
        assert(actual);
        assert(exists(actual));
        assert.equal(expected, actual);
    });

    it('should find files in a child directory relative to a cwd', function() {
        var expected = path.resolve(__dirname, 'fixtures/a/b/c/Configfile.txt')
        var actual = findDown('a/b/c/Configfile.txt', {cwd: 'test/fixtures'})[0];
        assert(actual);
        assert(exists(actual));
        assert.equal(expected, actual);
    });

    it('should find case sensitive files in a child directory relative to a cwd', function() {
        var expected = path.resolve(__dirname, 'fixtures/a/b/c/Configfile.txt')
        var actual = findDown('a/b/c/Configfile.txt', {cwd: 'test/fixtures', nocase: true})[0];
        assert(actual);
        assert(exists(actual));
        assert.equal(expected, actual);
    });

    it('should support normal (non-glob) file paths', function() {
        var cwd = path.dirname(resolve.sync('is-glob'));
        var opts = {cwd: cwd};
        var actual = findDown('package.json', opts)[0];
        assert.equal(path.dirname(path.resolve(actual)), path.resolve(cwd));
        assert.equal(path.basename(actual), 'package.json');
        opts.cwd = 'test/fixtures';
        assert.equal(findDown('a.{txt}', opts)[0], path.resolve('test/fixtures/a/a.txt'));
    });

    it('should support normal (non-glob) case sensitive file paths', function() {
        var actual = findDown('a/b/c/configfile.txt', {cwd: 'test/fixtures', nocase: true})[0];
        assert.equal(path.dirname(path.resolve(actual)), path.resolve('test/fixtures/a/b/c/'));
        assert.equal(path.basename(actual), 'Configfile.txt');
    });

    it('should support glob patterns', function() {
        var opts = {cwd: 'test/fixtures', nocase: true};
        assert.equal(findDown('**/package.json', opts)[0], path.resolve('test/fixtures/a/b/package.json'));
        assert.equal(findDown('**/f/module.js', opts)[0], path.resolve('test/fixtures/a/b/c/d/e/f/module.js'));
        assert.equal(findDown('/c/Configfile.txt', opts)[0], path.resolve('test/fixtures/a/b/c/Configfile.txt'));
        assert.equal(findDown('a.{txt}', opts)[0], path.resolve('test/fixtures/a/a.txt'));
        assert.equal(findDown('*.{txt}', opts)[0], path.resolve('test/fixtures/file.txt'));
    });

    it('should support case sensitive glob patterns', function() {
        var opts = {cwd: 'test/fixtures', nocase: true};
        assert.equal(findDown('**/package.json', opts)[0], path.resolve('test/fixtures/a/b/package.json'));
        assert.equal(findDown('**/f/module.js', opts)[0], path.resolve('test/fixtures/a/b/c/d/e/f/module.js'));

        opts.nocase = false;
        assert.equal(findDown('/c/Configfile.txt', opts)[0], path.resolve('test/fixtures/a/b/c/Configfile.txt'));
        assert.equal(findDown('a.{txt}', opts)[0], path.resolve('test/fixtures/a/a.txt'));
    });

    it('should support arrays of glob patterns', function() {
        var opts = {cwd: 'test/fixtures', nocase: true};
        assert.equal(findDown(['**/package.json'], opts)[0], path.resolve('test/fixtures/a/b/package.json'));
        assert.equal(findDown(['**/f/module.js'], opts)[0], path.resolve('test/fixtures/a/b/c/d/e/f/module.js'));
        assert.equal(findDown(['a.{txt}'], opts)[0], path.resolve('test/fixtures/a/a.txt'));
        assert.equal(findDown(['*.{txt}'], opts)[0], path.resolve('test/fixtures/file.txt'));
    });

    it('should support micromatch `matchBase` option', function() {
        var opts = {matchBase: true, cwd: 'test/fixtures'};
        assert.equal(findDown('package.json', opts)[0], path.resolve('test/fixtures/a/b/package.json'));
        assert.equal(findDown('module.js', opts)[0], path.resolve('test/fixtures/a/b/c/d/e/f/module.js'));
        assert.equal(findDown('a.txt', opts)[0], path.resolve('test/fixtures/a/a.txt'));
    });

    it('should return `null` when no files are found', function() {
        var opts = {cwd: path.dirname(resolve.sync('is-glob'))};
        Array.isArray(findDown('foo.json', opts));
        assert.deepEqual(findDown('foo.json', opts), []);

        opts.matchBase = true;
        assert.deepEqual(findDown('foo.json', opts), []);
        assert.deepEqual(findDown('**/foo*.js', opts), []);
    });

    it('should support micromatch `nocase` option', function() {
        var opts = {cwd: 'test/fixtures', nocase: true};
        assert.equal(findDown('ONE.*', opts)[0], path.resolve('test/fixtures/a/b/c/d/ONE.txt'));

        opts.nocase = false;
        assert.equal(findDown('ONE.*', opts)[0], path.resolve('test/fixtures/a/b/c/d/ONE.txt'));
    });
});