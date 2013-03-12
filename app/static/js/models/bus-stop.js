/**
 * Bus stop model
 */
define([
        'underscore',
        'backbone',
        'views/arrival-view'
    ],
    function(_, Backbone, arrivalsView) {
        var Model = Backbone.Model.extend({
            initialize: function() {
                var self = this;
                this.createMarker();
                // Click from google map
                this.on('activate', function(){
                    window.location.hash = 'countdown/' + this.get('id');
                });

            },

            createMarkerCanvas: function(indicator, width, height) {
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    radius = 20,
                    width = width * 2,
                    height = height * 2;

                canvas.width = width;
                canvas.height = height;

                context.clearRect(0, 0, width, height);
                context.fillStyle = "rgba(255, 0, 0, 1)";
                context.lineWidth = 2;
                context.strokeStyle = "rgba(180, 0, 0, 1)";

                context.beginPath();
                context.moveTo(radius, 0);
                context.lineTo(width - radius, 0);
                context.quadraticCurveTo(width, 0, width, radius);
                context.lineTo(width, height - radius);
                context.quadraticCurveTo(width, height, width - radius, height);
                context.lineTo(radius, height);
                context.quadraticCurveTo(0, height, 0, height - radius);
                context.lineTo(0, radius);
                context.quadraticCurveTo(0, 0, radius, 0);
                context.closePath();

                context.fill();
                context.stroke();

                context.fillStyle = "rgba(255, 255, 255, 1)";
                context.font = 'bold 22pt Helvetica';
                context.textBaseline  = 'top';

                var textWidth = context.measureText(indicator);

                // centre the text.
                context.fillText(indicator,
                    Math.floor((width / 2) - (textWidth.width / 2)),
                    4
                );

                return canvas.toDataURL();
            },

            createMarker: function() {
                var self = this,
                    indicator = this.get('indicator') || '',
                    width = (indicator.length > 1) ? 26 : 20,
                    height = 20,
                    image = new google.maps.MarkerImage(
                        this.createMarkerCanvas(indicator, width, height),
                        null, null, null,
                        new google.maps.Size(width, height)
                    ),

                    gLatLng = new google.maps.LatLng(this.get('lat'), this.get('lng')),

                    marker = new google.maps.Marker({
                        position: gLatLng,
                        map: window.map,
                        title: this.get('name'),
                        id: this.get('id'),
                        letter: indicator,
                        icon: image
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        // Call this inside the clousure to access ID
                        self.trigger('activate');
                    });

                return marker;
            }


        });
        return Model;
    }
);
