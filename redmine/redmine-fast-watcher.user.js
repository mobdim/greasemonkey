// ==UserScript==
// @id redmine-fast-watcher@sts
// @name Redmine Fast Watcher
// @namespace http://stesie.github.io/
// @description Redmine Fast Watcher
// @match http://demo.redmine.org/*
// @match https://redmine.mobdim.com/*
// @version 0.1
// ==/UserScript==

function wrapper() {
    if(typeof redmineExtender === 'undefined') {
        redmineExtender = { extensions: { } };
    }

    // PLUGIN START
    (function() {
        redmineExtender.extensions.fastWatcher = {
            /**
             * Initialize the page
             *
             * This will call some more special prepare functions.
             */
            init: function() {
                redmineExtender.extensions.fastWatcher.prepareSidebar(jQuery);
            },
        
            /**
             * Prepare the sidebar.
             *
             * This will add the shortcut links to the sidebar.
             */
            prepareSidebar: function($) {
                var fastWatchers = redmineExtender.helper.fetch('fastWatchers.uidList');

                if(!fastWatchers) {
                    localStorage.removeItem('fastWatchers.uidList');
                    redmineExtender.extensions.fastWatcher.askForFastWatchers();
                    return;
                }

                // Remove old fast-watch block (when updating the sidebar)
                $('#fast-watch').remove();

                var $block = $('<div>', { id: 'fast-watch' })
                .append($('<div>', { 'class': 'contextual' })
                        .append($('<a>', {
                            href: '#',
                            click: redmineExtender.extensions.fastWatcher.askForFastWatchers,
                            text: 'Настройка'
                        })))
                .append($('<h3>', {
                    text: 'Наблюдатели'
                }));

                var $list = $('<ul>', { 'class': 'watchers' })
                .css('margin', 0)
                .css('padding', 0);
                var $assignedSelect = $('#issue_assigned_to_id');
                $.each(fastWatchers, function(i, e) {
                    if($('#watchers .user-'+e).length) {
                        return;  // user already watching, skip her
                    }
                    var $watcher = $('option[value="'+e+'"]:last', $assignedSelect);
                    $list.append($('<li>', { 'class': 'user-'+e })
                                 .append($('<a>', {
                                     class: 'icon icon-fav-off',
                                     rel: 'nofollow',
                                     text: $watcher.text(),
                                     href: '#',
                                     click: function(ev) {
                                         ev.preventDefault();
                                         $.ajax(location.pathname + '/watchers', {
                                             type: 'POST',
                                             data: {
                                                 authenticity_token: $('input[name="authenticity_token"]').val(),
                                                 utf8: $('input[name="utf8"]').val(),
                                                 user_search: '',
                                                 watcher: { user_ids: [ e ] }
                                             },
                                             dataType: 'script',
                                             success: function() {
                                                 $('#fast-watch .user-'+e).remove();
                                             }
                                         });
                                     }
                                 }))
                                 .css('list-style-type', 'none')
                                );
                });

                $block.append($list).insertAfter('#watchers');
            },
            
            /**
             * shows a dialog to let the user select entries
             */
            askForFastWatchers : function(e) {
                if(typeof e != 'undefined')
                {
                    e.preventDefault();
                }

                redmineExtender.helper.showUserSelector(
                    'Выберите наблюдателей',
                    'Пожалуйста, выберите пользователей',
                    redmineExtender.helper.fetch('fastWatchers.uidList'),
                    function(selected) {
                        redmineExtender.helper.store('fastWatchers.uidList', selected);
                        redmineExtender.extensions.fastWatcher.prepareSidebar(jQuery);
                    }
                );
            }
        };
    })();
    // PLUGIN END

    if(redmineExtender.initialized) {
        redmineExtender.extensions.fastWatcher.init(jQuery);
    }
} // wrapper end

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
