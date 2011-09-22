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
        
        base.range = 0.003;
        
        
        base.getBuses = function( stopID, callback )
        {
            var url = "/bus/" + stopID;
            
            $.getJSON(url, function( data ) {  
                callback( data );
            }).error(function(){
                callback(false);
            }); 
        }
        
        base.getBusStops = function( lat,lng,callback )
        {
            var url = "/stops/" + lat + '/' + lng + '/' + base.range;
            
            $.getJSON( url, function( data ) {  
                
                callback( data );
            }).error(function(){
                callback(false);
            }); 
            
            
        }
        
        
        
        
        base.busStopClick = function( id ) {
                   
            $.mobile.changePage( $("#two") );

            $('#busstopname').html( base.markers[id].title );
            
            // save obj for saving in local storage
            base.currentStop = base.markers[id];

            base.$screen.html('<p>Loading</p>');
            // change this to click events for the routes
            base.getBuses( id, function( data ){

                var count = data.length,
                    items = [];

                if( data && count > 0 ){

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
                
                }else{
                    
                    $('#msg').find('.message').html('No buses found from here');
                        $.mobile.loadPage( $('#msg'), {transition:'pop'} );
                }
            



            } );
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
             
            base.mapdebug = true;
            
            base.pos = pos;
            
            if( base.mapdebug ){
                
                base.latbig = pos.coords.latitude + base.range;
                base.lngbig = pos.coords.longitude + ( base.range * 1.4 );
                base.latsm = pos.coords.latitude - base.range;
                base.lngsm = pos.coords.longitude - ( base.range * 1.4 );
            }

            //Google maps defaults
            var myOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            // Create map object in map_canvas element
            base.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            google.maps.event.addListenerOnce( base.map, 'tilesloaded', function(){} );
            
            base.centre_map();
            
            base.update_markers();
        }
        
        
        base.centre_map = function()
        {
            var centre = new google.maps.LatLng( base.pos.coords.latitude, base.pos.coords.longitude );
            if( base.map ){
            base.map.setCenter( centre );
            }else{
                base.retailer_map();
                base.map.setCenter( centre );
            }
        }
        
        base.update_markers = function()
        {
            base.getBusStops( base.pos.coords.latitude, base.pos.coords.longitude, function( data ){
                
                if( data && data.length > 0 ){
                    // store busstops in object so addMarkers can use them
                    base.busStops = data;

                    // Create markers and attach them to the map
                    base.addMarkers();

                    // Loading Classes
                    $( '#map_canvas' ).removeClass('loading');

                    var len = base.busStops.length,
                        $stopList = $('#stop_list');

                    $stopList.html('');

                    // Loop busstops and add them to the list
                    for (var i = 0; i < len; i++) {

                        var $li = $( '<li><a>' + base.busStops[i].name + ' <span class="letter">' + base.busStops[i].letter + '</span> <span class="direction ' + base.busStops[i].direction + '"><span class="ico-direction"> </span></span></a></li>' )
                            .data( 'id',base.busStops[i].id )
                            .data( 'role', 'list-divider' ).click( function(){
                                base.busStopClick( $(this).data('id') );
                            } );
                        $stopList.append( $li );
                    }
                    try{
                        $stopList.listview('refresh');
                    }catch(e){

                    }
                
                
                
                }else{
                    $('#msg').find('.message').html('Could not find any bus stops');
                    $.mobile.loadPage( $('#msg'), {
                        transition:'pop'
                    } );
                }
            });
        }

        

        /**
         * Loop through array of locations "mymarkers" returned by the store_locator class in the footer of the page
         *
         */
        base.addMarkers = function()
        {
            try{
                if( base.mapdebug ){
                    var paths = [
                    new google.maps.LatLng(base.latbig, base.lngbig),
                    new google.maps.LatLng(base.latbig, base.lngsm),
                    new google.maps.LatLng(base.latsm, base.lngsm),
                    new google.maps.LatLng(base.latsm, base.lngbig)
                    ];

                    var shape = new google.maps.Polygon({
                    paths: paths,
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#ff0000',
                    fillOpacity: 0.35
                    });

                    shape.setMap(base.map);
                }
            }catch(e){}
            
            // get busstops from webservice
            
            


            var createMaker = function( map, myLatLng, id, title, i, letter )
            {
                // Use letter to work out the offset for the icon sprite
                var letterSwitch = function( letter ){
                        var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                            
                        try{
                            var number = letters.indexOf( letter );
                            
                            if( number ){
                                return ( number * 26 );
                            }else{
                                return 0;
                            }
                        }catch(err){
                            
                        }
                    },

                    // Make a marker image object
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
                
                google.maps.event.addListener( marker, 'click', function(){
                    // Call this inside the clousure to access ID
                    base.busStopClick( id, title );
                    
                } );

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


        
        base.populatefavs = function()
        {
            if( !base.myBuses ){
                return false;
            }
            
            // Add saved items to list
            var len = base.myBuses.length,
            $stopList = $('#fav_stop_list');

            $stopList.html('');

            // Loop busstops and add them to the list
            for (var i = 0; i < len; i++) {

                var $li = $( '<li><a>' + base.myBuses[i].name + ' <span class="letter">' + base.myBuses[i].letter + '</span> <span class="direction ' + base.myBuses[i].direction + '"><span class="ico-direction"> </span></span></a></li>' )
                .data( 'id',base.myBuses[i].id )
                .data( 'role', 'list-divider' ).click( function(){
                    base.busStopClick( $(this).data('code') );
                } );
                $stopList.append( $li );
            }
            try{
                $stopList.listview('refresh');
            }catch(e){

            }
        }
        
        
        
        base.init = function(){
            
            // Find save stops
            var myBuses = JSON.parse( localStorage.getItem( 'mybuses' ) );
            
            if( myBuses ){
                // stuff is saved so load it in
                base.myBuses = myBuses;
            }
            
            
            
            
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
            
            
            
                $( '#relocate' ).live( 'vclick', function(event){
                    $(this).addClass('ui-btn-active loading');
                    
                    get_position();
                });
                
                $( '#update' ).live( 'vclick', function(event){
                    $(this).addClass('ui-btn-active loading');
                    
                    base.update_markers();
                });
                
                
                $( '#slider' ).live( 'change', function(event){
                    base.range = ( $(this).val() / 1000 );
                });
                
                $('#two, #list').live( 'swiperight', function(){
                    $.mobile.changePage('/',{reverse:true});
                } );
                
                $('#btnSave').live( 'vclick', function(event){
                    
                    if( typeof( base.myBuses ) == 'array' ){
                        base.myBuses.push( base.currentStop );
                    }else{
                        base.myBuses = [];
                        base.myBuses.push( base.currentStop );
                    }
                    
                    localStorage.setItem( 'mybuses', JSON.stringify(base.myBuses) );
                    
                    base.populatefavs();
                    
                    
                } );
                
                base.populatefavs();
  
            
            
            
        };
        
        base.init();
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

