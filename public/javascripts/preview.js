/*
        link-preview v1.4 by frequency-decoder.com

        Released under a creative commons Attribution-ShareAlike 2.5 license (http://creativecommons.org/licenses/by-sa/2.5/)

        Please credit frequency-decoder in any derivative work - thanks.

        You are free:

        * to copy, distribute, display, and perform the work
        * to make derivative works
        * to make commercial use of the work

        Under the following conditions:

                by Attribution.
                --------------
                You must attribute the work in the manner specified by the author or licensor.

                sa
                --
                Share Alike. If you alter, transform, or build upon this work, you may distribute the resulting work only under a license identical to this one.

        * For any reuse or distribution, you must make clear to others the license terms of this work.
        * Any of these conditions can be waived if you get permission from the copyright holder.

        References:
        
        Wesnapr: http://www.preview.com
        Dustan Diaz: http://www.dustindiaz.com/sweet-titles-finalized
        Arc90: http://lab.arc90.com/2006/07/link_thumbnail.php
*/
var preview = {
        x:0,
        y:0,
        obj:{},
        img:null,
        lnk:null,
        timer:null,
        opacityTimer:null,
        errorTimer:null,
        hidden:true,
        linkPool: {},
        baseURI: "/images/",
        imageCache: [],
        init: function() {
                var lnks = document.getElementsByTagName('a');
                var i = lnks.length || 0;
                var cnt = 0;
                while(i--) {
                        if(lnks[i].className && lnks[i].className.search(/preview/) != -1) {
                                preview.addEvent(lnks[i], ["focus", "mouseover"], preview.initThumb);
                                preview.addEvent(lnks[i], ["blur",  "mouseout"],  preview.hideThumb);
                                preview.linkPool[lnks[i].href] = cnt++;
                        }
                }
                if(cnt) {
                        preview.preloadImages();
                        preview.obj = document.createElement('div');

                        preview.ind = document.createElement('div');
                        preview.ind.className= "imageLoaded";
                        preview.img = document.createElement('img');
                        preview.img.alt = "preview";
                        preview.img.id = "fdImage";
                        preview.addEvent(preview.img, ["load"], preview.imageLoaded);
                        preview.addEvent(preview.img, ["error"], preview.imageError);
                        preview.obj.id = "fdImageThumb";
                        preview.obj.style.visibility = "hidden";
                        preview.obj.style.top = "0";
                        preview.obj.style.left = "0";
                        preview.addEvent(preview.img, ["mouseout"],  preview.hideThumb);
                        preview.obj.appendChild(preview.ind);
                        preview.obj.appendChild(preview.img);
                        preview.addEvent(preview.obj, ["mouseout"], preview.hideThumb);
                        document.getElementsByTagName('body')[0].appendChild(preview.obj);
                }
        },
        preloadImages: function() {
                var imgList = ["lt.png", "lb.png", "rt.png", "rb.png", "loading1.gif"];
                var imgObj  = document.createElement('img');

                for(var i = 0, img; img = imgList[i]; i++) {
                        preview.imageCache[i] = imgObj.cloneNode(false);
                        preview.imageCache[i].src = preview.baseURI + img;
                }
        },
        imageLoaded: function() {
                if(preview.errorTimer) clearTimeout(preview.errorTimer);
                if(!preview.hidden) preview.img.style.visibility = "visible";
                preview.ind.className= "imageLoaded";
                preview.ind.style.visibility = "hidden";
        },
        imageError: function(e) {
                if(preview.errorTimer) clearTimeout(preview.errorTimer);
                preview.ind.className= "imageError";
                preview.errorTimer = window.setTimeout("preview.hideThumb()",2000);
        },
        initThumb: function(e) {
                e = e || event;
                preview.lnk       = this;
                var positionClass  = "left";

                var heightIndent;
                var indentX = 0;
                var indentY = 0;
                var trueBody = (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;

                if(String(e.type).toLowerCase().search(/mouseover/) != -1) {
                        if (document.captureEvents) {
                                preview.x = e.pageX;
                                preview.y = e.pageY;
                        } else if ( window.event.clientX ) {
                                preview.x = window.event.clientX+trueBody.scrollLeft;
                                preview.y = window.event.clientY+trueBody.scrollTop;
                        }
                        indentX = 10;
                        heightIndent = parseInt(preview.y-(preview.obj.offsetHeight))+'px';
                } else {
                        var obj = this;
                        var curleft = curtop = 0;
                        if (obj.offsetParent) {
                                curleft = obj.offsetLeft;
                                curtop = obj.offsetTop;
                                while (obj = obj.offsetParent) {
                                        curleft += obj.offsetLeft;
                                        curtop += obj.offsetTop;
                                }
                        }
                        curtop += this.offsetHeight;

                        preview.x = curleft;
                        preview.y = curtop;

                        heightIndent = parseInt(preview.y-(preview.obj.offsetHeight)-this.offsetHeight)+'px';
                }
                
                if ( parseInt(trueBody.clientWidth+trueBody.scrollLeft) < parseInt(preview.obj.offsetWidth+preview.x) + indentX) {
                        preview.obj.style.left = parseInt(preview.x-(preview.obj.offsetWidth+indentX))+'px';
                        positionClass = "right";
                } else {
                        preview.obj.style.left = (preview.x+indentX)+'px';
                }
                if ( parseInt(trueBody.clientHeight+trueBody.scrollTop) < parseInt(preview.obj.offsetHeight+preview.y) + indentY ) {
                        preview.obj.style.top = heightIndent;
                        positionClass += "Top";
                } else {
                        preview.obj.style.top = (preview.y + indentY)+'px';
                        positionClass += "Bottom";
                }

                preview.obj.className = positionClass;
                preview.timer = window.setTimeout("preview.showThumb()",100);
        },
        showThumb: function(e) {
                preview.hidden = false;
                preview.obj.style.visibility = preview.ind.style.visibility = 'visible';
                preview.obj.style.opacity = preview.ind.style.opacity = '0';
                preview.img.style.visibility = "hidden";
                
                var addy = String(preview.lnk.href);

                preview.errorTimer = window.setTimeout("preview.imageError()",15000);
                preview.img.src = 'http://thumbnailspro.com/thumb.php?url=' + encodeURIComponent(addy)+'&s=202&rndm='+parseInt(preview.linkPool[preview.lnk.href]);
                /*@cc_on@*/
                /*@if(@_win32)
                return;
                /*@end@*/
                
                preview.fade(10);
        },
        hideThumb: function(e) {
                // Don't mouseout if over the bubble
                e = e || window.event;

                // Check if mouse(over|out) are still within the same parent element
                if(e.type == "mouseout") {
                        var elem = e.relatedTarget || e.toElement;
                        if(elem.id && elem.id.search("fdImage") != -1) return false;
                }

                preview.hidden = true;
                if(preview.timer) clearTimeout(preview.timer);
                if(preview.errorTimer) clearTimeout(preview.errorTimer);
                if(preview.opacityTimer) clearTimeout(preview.opacityTimer);
                preview.obj.style.visibility = 'hidden';
                preview.ind.style.visibility = 'hidden';
                preview.img.style.visibility = 'hidden';
                preview.ind.className= "imageLoaded";
        },
        fade: function(opac) {
                var passed  = parseInt(opac);
                var newOpac = parseInt(passed+10);
                if ( newOpac < 90 ) {
                        preview.obj.style.opacity = preview.ind.style.opacity = '.'+newOpac;
                        preview.opacityTimer = window.setTimeout("preview.fade('"+newOpac+"')",20);
                } else {
                        preview.obj.style.opacity = preview.ind.style.opacity = '1';
                }
        },
        addEvent: function( obj, types, fn ) {
                var type;
                for(var i = 0; i < types.length; i++) {
                        type = types[i];
                        if ( obj.attachEvent ) {
                                obj['e'+type+fn] = fn;
                                obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
                                obj.attachEvent( 'on'+type, obj[type+fn] );
                        } else obj.addEventListener( type, fn, false );
                }
        }
}

preview.addEvent(window, ['load'], preview.init);
