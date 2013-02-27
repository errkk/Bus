/**
 * Fav BusStop collections
 */
define([
        'underscore',
        'backbone',
        'models/fav'
    ],
    function(_, Backbone, Model) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            initialize: function() {
            },

            /**
             * Add the current busstop object to the collection
             */
            addCurrent: function() {
                this.add(window.busStop);
                this.trigger('update');
            }
        });
        return new Collection();
    }
);
