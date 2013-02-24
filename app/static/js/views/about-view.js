/**
 * View: About
 */
define([
        'jquery',
        'underscore',
        'backbone',
    ],
    function($, _, Backbone) {
        var View = Backbone.View.extend({
            childViews: [],

            initialize: function() {
                var self = this;
                this.$el = this.options.$el;
                this.render();
            },

            render: function() {
                if(window.version) {
                    this.$('.version').text('v' + window.version);
                }
            }

        });

        return View;
    }
);
