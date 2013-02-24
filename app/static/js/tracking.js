/**
 * GA Functions
 */
define([],
    function() {
        var appCache = window.applicationCache;
        function trackEvent(category, action, label, value) {
            window._gaq = window._gaq || [];
            window._gaq.push(['_trackEvent', category, action, label]);
        }
        function trackPageView(page) {
            window._gaq = window._gaq || [];
            window._gaq.push(['_trackPageview', page]);
        }
        function versionCustomVar() {
            window._gaq = window._gaq || [];
            if(window.version) {
                window._gaq.push(['_setCustomVar', 1, 'Version', window.version, 2 ]);
            }else{
                window._gaq.push(['_setCustomVar', 1, 'Version', 'Unknown', 2 ]);
            }
        }
        function handleCacheEvent(evt) {
            trackEvent('Cache', evt.type);
        }
        appCache.addEventListener('cached', handleCacheEvent, false);
        appCache.addEventListener('checking', handleCacheEvent, false);
        appCache.addEventListener('downloading', handleCacheEvent, false);
        appCache.addEventListener('error', handleCacheEvent, false);
        appCache.addEventListener('noupdate', handleCacheEvent, false);
        appCache.addEventListener('obsolete', handleCacheEvent, false);
        //appCache.addEventListener('progress', handleCacheEvent, false);
        appCache.addEventListener('updateready', handleCacheEvent, false);

        versionCustomVar();

        return {
            trackPageView: trackPageView,
            trackEvent: trackEvent
        }
    }
);
