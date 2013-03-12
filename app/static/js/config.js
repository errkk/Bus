require.config({
    baseUrl: '/static/js',
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    paths: {
        text: 'lib/require/text',
        domReady: 'lib/require/domready',
        localstorage: 'lib/backbone.localStorage',

        jquery: 'lib/jquery.1.9.0',
        underscore: 'lib/underscore.amd',
        backbone: 'lib/backbone.amd'
    }
});

require([
        'domReady',
        'app'
    ],

    function(domReady, app){
        domReady(app.init);
    }
);
