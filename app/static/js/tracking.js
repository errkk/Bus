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
        function handleCacheEvent(evt) {
            trackEvent('Cache', evt.type);
        }
        appCache.addEventListener('cached', handleCacheEvent, false);
        appCache.addEventListener('checking', handleCacheEvent, false);
        appCache.addEventListener('downloading', handleCacheEvent, false);
        appCache.addEventListener('error', handleCacheEvent, false);
        appCache.addEventListener('noupdate', handleCacheEvent, false);
        appCache.addEventListener('obsolete', handleCacheEvent, false);
        appCache.addEventListener('progress', handleCacheEvent, false);
        appCache.addEventListener('updateready', handleCacheEvent, false);

        return {
            trackPageView: trackPageView,
            trackEvent: trackEvent
        }
    }
);
