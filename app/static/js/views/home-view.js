/**
 * View: Home
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'collections/bus-stops',
        'tracking'
    ],
    function($, _, Backbone, busStops, tracking) {
        var View = Backbone.View.extend({
            childViews: [],
            collection: busStops,
            coords: {'latutude': 51.3, 'longitude': -0.091},
            errors: {},

            initialize: function() {
                var self = this;
                // Cache window selector
                self.$window = $(window);
                this.$el = this.options.$el;

                // Re-Centre map
                this.$('.btn-refresh').on('click', function(evt) {
                    evt.preventDefault();
                    self.centreMap();
                    tracking.trackEvent('Map', 'Centre Button', '');
                });

                setTimeout(function(){
                    self.initMap();
                }, 200);

                this.collection.on('update', function() {
                    //console.log('collection update', self.collection.items);
                });
            },

            /**
             * Instanciate a GMaps object, save it on the window for other
             * stuff to access.
             */
            initMap: function() {
                //Google maps defaults
                var self = this,
                    element = document.getElementById("mapCanvas"),
                    myOptions = {
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true
                    };
                self.$('#mapCanvas').addClass('loading')

                // Create map object in map_canvas element
                window.map = new google.maps.Map(element, myOptions);

                // Run a callback when the tiles are loaded
                google.maps.event.addListenerOnce(window.map, 'tilesloaded', function(){
                    console.log('Tiles Loaded');
                    self.$('#mapCanvas').removeClass('loading');
                });

                // Find busstops when the map is doubleclicked
                google.maps.event.addListener(window.map, 'dblclick', function(evt){
                    self.findBusStops(evt.latLng.lat(), evt.latLng.lng());
                });

                // Get location from device, and centre map
                self.getLocation(function(coords){
                    self.coords = coords;
                    self.centreMap();
                    self.findBusStops(coords.latitude, coords.longitude);
                });
            },

            /**
             * Centre the map on the current location
             */
            centreMap: function() {
                var centre = new google.maps.LatLng(this.coords.latitude, this.coords.longitude);
                if( window.map ){
                    window.map.panTo(centre);
                }
            },

            /**
             * Try to find the location of the device
             * from the HTML5 api
             */
            getLocation: function(callback) {
                navigator.geolocation.getCurrentPosition(
                    // Callback
                    function(pos) {
                        callback(pos.coords);
                    },
                    // Errback
                    function() {
                        if(err.code==1){
                            alert("User denied geolocation.");
                        }else if(err.code==2){
                            alert("Position unavailable.");
                        }else if(err.code==3){
                            alert("Timeout expired.");
                        }else{
                            alert("ERROR:"+ err.message);
                        }
                    },
                    {
                        'enableHighAccuracy': true,
                        'timeout': 10000,
                        'maximumAge': 0
                    });
            },

            /**
             * Find busstops near the current location
             */
            findBusStops: function(lat, lng) {
                this.collection.lat = lat;
                this.collection.lng = lng;
                this.collection.fetch();
            }

        });

        return View;
    }
);
