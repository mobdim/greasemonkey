// ==UserScript==
// @id redmineext@tid
// @name Redmine User Select Helper
// @namespace http://projekt2k.de/
// @description Redmine User Select Helper
// @match http://demo.redmine.org/*
// @version 0.6
// ==/UserScript==

function wrapper() {
    if(typeof redmineExtender === "undefined") {
        redmineExtender = { extensions: { } };
    }

    // PLUGIN START
    (function() {
        redmineExtender.extensions.userSelectHelper = {
            /**
             * initialize the page
             *
             * this will call some more special prepare fucntions
             */
            init: function() {
                redmineExtender.extensions.userSelectHelper.prepareAssignedTo();

                /**
                 * Add an ajaxSuccess handle, so we can re-modify the page, after
                 * redmine has modified it via an ajax call.  This happens especially
                 * if either the project or the issue status are changed.
                 */
                $(document).ajaxSuccess(function() {
                    if(!$("#issue_assigned_to_id ~ a:contains('edit')").length) {
                        /* edit link was removed, re-modify */
                        redmineExtender.extensions.userSelectHelper.prepareAssignedTo();
                    }
                });
            },

            /**
             * prepare the assign-to select.
             * this will find options the user has selected
             * and clone them to the top of the select
             */
            prepareAssignedTo: function() {
                var $assignedSelect = jQuery('#issue_assigned_to_id');
                var currentValue = $assignedSelect.val();

                if($assignedSelect.length == 0) {
                    return;
                }

                $assignedSelect.after(jQuery('<a>', {
                    href: '#',
                    text: ' edit',
                    click: redmineExtender.extensions.userSelectHelper.askForTopUsers
                }));

                var topItems = redmineExtender.helper.fetch("topUsers");

                if(!topItems) {
                    localStorage.removeItem("topUsers");
                    redmineExtender.extensions.userSelectHelper.askForTopUsers();
                }

                var newItems = [];

                jQuery.each(topItems, function(i, e) {
                    newItems.push( jQuery('option[value="'+e+'"]:first', $assignedSelect).clone().addClass('generated') );
                });

                if(newItems.length > 0) {
                    newItems.push(jQuery('<option>', {
                        text: '--------------------------',
                        'class': 'generated'
                    }));
                }

                $assignedSelect.find('option[value=""]').after(newItems);

                // now make sure only one option is selected
                // make it the first having the original value
                $assignedSelect.find('option').prop('selected', false);

                if(currentValue != '')
                {
                    $assignedSelect.find('option[value='+currentValue+']:first').prop('selected', true);
                }
            },

            /**
             * shows a dialog to let the user select entries
             */
            askForTopUsers: function(e) {
                if(typeof e != 'undefined') {
                    e.preventDefault();
                }

                var currentTopItems = redmineExtender.helper.fetch("topUsers");
                redmineExtender.helper.showUserSelector(
                    'Top-User auswählen',
                    'Bitte wählen Sie die Nutzer, die oben gelistet werden sollen',
                    currentTopItems,
                    function(selected) {
                        redmineExtender.helper.store("topUsers", selected);
                    }
                );
            }
        };
    })();
    // PLUGIN END

    if(redmineExtender.initialized) {
        redmineExtender.extensions.userSelectHelper.init(jQuery);
    }
} // wrapper end

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);