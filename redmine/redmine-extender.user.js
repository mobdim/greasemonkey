// ==UserScript==
// @id redmine-extender@sts
// @name Redmine Extender
// @namespace http://stesie.github.io/
// @description Redmine Extender
// @match http://demo.redmine.org/*
// @match https://redmine.mobdim.com/*
// @version 0.4
// ==/UserScript==

function wrapper() {
    if(typeof redmineExtender === "undefined") {
        redmineExtender = {};
    }

    redmineExtender.extensions = redmineExtender.extensions || {};

    (function() {
        function IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        /**
         * will add jquery and jqueryui, then call init
         */
        redmineExtender.prepare = function() {
            var MIN_JQUERY_VERSION = '1.8.1';

            // Ensure jQuery and jQuery UI are loaded and available before
            if(window.jQuery === undefined || window.jQuery.fn.jquery < MIN_JQUERY_VERSION) {
                loadJQuery();
            } else if(window.jQuery.fn.dialog === undefined) {
                loadJQueryUI(window.jQuery);
            } else {
                jQuery(redmineExtender.init);
            }

            /**
             * add jQueryUI - script to the DOM. onload - init will be called
             */
            function loadJQueryUI($) {
                console.log("Injecting jQueryUI ...");
                var done = false;
                var script = document.createElement("script");
                script.src = "//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js";
                script.onload = script.onreadystatechange = function() {
                    if(!done && (!this.readyState || this.readyState === "loaded"
                                 || this.readyState == "complete")) {
                        done = true;
                        $(redmineExtender.init);
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(script);
                $('head').append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/css/base/jquery-ui.css" type="text/css" />');
            }

            /**
             * add jQuery - script to the DOM. onload - jQueryUI will be added
             */
            function loadJQuery() {
                console.log("Injecting jQuery ...");
                var done = false;
                var script = document.createElement("script");
                script.src = "//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js";
                script.onload = script.onreadystatechange = function() {
                    if(!done && (!this.readyState || this.readyState === "loaded"
                                 || this.readyState == "complete")) {
                        var jQuery = $.noConflict();
                        done = true;
                        loadJQueryUI(jQuery);
                    }
                };

                document.getElementsByTagName("head")[0].appendChild(script);
            }
        };

        /**
         * initialize the page
         *
         * this will call some more special prepare fucntions
         */
        redmineExtender.init = function() {
            console.log("Redmine Extender launching ...");
            for(var foo in redmineExtender.extensions) {
                if(redmineExtender.extensions.hasOwnProperty(foo)) {
                    redmineExtender.extensions[foo].init(jQuery);
                }
            }

            redmineExtender.initialized = true;
        };

        redmineExtender.helper = {
            /**
             * shows a dialog to let the user select entries
             */
            showUserSelector: function(title, message, selectItems, saveCb) {
                var $dialogContent = jQuery('<div>', { id: 'userselection' })
                .append(jQuery('<label>', { 'for': '' })
                        .text(message)
                        .after(jQuery('<br>'))
                       )

                var $userselect = jQuery('#issue_assigned_to_id')
                .clone()
                .find('.generated')
                    .remove()
                .end();

                $userselect.prop('multiple', true)
                .prop('size', 10)
                .prop('id', 'userselect')
                .css({'width': '90%'})
                .find('option:selected')
                    .prop('selected', false)
                .end();

                if(selectItems) {
                    jQuery.each(selectItems, function(i, e) {
                        jQuery('option[value="'+e+'"]', $userselect).prop('selected', true);
                    });
                }

                $dialogContent.append($userselect)
                .dialog({
                    title: title,
                    buttons: [
                        {
                            text: "Сохранить",
                            click: function() {
                                var selected = jQuery('#userselect').val();
                                $dialogContent.dialog('destroy');
                                saveCb(selected);
                            }
                        }
                    ]
                });
            },

            /**
             * save the userselection
             */
            store: function(key, selected) {
                var newTopItems = [];
                if(selected.length > 0) {
                    newTopItems = JSON.stringify(selected);
                }

                localStorage.setItem(key, newTopItems);
            },

            /**
             * fetch selected topItems from local storage
             *
             * this returns false if nothing is in localStorage,
             * its no JSON or no Array/Object in JSON
             *
             * @return {bool|object}
             */
            fetch: function(key) {
                var topItems = localStorage.getItem(key);

                if(!topItems || !IsJsonString(topItems)) {
                    return false;
                }

                topItems = JSON.parse(topItems);

                if(typeof topItems != 'array' && typeof topItems != 'object') {
                    return false;
                }

                return topItems;
            }
        };
    })();

    redmineExtender.prepare();
} // wrapper end

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
