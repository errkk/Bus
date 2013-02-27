/**
 * View: Favs
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'collections/favs'
    ],
    function($, _, Backbone, collection) {
        var View = Backbone.View.extend({
            childViews: [],
            template: _.template($('#listRow').html()),

            initialize: function() {
                _.bindAll(this, 'render');
                this.collection = collection;
                this.$el = this.options.$el;
                this.collection.on('update', this.render);
            },

            render: function() {
                var self = this;
                $list = this.$('.tableview');
                $list.html('');
                _(this.collection.models).each(function(model) {
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
