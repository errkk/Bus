define([
        'jquery',
        'underscore',
        'backbone',
        'views/home-view',
        'views/about-view',
        'views/arrival-view',
        'views/list-view',
        'collections/favs',
        'collections/bus-stops',
        'tracking'
    ],
    function($, _, Backbone, HomeView, AboutView, ArrivalView, ListView, favsCollection, busStopsCollection, tracking) {

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
                        $outEl.addClass('hidden');
                        $inEl.off('webkitAnimationEnd', reset, false);
                        $outEl.removeClass('sliding').removeClass(wise[0]);
                        $inEl.removeClass('sliding').removeClass(wise[1]);
                        $inHeader.removeClass('transparent');
                        $outHeader.removeClass('transparent');
                        if (fn){ fn.apply() };
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
                var currentView
                    homeView = new HomeView({
                        $el: $('#view-home')
                    }),
                    aboutView = new AboutView({
                        $el: $('#view-about')
                    }),
                    arrivalView = new ArrivalView({
                        $el: $('#view-countdown')
                    }),
                    listView = new ListView({
                        $el: $('#view-list')
                    }),
                    favsView = new ListView({
                        collection: favsCollection,
                        $el: $('#view-favs')
                    });
                body.insertAdjacentHTML('beforeend', isWideScreen ? '<div id="overlay" class="hide"></div>' : '<header class="fake"></header>');

                var Router = Backbone.Router.extend({
                    routes: {
                        '': 'main',
                        'about': 'about',
                        'countdown/:id': 'countdown',
                        'list': 'list',
                        'favs': 'favs'
                    },
                    initialize: function() {
                        currentView = homeView;
                    },
                    main: function() {
                        if(currentView !== homeView){
                            flip({
                                in: homeView.$el,
                                out: currentView.$el,
                                direction: 'anticlockwise',
                                fn: function() {
                                    currentView = homeView;
                                    currentView.trigger('activate');
                                    tracking.trackPageView('map');
                                }
                            });
                        }
                    },
                    about: function() {
                        flip({
                            in: aboutView.$el,
                            out: currentView.$el,
                            direction: 'clockwise',
                            fn: function() {
                                currentView = aboutView;
                                currentView.trigger('activate');
                                tracking.trackPageView('about');
                            }
                        });
                    },
                    countdown: function(id) {
                        var direction = 'clockwise';
                        if(currentView === listView){
                            direction = 'anticlockwise';
                        }
                        arrivalView.setId(id);
                        window.busStop = busStopsCollection.get(id);
                        flip({
                            in: arrivalView.$el,
                            out: currentView.$el,
                            direction: direction,
                            fn: function() {
                                currentView = arrivalView;
                                currentView.trigger('activate');
                                tracking.trackPageView('countdown/' + id);
                            }
                        });
                    },
                    list: function() {
                        flip({
                            in: listView.$el,
                            out: currentView.$el,
                            direction: 'clockwise',
                            fn: function() {
                                currentView = listView;
                                currentView.trigger('activate');
                                tracking.trackPageView('list');
                            }
                        });
                    },
                    favs: function() {
                        flip({
                            in: favsView.$el,
                            out: currentView.$el,
                            direction: 'clockwise',
                            fn: function() {
                                currentView = favsView;
                                currentView.trigger('activate');
                                tracking.trackPageView('favourites');
                            }
                        });
                    }
                });

                var router = new Router();
                Backbone.history.start({
                    pushState: false,
                    slient: true
                });

            }
        };
    }
);
