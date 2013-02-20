/**
 * Arrival Model
 */
define([
        'underscore',
        'backbone',
    ],
    function(_, Backbone) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                            console.log('Arrival init');
            },
        });
        return Model;
    }
);
