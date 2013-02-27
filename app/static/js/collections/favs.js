/**
 * Fav BusStop collections
 */
define([
        'underscore',
        'backbone',
        'lib/backbone-local-storage',
        'models/fav'
    ],
    function(_, Backbone, Model) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            localStorage: new Backbone.LocalStorage('fav_bus_stops'),

            /**
             * Add the current busstop object to the collection
             */
            addCurrent: function() {
                //var model = new Model(window.busStop.toJSON());
                var model = window.busStop.clone();
                this.add(model);
                model.save();
                console.log(model);
                this.trigger('update');
            }
        });
      return new Collection();
    }
);
