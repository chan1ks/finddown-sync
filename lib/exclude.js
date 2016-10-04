'use strict';

var mm = require('micromatch');
var _ = require('lodash');

module.exports = function (arr, opts) {
    if (!Array.isArray(arr)) {
        throw new TypeError('exclude uses an array as the first argument');
    }

    var patterns = opts.exclude;

    if (!Array.isArray(patterns) && typeof patterns !== 'string') {
        throw new TypeError('exclude uses an array as the options argument');
    }

    if (!Array.isArray(patterns)) {
        patterns = [patterns];
    }

    var exclude = mm(arr, patterns, opts);
    var res = _.difference(arr, exclude);

    return res ? res : arr;
};