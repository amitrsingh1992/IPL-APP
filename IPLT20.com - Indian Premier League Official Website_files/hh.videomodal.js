var HH=HH||{};HH.VideoModal=(function(d){var a=null;var b=function(){a=a||new c();return a};var c=function(){this.ID_PREFIX="hh-video-modal-js";this.BASE_URL=HH.Params.baseUrl;this.FB_APP_ID=HH.Params.fbAppId;this.HASHTAG=HH.Params.hashTag;this.BC_PLAYER_ID=HH.Params.playerId;this.BC_PLAYER_KEY=HH.Params.playerKey;this.originalUrl="";this.playerParams={};this.id=this.getId();this.create();this.modal=d("#"+this.id);this.bindEvents();this.updateLayout();return this};c.prototype.getId=function(){return this.ID_PREFIX};c.prototype.create=function(){var h=this,g=[];g.push('<div id="'+h.id+'" class="videoPlayerModal">');g.push('<div class="md-show modal videoPlayer">');g.push('<div class="md-content">');g.push('<div class="videoPlayerContent">');g.push('<div class="close">');g.push('<div class="icon"></div>');g.push("</div>");g.push("<header>");g.push('<h3 class="videoTitle"></h3>');g.push('<div class="date dateLocation"></div>');g.push('<p class="videoDescription"></p>');g.push('<div class="share">');g.push('<div data-type="facebook" class="shareIcon facebook"></div>');g.push('<div data-type="twitter" class="shareIcon twitter"></div>');g.push('<div data-type="google" class="shareIcon google"></div>');g.push("</div>");g.push("</header>");g.push('<div class="playerContainer">');g.push('<figure class="videoWrapper" id="playerWrapper"></figure>');g.push("</div>");g.push("</div>");g.push("</div>");g.push("</div>");g.push('<div class="modalOverlay">');g.push("</div>");g.push("</div>   ");d("body").append(g.join(""))};c.prototype.bindEvents=function(){var g=this;g.modal.find(".close").on("click",function(){g.hide();if(typeof HH.Hero!="undefined"){HH.Hero.turnOnAutomaticSlider()}});d(document).keyup(function(h){if(h.keyCode==27){d("object").blur();g.hide()}});g.modal.on("click",function(){g.hide()});g.modal.find(".videoPlayer").on("click",function(){if(document.getElementById("myExperiences")){var h=brightcove.api.getExperience("myExperiences");var i=h.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);i.play(true)}return false});g.modal.find(".shareIcon").on("click",function(){g.share(d(this).data("type"),f)})};c.prototype.show=function(){if(document.getElementById("myExperiences")){var g=brightcove.api.getExperience("myExperiences");var h=g.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);h.pause(true)}this.modal.show();d("body").css("overflow","hidden")};c.prototype.hide=function(){this.modal.hide();this.clearContent();if(this.originalUrl!==""){this.updateUrl(this.originalUrl)}d("body").css("overflow","visible")};c.prototype.clearContent=function(){this.modal.find(".videoWrapper").html("");this.modal.find(".videoTitle").html("");this.modal.find(".dateLocation").html("");this.modal.find(".videoDescription").html("")};c.prototype.embedPlayer=function(n){var k=this,n=n||{},h=n.type||null,l=n.mediaId||"",m=n.title||"",g=n.location||"",j=n.description||"",i="";k.playerParams=n;k.originalUrl=document.URL;k.updateUrl(k.createVideoUrl(k.playerParams));k.modal.find(".videoTitle").text(m);k.modal.find(".dateLocation").html(g);k.modal.find(".videoDescription").text(j);if(h==="youtube"){i=k.createYTPlayer(l)}else{if(h=="brightcove"){i=k.createBCPlayer(l)}}k.modal.find(".videoWrapper").html(i)};c.prototype.createBCPlayer=function(i){var h=this,g=[];g.push('<object id="myExperience" class="BrightcoveExperience">');g.push('<param name="bgcolor" value="#FFFFFF" />');g.push('<param name="width" value="100%" />');g.push('<param name="height" value="270" />');g.push('<param name="playerID" value="'+h.BC_PLAYER_ID+'" />');g.push('<param name="playerKey" value="'+h.BC_PLAYER_KEY+'" />');g.push('<param name="isVid" value="true" />');g.push('<param name="isUI" value="true" />');g.push('<param name="dynamicStreaming" value="true" />');g.push('<param name="autoStart" value="true" />');g.push('<param name="@videoPlayer" value="'+i+'" />');g.push('<param name="secureConnections" value="true" />');g.push('<param name="secureHTMLConnections" value="true" />');g.push("</object>");g.push('<script type="text/javascript">');g.push("$(document).ready(function(){ brightcove.createExperiences(); });");g.push("<\/script>");return g.join("")};c.prototype.updateUrl=function(g){if(window.history.pushState){window.history.pushState(null,null,g)}};c.prototype.createYTPlayer=function(h){var g=[];g.push('<iframe width="768" height="432" src="http://www.youtube.com/embed/'+h+'" frameborder="0"></iframe>');return g.join("")};c.prototype.updateLayout=function(){this.modal.height(d(document).height())};c.prototype.createVideoUrl=function(g){return this.BASE_URL+"/videos/media/id/"+g.mediaId+"/"+e.seoText(g.title)};c.prototype.share=function(g,j){var h=this,i={};d.extend(i,h.playerParams);i.url=h.createVideoUrl(i);i.hashtag=h.HASHTAG;if(d.inArray(g,j.types)>=0){j[g].call(j,i)}};var f={types:["twitter","facebook","google"],facebook:function(g){var h={method:"share",href:g.url};FB.ui(h)},twitter:function(i){var h=this,i=i||{},j=[],g;g="https://twitter.com/intent/tweet?";j.push("original_referer="+i.url);j.push("url="+i.url);j.push("text="+i.title);j.push("hashtags="+i.hashtag);window.open(g+j.join("&"),"_blank","width=600, height=300")},google:function(h){var h=h||{};var g="<a onclick='popUp=window.open(\"https://plus.google.com/share?url="+h.url+'", "popupwindow", "scrollbars=yes,width=800,height=400"); popUp.focus();return false\' class="google" href="https://plus.google.com/share?url='+h.url+'" target="_blank"></a>';d(g).click()}};var e={seoText:function(m){var j="0123456789abcdefghijklmnopqrstuvxywz- ",h="",l="";for(var k=0,g=m.length;k<g;k++){l=m[k].toLowerCase();if(j.indexOf(l)!=-1){h+=l}}return h.replace(/\ +/g,"-")},isIpad:function(){return !!navigator.userAgent.match(/iPad/i)}};return{getInstance:b}})(jQuery);