define([
        'jquery',
        'underscore',
        'backbone',
        'views/home-view',
    ],
    function($, _, Backbone, HomeView) {

        return {
            /**
             * Initialise the JS on the page.
             * This gets called when the DOM is ready
             */
            init: function() {
                // Kick of instance of homeview which instanciates child views
                var homeView = new HomeView({
                    $el: $('#view-home')
                });
            }
        };
    }
);
