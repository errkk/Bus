/**
 * View: Base List
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'views/row-view'
    ],
    function($, _, Backbone, RowView) {
        var View = Backbone.View.extend({
            childViews: [],

            initialize: function() {
                _.bindAll(this, 'render');
                this.$el = this.options.$el;
                this.collection.on('update', this.render);
            },

            render: function() {
                var self = this;
                $list = this.$('.tableview');
                $list.html('');
                _(this.collection.models).each(function(model) {
                    var itemView = new RowView({model: model});
                    $list.append(itemView.render().el);
                    self.childViews.push(itemView);
                });
            }
        });
        return View;
    }
);
