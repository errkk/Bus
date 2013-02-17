define([
        'jquery',
        'underscore',
        'backbone',
        'views/home-view',
        'views/about-view',
    ],
    function($, _, Backbone, homeView, aboutView) {

        var body = document.body,
            flipWise = {
                clockwise: ['flip-out-to-left', 'flip-in-from-left'],
                anticlockwise: ['flip-out-to-right', 'flip-in-from-right']
            },

            flip = function(opts){
                var $inEl = opts.in,
                    $outEl = opts.out,
                    direction = opts.direction,
                    fn = opts.fn,
                    wise = flipWise[direction],
                    reset = function() {
                        console.log('restting');
                        $inEl.off('webkitAnimationEnd', reset);
                        $(document.body).removeClass('viewport-flip');
                        $outEl.addClass('hidden');
                        $inEl.removeClass('flip').removeClass(wise[1]);
                        $outEl.removeClass('flip').removeClass(wise[0]);
                        if (fn){ fn.apply(); }
                    };

                $(document.body).addClass('viewport-flip');
                $outEl.addClass('flip').addClass(wise[0]);
                $inEl.removeClass('hidden').addClass('flip').addClass(wise[1]);
                $inEl.on('webkitAnimationEnd', reset);

            },
            slideWise = {
                rtl: ['slide-out-to-left', 'slide-in-from-right'],
                ltr: ['slide-out-to-right', 'slide-in-from-left']
            },
            slide = function(opts){
                var $inEl = opts.in,
                    $outEl = opts.out,
                    //inClass = inEl.classList,
                    //outClass = outEl.classList,
                    $inHeader = $inEl.find('header'),
                    $outHeader = $outEl.find('header'),
                    //inHeaderClass = inHeader.classList,
                    //outHeaderClass = outHeader.classList,
                    direction = opts.direction,
                    fn = opts.fn,
                    wise = slideWise[direction],
                    reset = function(){
                        console.log('resetting', $inHeader);
                        $outEl.add('hidden');
                        $inEl.off('webkitAnimationEnd', reset, false);
                        $outEl.removeClass('sliding').removeClass(wise[0]);
                        $inEl.removeClass('sliding').removeClass(wise[1]);
                        $inHeader.removeClass('transparent');
                        $outHeader.removeClass('transparent');
                        if (fn) fn.apply();
                    };
                $inEl.removeClass('hidden').addClass('sliding').addClass(wise[1]);
                $outEl.addClass('sliding').addClass(wise[0]);
                $inEl.on('webkitAnimationEnd', reset, false);
                $inHeader.addClass('transparent');
                $outHeader.addClass('transparent');
            },
            getScreenState = function(){
                return window.innerWidth >= 640 ? 'wide' : 'narrow';
            };

            var isWideScreen = getScreenState() == 'wide';
            window.addEventListener('resize', function(){
                var wide = getScreenState() == 'wide';
                if (wide != isWideScreen){
                    isWideScreen = wide;
                    location.reload();
                }
            });

        return {
            /**
             * Initialise the JS on the page.
             * This gets called when the DOM is ready
             */
            init: function() {
                var currentView;
                body.insertAdjacentHTML('beforeend', isWideScreen ? '<div id="overlay" class="hide"></div>' : '<header class="fake"></header>');

                var Router = Backbone.Router.extend({
                    routes: {
                        '': 'main',
                        'about': 'about'
                    },
                    initialize: function() {
                        currentView = homeView;
                    },
                    main: function() {
                        console.log('main');
                        flip({
                            in: homeView.$el,
                            out: currentView.$el,
                            direction: 'clockwise',
                            fn: function() {
                                currentView = homeView;
                            }
                        });
                    },
                    about: function() {
                        console.log('about');
                        flip({
                            in: aboutView.$el,
                            out: currentView.$el,
                            direction: 'clockwise',
                            fn: function() {
                                currentView = aboutView;
                            }
                        });
                    }
                });

                var router = new Router();
                Backbone.history.start({
                    pushState: true,
                    slient: true
                });

            }
        };
    }
);
