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
            has_tilesloaded: false,
            tile_interval_count: 0,

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
                    element = this.$("#mapCanvas")[0],
                    myOptions = {
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true
                    };
                self.$('#mapCanvas').addClass('loading');

                // Time how long the tiles take to load.
                // If its more than 15000ms then google maps probs hasn't loaded :(
                this.tile_check_interval = setInterval(function() {
                    self.tile_interval_count = self.tile_interval_count + 100;
                    if(self.has_tilesloaded){
                        tracking.trackEvent('Map', 'Tiles Loaded', self.tile_interval_count + 'ms');
                        clearInterval(self.tile_check_interval);
                        return;
                    }
                    if(self.tile_interval_count > 15000) {
                        tracking.trackEvent('Map', 'Tiles not loaded in time');
                        window.location.reload(true);
                    }
                }, 100);

                // Create map object in map_canvas element
                window.map = new google.maps.Map(element, myOptions);

                // Run a callback when the tiles are loaded
                google.maps.event.addListenerOnce(window.map, 'tilesloaded', function(){
                    self.has_tilesloaded = true;
                    self.$('#mapCanvas').removeClass('loading');
                });

                // Find busstops when the map is doubleclicked
                google.maps.event.addListener(window.map, 'dblclick', function(evt){
                    self.findBusStops(evt.latLng.lat(), evt.latLng.lng());
                });

                // Get location from device, and centre map
                self.getLocation(function(coords){
                    self.coords = coords;
                    self.findBusStops(coords.latitude, coords.longitude);
                    self.centreMap();
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
