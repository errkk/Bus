/**
 * Fav Bus stop model
 */
define([
        'underscore',
        'backbone'
    ],
    function(_, Backbone) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var self = this;
                // Click from google map
                this.on('activate', function(){
                    window.location.hash = 'countdown/' + this.get('id');
                    window.busStop = this;
                });
                console.log(this.get('name'));
            }
        });

        return Model;
    }
);
