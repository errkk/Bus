/**
 * Fav BusStop collections
 */
define([
        'underscore',
        'backbone',
        'models/fav',
        'localstorage'
    ],
    function(_, Backbone, Model) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            localStorage: new Backbone.LocalStorage('fav_bus_stops'),
            initialize: function() {
                this.reset(this.localStorage.findAll());
            },

            /**
             * Remove the passed model from the collection and
             * from local storage
             */
            remove: function(model) {
                Backbone.Collection.prototype.remove.call(this, model);
                this.localStorage.destroy(model);
                this.trigger('update');
                return this;
            },

            /**
             * Add the current busstop object to the collection
             */
            addCurrent: function() {
                //var model = new Model(window.busStop.toJSON());
                var model = window.busStop.clone();
                this.add(model);
                model.save();
                this.trigger('update');
            }
        });
      return new Collection();
    }
);
