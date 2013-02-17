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
            coords: [51, -0.1],

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
                this.initMap();
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
                google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){});
                this.getLocation(function(coords){
                    self.coords = coords;
                    self.centreMap();
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
                        'enableHighAccuracy':true,
                        'timeout':10000,
                        'maximumAge':0
                    });
            },

        });

        return new View({
            $el: $('#home-view')
        });
    }
);
