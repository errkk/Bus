/**
 * View: List item (Table Row)
 */
define([
        'jquery',
        'underscore',
        'backbone',
    ],
    function($, _, Backbone) {
        var View = Backbone.View.extend({
            template: _.template($('#listRow').html()),

            events: {
                'click .detail-disclosure-button': 'click'
            },

            initialize: function() {
                _.bindAll(this, 'click');
                this.model = this.options.model;
            },

            click: function(evt) {
                evt.preventDefault();
                this.model.collection.remove(this.model);
            },

            render: function() {
                this.$el.html(this.template({
                    indicator: this.model.get('indicator', ''),
                    name: this.model.get('name'),
                    id: this.model.get('id'),
                    towards: this.model.get('towards')
                }));
                return this;
            }
        });

        return View;
    }
);

