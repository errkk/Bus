/**
 * View: Home
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'collections/bus-stops'
    ],
    function($, _, Backbone, busStops) {
        var View = Backbone.View.extend({
            childViews: [],
            collection: busStops,
            coords: [51, -0.1],
            errors: {},
            map: null,

            initialize: function() {
                var self = this;
                // Cache window selector
                self.$window = $(window);
                this.$el = this.options.$el;
                this.$('.btn-refresh').on('click', function(evt) {
                    evt.preventDefault();
                    self.centreMap();
                });

                this.render();
                setTimeout(function(){
                    self.initMap();
                }, 200);
            },

            render: function() {
                var self = this;
            },

            initMap: function() {
                //Google maps defaults
                var self = this,
                    myOptions = {
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true
                    };
                // Create map object in map_canvas element
                this.map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
                google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){
                    console.log('Tiles Loaded');
                });
                google.maps.event.addListener(self.map, 'dblclick', function(evt){
                    self.findBusStops(evt.latLng.Ya, evt.latLng.Za);
                });
                self.getLocation(function(coords){
                    self.coords = coords;
                    self.centreMap();
                    self.findBusStops();
                });

            },

            centreMap: function() {
                var centre = new google.maps.LatLng(this.coords.latitude, this.coords.longitude);
                if( this.map ){
                    this.map.setCenter(centre);
                }
            },

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

            findBusStops: function(lat, lng) {
                var self = this;
                this.collection.lat = lat;
                this.collection.lng = lng;

                this.collection.fetch();
            },

            plotMarkers: function() {
                console.log(this.collection.items);
            }

        });

        return View;
    }
);
