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
                this.createMarker();
                this.on('activate', function(){
                    window.location.hash = 'countdown/' + this.get('id');
                });
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
