/**
 * Arrivals collection for a busstop
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'models/arrival'
    ],
    function($, _, Backbone, Model) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            responses: {
                417: 'No bus stops found in this range',
                400: 'Bad Request'
            },
            url: function() {
                if(!this.busStopId) {
                    console.error('No Bus stop ID');
                }
                var url = '/api/?StopID=' + this.busStopId + '&ReturnList=RegistrationNumber,LineName,DestinationText,EstimatedTime';
                return url;
            },
            fetch: function() {
                var self = this;
                $.ajax({
                    type: 'GET',
                    url: this.url(),
                    dataType: 'html'
                })
                .success(function(data){ self.success.call(self, data) })
                .error(function(data){ self.error.call(self, data) });
            },
            success: function(data) {
                var self = this,
                    lines = data.split(/\r\n/),
                    response_data = JSON.parse(lines.shift()),
                    results = response_data[0],
                    version = response_data[1],
                    timestamp = response_data[3];

                if(results){
                    self.trigger('update');
                    console.log('Collection fetched ', results);
                }

                _(lines).each(function(i) {
                    var line = JSON.parse(i);
                    self.add({
                        'number': line[1],
                        'destination': line[2],
                        'registration': line[3],
                        'estimatedTime': line[4],
                    });
                });
            },
            error: function(err) {
                console.log('error CB', arguments);
            }
        });
        return new Collection();
    }
);
