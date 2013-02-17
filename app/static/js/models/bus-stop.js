/**
 * Bus stop model
 */
define([
        'underscore',
        'backbone',
    ],
    function(_, Backbone) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                console.log('Init bustop model');
            }
        });
        return Model;
    }
);
