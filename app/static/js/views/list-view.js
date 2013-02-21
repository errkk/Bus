/**
 * View: List
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'collections/bus-stops'
    ],
    function($, _, Backbone, busStopsCollection) {
        var View = Backbone.View.extend({
            childViews: [],
            template: _.template($('#listRow').html()),

            initialize: function() {
                _.bindAll(this, 'render');
                this.collection = busStopsCollection;
                this.$el = this.options.$el;
                this.collection.on('update', this.render);
            },

            render: function() {
                var self = this;
                $list = this.$('.tableview');
                console.log(this.collection);
                $list.html('');
                _(this.collection.models).each(function(model) {
                    console.log(model);
                    var html = self.template({
                        indicator: model.get('indicator', ''),
                        name: model.get('name'),
                        id: model.get('id'),
                        towards: model.get('towards')
                    });
                    $list.append(html);
                });

            }

        });

        return View;
    }
);
