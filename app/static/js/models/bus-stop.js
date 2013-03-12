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

            createMarkerCanvas: function(indicator) {
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    radius = 10,
                    width = 21,
                    height = 25,
                    indicator = indicator || '';

                if(indicator.length > 1) {
                    width = 26;
                }

                canvas.width = width;
                canvas.height = height;

                context.clearRect(0, 0, width, height);
                context.fillStyle = "rgba(255, 0, 0, 1)";
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
                context.font = 'bold 11pt Helvetica';
                context.textBaseline  = 'top';
                //context.textAlign = 'center';

                var textWidth = context.measureText(indicator);

                // centre the text.
                context.fillText(indicator,
                    Math.floor((width / 2) - (textWidth.width / 2)),
                    4
                );

                console.log(canvas, context);

                return canvas.toDataURL();
            },

            letterOffset: function() {
                var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                try{
                    var number = letters.indexOf(this.get('indicator'));
                    if(number >= 0) {
                        return number * 26;
                    }else{
                        return 0;
                    }
                }catch(err){}
            },
            createMarker: function() {
                var self = this,
                    image = new google.maps.MarkerImage(
                        '/static/img/design/ico-stops.png',
                        new google.maps.Size(21, 26), // Size
                        new google.maps.Point(0, this.letterOffset()) // Origin
                    ),

                    gLatLng = new google.maps.LatLng(this.get('lat'), this.get('lng')),

                    marker = new google.maps.Marker({
                        position: gLatLng,
                        map: window.map,
                        title: this.get('name'),
                        id: this.get('id'),
                        letter: this.get('indicator'),
                        icon: this.createMarkerCanvas(this.get('indicator'))
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
