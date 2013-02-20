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
            template: _.template($('#stopRow').html()),

            initialize: function() {
                var self = this;
                // Cache window selector
                self.$window = $(window);
                this.$el = this.options.$el;
                // Arrivals
                this.collection = arrivalsCollection;
                _.bindAll(this, 'render');
                this.render();
                this.on('activate', function() {
                    console.log('Arrivals View', this.collection.busStopId);
                    this.collection.fetch();
                });
                this.collection.on('update', this.render);
            },

            render: function() {
                var self = this,
                $list = self.$('.arrivals-list');

                $list.html('');
                _(this.collection.models).each(function(model) {
                    var html = self.template({
                        time: model.getTill(),
                        number: model.get('number'),
                        destination: model.get('destination')
                    });
                    $list.append(html);
                });

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
