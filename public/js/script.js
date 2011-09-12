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
        
        
        base.getBus = function( routeID,callback )
        {
            $.getJSON("/bus/" + routeID, function( data ) {  
                callback( data );
            }); 
        }
        
        base.init = function(){
            base.options = $.extend({},$.bus.defaultOptions, options);
            base.$buses.each( function(){

                $(this).find('li a').bind( 'click', function(event){
                    var routeID = $(this).data('route');
                    
                    base.getBus( routeID, function( data ){
                        
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
                    
                    event.preventDefault();
                } );
                
                
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