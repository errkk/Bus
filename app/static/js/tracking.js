/**
 * GA Functions
 */
define([],
    function() {

        return {
            trackPageView: function trackPageView(page) {
                window._gaq = window._gaq || [];
                window._gaq.push(['_trackPageview', page]);
            },
            trackEvent: function trackEvent(category, action, label, value) {
                window._gaq = window._gaq || [];
                window._gaq.push(['_trackEvent', category, action, label]);
            }
        }
    }
);
