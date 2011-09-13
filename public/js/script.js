$(document).ready(function() {

    $('#one').bus();
  
});


(function($){
    $.bus = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$buses = $(el).find( '#buses' );
        base.$screen = $( '#screen' );
        
        base.$el.data("bus", base);
        
        
        base.markers = [];
        
        
        base.getBus = function( stopID, routeID, callback )
        {
            var url = "/bus/" + stopID + '/' + routeID;
                console.log( url );
            
            $.getJSON(url, function( data ) {  
                callback( data );
            }); 
        }
        
        base.getBusStops = function( lat,lng,callback )
        {
            var stopID = 1045,
                url = "/stops/" + lat + '/' + lng;
            
            $.getJSON( encodeURI(url), function( data ) {  
                callback( data );
            }); 
        }
        
        
        /**
         * Initialise retailers map
         *
         */
        base.retailer_map = function( pos )
        {
            // Only run if google api is loaded
            if( typeof(google) == "undefined" || typeof(google.maps.MapTypeId) == "undefined" )
                return false;

            // create a single info window object
            base.infoWindow = new google.maps.InfoWindow();

            //Google maps defaults
            var myOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            // Create map object in map_canvas element
            base.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


            var centre = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude );
            base.map.setCenter( centre );

            // add markers when the tiles are loaded
            
            base.getBusStops( pos.coords.latitude, pos.coords.longitude, function( data ){
                
                // store busstops in object so addMarkers can use them
                base.busStops = data;
                
                // Create markers and attach them to the map
                base.addMarkers();
                
                // Bind addMarkers method to tilesloaded event
//                google.maps.event.addListenerOnce( base.map, 'tilesloaded', base.addMarkers );
            });

        }
        
        

        /**
         * Loop through array of locations "mymarkers" returned by the store_locator class in the footer of the page
         *
         */
        base.addMarkers = function()
        {
            try{
                if( mapdebug ){
                    var paths = [
                    new google.maps.LatLng(latbig, lngbig),
                    new google.maps.LatLng(latbig, lngsm),
                    new google.maps.LatLng(latsm, lngsm),
                    new google.maps.LatLng(latsm, lngbig)
                    ];

                    var shape = new google.maps.Polygon({
                    paths: paths,
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#ff0000',
                    fillOpacity: 0.35
                    });

                    shape.setMap(map);
                }
            }catch(e){}
            
            // get busstops from webservice


            var createMaker = function( map, myLatLng, id, title, i, letter )
            {
                
                // Create marker object for the retailer
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: title,
                    id: id,
                    letter: letter
                });
                
                // Store marker objects in an array to manipulate them later
                base.markers[id] = marker;
                
                google.maps.event.addListener(marker, 'click', function() {
                    
                    
                    base.infoWindow.setContent( title );
                    base.infoWindow.open( base.map,this );
                    
                    
                    // change this to click events for the routes
                    base.getBus( id, 88, function( data ){
                        
                        var found = data.length;
                        
                        if( !found ){
                            alert( 'Bugger looks like a long wait for a fucking ' + routeID + '!!' );
                        }
                            
                        for( item in data ){
                            var el = document.createElement( 'p' );
                            el.id = item;
                            el.innerHTML = data[item].route + ' ' + data[item].wait;
                            base.$screen.append( $(el).hide().fadeIn() );
                        }
                        
                    } );
                });

            }// /createMarker ----------------------------------------------------------

            // Loop
            var len = base.busStops.length;
            
            for (var i = 0; i < len; i++) {
                stopLocation = base.busStops[i]; // curent item

                // create a latlong object for the marker
                var myLatLng = new google.maps.LatLng( stopLocation.lat, stopLocation.lng ),
                    letter = stopLocation.letter,
                    title = stopLocation.name + ' (' + letter + ')';

                // Create and register maker
                createMaker( base.map, myLatLng, stopLocation.id, title, i, letter );

            }// /loop

        }// /addMarkers ----------------------------------------------------------------


        
        
        
        base.init = function(){
            base.options = $.extend({},$.bus.defaultOptions, options);
            
            // Get location and run retailermap as callback
            navigator.geolocation.getCurrentPosition(
                base.retailer_map,
                errorGettingPosition,
                {
                    'enableHighAccuracy':true,
                    'timeout':10000,
                    'maximumAge':0
                });
            
        };
        
        base.init();
    };
    
    $.bus.defaultOptions = {
        busstop: "lala"
    };
    
    $.fn.bus = function(options){
        return this.each(function(){
            (new $.bus(this, options));
        });
    };
    
})(jQuery);




// Callback functions for geo lookup
// Error handler for geo lookup
function errorGettingPosition(err)
{
    if(err.code==1){
	alert("User denied geolocation.");
    }else if(err.code==2){
	alert("Position unavailable.");
    }else if(err.code==3){
	alert("Timeout expired.");
    }else{
	alert("ERROR:"+ err.message);
    }
}

