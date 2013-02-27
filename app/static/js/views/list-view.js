/**
 * View: Nearby stops list List
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'views/base-list',
        'collections/bus-stops'
    ],
    function($, _, Backbone, BaseList, collection) {
        var View = BaseList.extend({
            collection: collection
        });
        return View;
    }
);
