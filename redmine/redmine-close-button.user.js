// ==UserScript==
// @id	redmine-close-button@sts
// @name Redmine Close Button
// @namespace http://stesie.github.io/
// @description Redmine Close Button Extension
// @match http://demo.redmine.org/*
// @version 0.4
// ==/UserScript==

function wrapper() {
    if(typeof redmineExtender === "undefined") {
        redmineExtender = { extensions: { } };
    }
    
    // PLUGIN START
    (function() {
        var ID_CLOSED = 3, ID_REJECTED = 6;
    
        redmineExtender.extensions.closeButton = {
            init: function($) {
                $('head').append('<style type="text/css">.icon-close { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3klEQVQ4y6WPy2sTQRyA+5d48epBRBEUpCefCIrUgyUiam9a0EOqB+sLH4dARY0VqSk0hxbbIAQJWKWKj1qCHhJF0FpCLaabrEknZpPsZrP7Odk8TNktCh6+mWHn933LdAFd/4Oz2KkY1eQYRmIE/cMwlfhtyrMBSq+uob0YRJv2U4j1I6J9iIgPV8D6FgW76sK25G51fJPn/MQhd6D8flheGtimaFATWGZestJEONhWhVx4rztQmruDVVnEyD7CUMLoyw/Rf9yjsnSLyuJNyqlLlBYGMAtzqKFud0B7G5CBBXRlrCkHpTwk5RtSvujI2vxpTPGG7P2t7oB4ep5aeV7KIx3ydUqpQSn7HVn7clIGXpK5u8EdyMfOoCVCiPg5xLuziNl+cjPHmvIpRy5+7sVcmUEZWs+J0MY6fwJq5Cji9VVqxY+SBNVclNzzXrSvdfm4lI9Q/HQQMz/tyFfiA87eDvyc8qFGelAf78LITFHNRlCfHXaGGvIBisk9bfly3O+w7cLmxjvUSR/60hPSo5vITG5Hz0ys+tOv5G5PWdLdCIz3YKRjFBJBlPF9q4ZbES+5/YRseD9KaCfLD3aQDm7he2CdM9QS1pLbgbXojHjJfw10Rrzkfwq0Il5ynd8kOwQEVPe6YwAAAABJRU5ErkJggg=="); } </style>');
    
                var s = $('#issue_status_id');
                if (s.length === 0) {
                    return;
                }
                var options = s.get(0).childNodes;
                var needCloseButton = false;
                for (var i = options.length - 1; i >= 0; i--) {
                    var option = options[i];
                    var v = parseInt(option.value, 10);
                    if (v === ID_REJECTED) {
                        if (option.selected) {
                            needCloseButton = false;
                            break;
                        }
                    }
                    if (v === ID_CLOSED) {
                        if (option.selected) {
                            needCloseButton = false;
                            break;
                        } else {
                            needCloseButton = true;
                        }
                    }
                }
                if (!needCloseButton) {
                    return;
                }
                var f = $('#issue-form');
                var areas = $('div#content>div.contextual:has(a.icon)');
                if (f.length === 0 || areas.length === 0) {
                    return;
                }
                var done_ratio = $('#issue_done_ratio');
                var closer = function(ev) {
                    ev.preventDefault();
                    s.val(ID_CLOSED);
                    done_ratio.val(100);
                    f.submit();
                };
                var closeButtonTemplate = $('a.redmine-close-button');
                areas.each(function() {
                    var closeButton = $("<a>").attr("href", "").addClass("icon icon-close redmine-close-button").html("Schließen")
                    .click(closer);
                    
                    var delButton = $(this).find('a.icon-del');
                    if (delButton.length > 0) {
                        closeButton.insertBefore(delButton);
                    } else {
                        $(this).append(closeButton);
                    }
                });
            }
        };
    })();
    // PLUGIN END

    if(redmineExtender.initialized) {
        redmineExtender.extensions.closeButton.init(jQuery);
    }
} // wrapper end

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
