/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

module.exports = function (bundleName, templateName, moduleName, precompiled, partials, prefix) {

    // base dependency
    var dependencies = ["template-base", "handlebars-base"];

    // each partial should be provisioned thru another yui module
    // and the name of the partial should translate into a yui module
    // to become a dependency
    partials = partials || [];
    // transform paths to custom naming convention
    partials = partials.map(function (name) {
        return name.replace(/\//g, '-');
    });
    partials.forEach(function (name) {
        // adding prefix to each partial
        dependencies.push((prefix || bundleName + '-tmpl-') + name);
    });

    return [
        'YUI.add("' + moduleName + '",function(Y, NAME) {',
        '   var fn = Y.Template.Handlebars.revive(' + precompiled + '),',
        '       partials = {};',
        '',
        '   Y.Array.each(' + JSON.stringify(partials) + ', function (name) {',
        '       var fn = Y.Template.get("' + bundleName + '/" + name);',
        '       if (fn) {',
        '           partials[name] = fn;',
        '       }',
        '   });',
        '',
        '   Y.Template.register("' + bundleName + '/' + templateName + '", function (data, options) {',
        '       options = options || {};',
        '       options.partials = options.partials ? Y.merge(partials, options.partials) : partials;',
        '       return fn(data, options);',
        '   });',
        '}, "", {requires: ' + JSON.stringify(dependencies) + '});'
    ].join('\n');

};
