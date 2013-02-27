/**
 * View: Favs List
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'views/base-list',
        'collections/favs'
    ],
    function($, _, Backbone, BaseList, collection) {
        var View = BaseList.extend({
            collection: collection
        });
        return View;
    }
);
