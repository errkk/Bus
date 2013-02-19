/**
 * View: Arrivals
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'collections/arrivals'
    ],
    function($, _, Backbone, arrivalsCollection) {
        var View = Backbone.View.extend({
            childViews: [],

            initialize: function() {
                var self = this;
                // Cache window selector
                self.$window = $(window);
                this.$el = this.options.$el;
                // Arrivals
                this.collection = arrivalsCollection;
                this.render();
                this.on('activate', function() {
                    console.log('Arrivals View', this.collection.busStopId);
                    this.collection.fetch();
                });
            },

            render: function() {
                var self = this;
            },

            /**
             * From the router, set a new ID to get arrival data for
             */
            setId: function(id) {
                this.collection.busStopId = id;
            }

        });

        return View;
    }
);
