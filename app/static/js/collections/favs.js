/**
 * Favs Collection
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'models/bus-stop',
        'tracking'
    ],
    function($, _, Backbone, Model, tracking) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            initialize: function() {
                console.log('init favs', this);
                _.bindAll(this, 'addCurrent');

            },
            addCurrent: function() {
                console.log(this, window.busStop);
            },
            fetch: function() {
                var data = localStorage.getItem('fav_bus_stops');
                console.log(data);
                this.reset(JSON.parse(data));
                this.trigger('update');
                // tracking.trackEvent('Map', 'Found Stops', results);
            },
            save: function() {
                var data = this.toJSON();
                this.trigger('save');
                localStorage.setItem('fav_bus_stops', data);
            }
        });
        return new Collection();
    }
);
