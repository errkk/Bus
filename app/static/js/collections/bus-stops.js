/**
 * Bus stops Collection
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'models/bus-stop'
    ],
    function($, _, Backbone, Model) {
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
                return '/api/?Circle=' + lat + ',' + lng + ',250&StopPointState=0&ReturnList=StopCode1,StopPointName,Bearing,StopPointIndicator,Latitude,Longitude';
            },
            initialize: function() {
                _.bindAll(this, 'success');
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
            initialize: function() {
                console.log('Init bustop collection');
            },
            success: function(data) {
                var self = this,
                    lines = data.split(/\r\n/);
                _(lines).each(function(i) {
                    var line = i.split(',');
                    self.add({
                        name: line[1],
                        bearing: line[2],
                        indicator: line[3],
                        lat: line[4],
                        lng: line[5]
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
