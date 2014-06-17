// ==UserScript==
// @id redmine-toolbar-modifier@sts
// @name Redmine Toolbar Modifier
// @namespace http://stesie.github.io/
// @description Redmine Toolbar Modifier
// @match http://demo.redmine.org/*
// @match https://redmine.mobdim.com/*
// @version 0.2
// ==/UserScript==

function wrapper() {
    if(typeof redmineExtender === "undefined") {
        redmineExtender = { extensions: { } };
    }
    
    // PLUGIN START
    (function() {
        redmineExtender.extensions.toolbarModifier = {
            init: function($) {
                // register icons
                $('head').append('<style type="text/css">'
                                 + '.jstb_pre_php { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QcTCjUu4YjLnwAAAnlJREFUOMvNkk1Ik3EAxn//92Ob6dSGiWmb78QSMY0wogj6EKMOEXWJ6NihvNSh8BIEERFB545BRB9mnwRREBGZJJJ9TEFq2nIs86NNN93eub0f/w5BJ4MuQb/jw8Pv8jzwL5Bu4dLfdsVy4fuJGTmTSJOaSZMt5HE9Dkagjvr6cloaa8Wygsl5S/YPRomMfCZpB7CyGYI11Uwl57A8pZSYFprI4lgJThw/QHNDSPwWDEQ+yUdPIySzZbhqAKwswRqHi2eO0dV9npwbwtFyaI6XElejsBClc4fB4YN7hfYuNimvXHvLSl8pc59v4cg0itpMjd6AItPEIo8I1W1DdacYn4ihV7isazrGkzfTDA1HpPLyZRzHLsd2VR7efU51TQfx8dd8GHqFYawnGGzhydMert+4TaCiHavgZ3DwGWW+enrv96GMRpM4wmXRnEHoCqHGTYTqyhmLRgiHN+D3hxGaScHOYBitrFq9BuGZxXYk419TKHqJiabmsM1ZAqu8RIZf0D8whqX5qKgzmPxuoutebFlkNvWFez03CTe2YYtFfD4X9ejJU+emEwXM2SSZ6SiqBzr3nUaUuQTXtWKbPqrKHOZ+ZHCkl5279+D3dyA12BCWiMnkgrxw+Sqx2HdKaw38VatRHQ1V6ggbVniKfJsYYioXp6l9P8KqRS0sQWaEs92Hfs04Go/LOw/6mU4qSFFJzguK60F1VBSZx+ez8GoK5pLDQm4RkU/QdWQX27duEaJYnGvweAIxgN7Hg7Kv/yN5fwXC0RGujiYEAotS22YqNc7GzQanjx4Rf7xybinVOZHIP0/PL2AVbaQjUTWVynIvba1rBf8dPwEwYRaeafOpqwAAAABJRU5ErkJggg=="); }'
                                 + '.jstb_pre_sql { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QcTCjkl2u9dGwAAAeJJREFUOMtjDOmcHfDm04dcAT6+dfLiEksnxPt9ZWRk/M1AJGD6y/jbSFVCou3Tt2//dp85s9SkpP18ZM+MJmINYJi4ZZuub9e0nQwMDAzn7t0Q+f//P7tpaetCp7rea8ULN4sS0s/IwMDA4Nk8eTonF+cmUzlRNTZ27hvFfi47E2csdr929+mscltv6yA/3Sd4Tfn//7+weVnrIXTxzRfOWajl1DyfvO0oN84wYGBgYGBkZHyrryT7PHPOEhNkSV8DoxPK4uJV606cKMRrAAMDA8PJ6w9aedj5jdEVJHu4rXn57nMBQQM8jNRM91+8hOGNEFP1z/JiQiusq/v78Rrwn+Gv5pljl1/VLF2buPL4eRQ/b6/Ly/n8+WPkxC07hHEa8O7dt7PzWkrVFx48N2//5Wvq6ArV5SSmz9l3qnrOkdN6WA049/TJyX1Xry0V5+O8//3b9050A96++94UaGl4bNn2w/OzZ61KQEkHcP92T43XEOU9ev3JO0NnfX2eLF/H+dj87dc1bfePn38vRdiYVTHiCt0tJy8oiPHzvjfTUP6IlF449Ypr33Cx8OxUkhZ+YCQlU8PIQCLwb50+6dvvb5w/P/8tOdRb9pFkA/7//88c0T/P6uffvxniLBylDJQCAGDhwSafCFDTAAAAAElFTkSuQmCC"); }'
                                 + '.jstb_pre_js { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90HFgkmM9b5qL8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA3UlEQVQ4y+3TMSvGURQG8N//TZmsJiWTgUHKB7DKZNUZDN7eUjL5CHpHNgZKp4xMFCOLxGYwyyeQzfBa/sN1U/6z3OXep6fz9DznnsP/aUoQEaMSZ2YTETM4xhKusYenzGygVxf88D7FMlawg/2yptfB5WJ7v2fmG/olOdZB4AybuImIjcy8KqN3cbCFI0ziMiIOImL8N4FR0YvPzBxgDS/Yxsm3CBFxi4ki70f1M3OZeRERj3jFau1gGguYb/F95egwIqYw2+K7WmAdz3hoyUElsIshzttZ6P+hXfgC8cE8JizNPeoAAAAASUVORK5CYII=");}'
                                 + '</style>');

                // remove toolbars
                $('.jstElements').remove()

                // extend prototype
				jsToolBar.prototype.elements.space99 = {type: "space"};
                jsToolBar.prototype.elements.pre_php = {type: "button",title: "Preformatted PHP Code",fn: {wiki: function() {
            	    this.encloseLineSelection("<pre><code class=\"php\">\n", "\n</code></pre>")
        		}}};
                jsToolBar.prototype.elements.pre_sql = {type: "button",title: "Preformatted MySQL Code",fn: {wiki: function() {
            	    this.encloseLineSelection("<pre><code class=\"sql\">\n", "\n</code></pre>")
        		}}};
                jsToolBar.prototype.elements.pre_js = {type: "button",title: "JS",fn: {wiki: function() {
                    this.encloseLineSelection("<pre><code class=\"JavaScript\">\n", "\n</code></pre>")
                }}};

                // re-create toolbars
                $.each(['issue_description', 'issue_notes', 'content_text'], function(i, element) {
                    if($('#'+element).length) {
                		var wikiToolbar = new jsToolBar(document.getElementById(element)); wikiToolbar.setHelpLink('/help/wiki_syntax.html'); wikiToolbar.draw();
                    }
                });
            }
        };
    })();
    // PLUGIN END

    if(redmineExtender.initialized) {
        redmineExtender.extensions.toolbarModifier.init(jQuery);
    }
} // wrapper end

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
