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
        
        base.doscrollything = true;
        
        
        base.getBuses = function( stopID, callback )
        {
            var url = "/bus/" + stopID;
            
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
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            // Create map object in map_canvas element
            base.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


            var centre = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude );
            base.map.setCenter( centre );

            // add markers when the tiles are loaded
            
            google.maps.event.addListenerOnce( base.map, 'tilesloaded', function(){
                
                
                
                base.getBusStops( pos.coords.latitude, pos.coords.longitude, function( data ){
                    $( '#map_canvas' ).removeClass('loading');
                    $('#relocate').removeClass('ui-btn-active loading');
                    // store busstops in object so addMarkers can use them
                    base.busStops = data;

                    // Create markers and attach them to the map
                    base.addMarkers();

                    // Bind addMarkers method to tilesloaded event
                });
                
            } );
            

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
                var letterSwitch = function( letter ){
                        var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                            
                        try{
                            var number = letters.indexOf( letter );
                            
                            if( number ){
                                return ( number * 26 );
                            }else{
                                return 0;
                            }
                        }catch(err){ console.log(err); }
                    },


                    image = new google.maps.MarkerImage(
                        '/static/img/design/ico-stops.png',
                        new google.maps.Size( 21,26 ), // Size
                        new google.maps.Point( 0, letterSwitch( letter ) ) // Origin
                    ),

                    // Create marker object for the retailer
                    marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: title,
                        id: id,
                        letter: letter,
                        icon: image
                    });
                
                // Store marker objects in an array to manipulate them later
                base.markers[id] = marker;
                
                google.maps.event.addListener(marker, 'click', function() {
                    
                    $.mobile.changePage($("#two"));
                    
                    $('#busstopname').html( title );
                    
//                    base.infoWindow.setContent( title );
//                    base.infoWindow.open( base.map,this );
                    
                    
                    base.$screen.html('<p>Loading</p>');
                    // change this to click events for the routes
                    base.getBuses( id, function( data ){

                        var count = data.length,
                            items = [];
                            
                        base.$screen.html('');
                       
                        for( i = 0; i <= count; i++ ){
                            
                            var el = document.createElement( 'p' ),
                                val = data[i];
                            if( val ){
                                el.innerHTML = '<span class="route">' + ( i + 1 ) + ' ' + val.route + '</span>  <span class="destination">' + val.destination + '</span> <span class="countdown">' + val.wait + '</span>';
                            
                                base.$screen.append( $(el) );
                            
                                items[i] = $(el);
                            }
                            
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
            
            var get_position = function(){
                // TODO: show a loading gif
                $( '#map_canvas' ).addClass('loading');
                // 
                // Get location and run retailermap as callback
                navigator.geolocation.getCurrentPosition(
                    base.retailer_map, // call back function
                    errorGettingPosition,
                    {
                        'enableHighAccuracy':true,
                        'timeout':10000,
                        'maximumAge':0
                    });
            }
            
//            get_position();
            
  
                $( '#relocate' ).live( 'vclick', function(event){
                    $(this).addClass('ui-btn-active loading');
                    get_position();
                });
                
                $('#two').live( 'swiperight', function(){
                    $.mobile.changePage('/',{reverse:true});
                } );
  
            
            
            
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

