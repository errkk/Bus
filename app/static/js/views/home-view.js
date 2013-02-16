/**
 * View: Home
 */
define([
        'jquery',
        'underscore',
        'backbone',
    ],
    function($, _, Backbone) {
        var View = Backbone.View.extend({
            childViews: [],
            coords: [51,-0.1],

            initialize: function() {
                var self = this;

                // Cache window selector
                self.$window = $(window);

                this.$el = this.options.$el;
                this.initMap();

            },

            initMap: function() {
                //Google maps defaults
                var myOptions = {
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true
                };
                // Create map object in map_canvas element
                this.map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
                google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){});
                this.centreMap();
            },

            centreMap: function() {
                var centre = new google.maps.LatLng(this.coords[0], this.coords[1]);
                if( this.map ){
                    this.map.setCenter(centre);
                }
            }

        });

        return View;
    }
);
