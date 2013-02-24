/**
 * Arrival Model
 */
define([
        'underscore',
        'backbone',
    ],
    function(_, Backbone) {
        var Model = Backbone.Model.extend({
            getTime: function() {
                return this.get('estimatedTime') ? new Date(this.get('estimatedTime')) : false;
            },
            getTill: function() {
                var now = new Date(),
                mins = parseInt((this.getTime() - now) / 1000 / 60, 10);
                return (mins > 0) ? mins + ' MINS' : 'DUE';
            }
        });
        return Model;
    }
);
