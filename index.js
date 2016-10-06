'use strict';
var fs = require('fs');
var path = require('path');
var resolveDir = require('resolve-dir');
var mm = require('micromatch');
var isDir = require('is-directory');
var exclude = require('exclude-match');

function tryReaddirSync(fp) {
    try {
        return fs.readdirSync(fp);
    } catch (err) {
    }
    return [];
}

function directify(cwd, arr, opts) {
    var pattern = opts.exclude || [];
    if (pattern.length > 0) {
        arr = exclude(arr, pattern, opts);
    }
    return arr.map(function (v) {
        return path.resolve(cwd, v);
    });
}

function contains(fp, pattern, opts) {
    if (opts.nocase) {
        fp = fp.toLowerCase();
        pattern = pattern.toLowerCase();
    }
    return mm.contains(fp, pattern);
}

function search(cwd, pattern, opts) {
    var dirs = [], fps = [], fp, i = -1;
    var isMatch = mm.matcher(pattern, opts);
    var files = tryReaddirSync(cwd);

    while (++i < files.length) {
        var name = files[i];
        fp = path.resolve(cwd, name);
        if (isMatch(name) || isMatch(fp) || contains(fp, pattern, opts)) {
            fps.push(fp);
        }
        if (isDir.sync(fp)) {
            dirs.push(name + '/');
        }
    }

    if (dirs.length) {
        dirs = directify(cwd, dirs, opts);
        dirs.forEach(function (dir) {
            fps = fps.concat(search(dir, pattern, opts));
        });
    }

    return fps ? fps : [];
}

function lookDown(pattern, opts) {
    opts = opts || {};
    var cwd = path.resolve(resolveDir(opts.cwd || ''));
    return search(cwd, pattern, opts);
}

module.exports = function (pattern, opts) {
    if (typeof pattern === 'string') {
        return lookDown(pattern, opts);
    }

    if (!Array.isArray(pattern)) {
        throw new TypeError('finddown-sync uses a string or array as the first argument');
    }

    var i = -1;

    while (++i < pattern.length) {
        var res = lookDown(pattern[i], opts);
        if (res) {
            return res;
        }
    }

    return null;
};
