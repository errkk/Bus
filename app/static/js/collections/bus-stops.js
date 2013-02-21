/**
 * Bus stops Collection
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'models/bus-stop',
        'tracking'
    ],
    function($, _, Backbone, Model, tracking) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            lat: 51.5,
            lng: -0.1,
            responses: {
                417: 'No bus stops found in this range',
                400: 'Bad Request'
            },
            url: function() {
                var lat = this.lat || 51.5,
                    lng = this.lng || -0.1;
                return '/api/?Circle=' + lat + ',' + lng + ',250&StopPointState=0&ReturnList=StopID,StopPointName,StopPointIndicator,Towards,Latitude,Longitude';
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
                    timestamp = response_data[3],
                    models = _(lines).map(function(i) {
                        var line = JSON.parse(i);
                        return new self.model({
                            name: line[1],
                            id: line[2],
                            towards: line[3],
                            indicator: line[4],
                            lat: line[5],
                            lng: line[6]
                        });
                    });
                this.reset(models);
                this.trigger('update');

                tracking.trackEvent('Map', 'Find Stops', '');
            },
            error: function(err) {
                console.log('error CB', arguments);
                tracking.trackEvent('Error', 'Cant busstops', '');
            }
        });
        return new Collection();
    }
);
