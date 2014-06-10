// ==UserScript==
// @id	redmine-issue-highlighter@sts
// @name Redmine Issue Text Highlighter
// @namespace http://stesie.github.io/
// @description Redmine Extension
// @match http://demo.redmine.org/*
// @version 0.3
// ==/UserScript==

function wrapper() {
    if(typeof redmineExtender === "undefined") {
        redmineExtender = { extensions: { } };
    }

    // PLUGIN START
    redmineExtender.extensions.issueHighlighter = {
        init: function() {
            $('.journal.has-notes').each(function(i, element) {
                var userLink = $(element).find('a[href^=\'/users\']').attr('href');
                var userID = userLink.split('/')[2];
                var blackList = [49];
                if(blackList.indexOf(+userID) == -1)
                {
                    $(element).find('.wiki').not(':contains("Livegang im Rahmen von Version")').addClass('issue');
                }
            });
        }
    };
    // PLUGIN END

    if(redmineExtender.initialized) {
        redmineExtender.extensions.issueHighlighter.init(jQuery);
    }
} // wrapper end

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
