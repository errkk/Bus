/**
 * View: Arrivals
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'collections/arrivals',
        'collections/bus-stops'
    ],
    function($, _, Backbone, arrivalsCollection, busStopsCollection) {
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
                this.on('activate', function() {
                    console.log('Arrivals View', this.collection.busStopId);
                    this.collection.fetch();
                });
                this.collection.on('update', this.render);


                this.$('.btn-fav').on('click', function() {
                    console.log(this.busStop);
                });
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
                self.busStop = busStopsCollection.get(id);
                busStopsCollection.on('update', function() {
                    self.busStop = busStopsCollection.get(id);
                    if(self.busStop) {
                        self.$('h1').text(self.busStop.get('name'));
                    }
                });
            }

        });

        return View;
    }
);
