/**
 * View: Countdown
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
                // Cache window selector
                self.$window = $(window);
                this.$el = this.options.$el;
                this.render();
            },

            render: function() {
                var self = this;
            }

        });

        return View;
    }
);
