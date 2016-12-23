var HH=HH||{};HH.PhotoGallery=(function(b){var a=function(d){var c=this;c.selectorId=d||"";c.CLASS_LOADED="ps-img-loaded";c.CLASS_LAZY="ps-lazy";c.CLASS_ACTIVE="active";c.THUMB_WIDTH=105;c.META_WIDTH=200;c.SLIDER_HEIGHT=70;c.EVENT_DISPLAY="displayImage";c.IMAGE_LOADER=HH.Params.baseUrl+"/css/images/transparent.gif";c.FB_APP_ID=HH.Params.fbAppId;c.HASHTAG=HH.Params.hashTag;c.SLIDE_DURATION=600;c.MIN_LANDSCAPE_WIDTH=300;c.MIN_PORTRAIT_HEIGHT=200;c.isAnimated=false;c.lastMaxWidth=0;c.lastMaxHeight=0;c.$theatre=b("#ps-theatre-"+c.selectorId);c.init();return this};a.prototype.init=function(){var c=this;c.TOTAL_IMAGES=c.$theatre.data("total-images");c.$modal=c.$theatre.find(".galleryModal");c.$imageHolder=c.$theatre.find("#ps-image-holder");c.$fbWrapper=c.$theatre.find(".fbShare");c.$twitterWrapper=c.$theatre.find(".tweetShare");c.$captionWrapper=c.$theatre.find(".photoDescription");c.$dateWrapper=c.$theatre.find(".dateLocation");c.$photoCountWrapper=c.$theatre.find(".photoCount");c.$imgPrev=c.$theatre.find("#ps-img-prev");c.$imgNext=c.$theatre.find("#ps-img-next");c.$slidePrev=c.$theatre.find("#ps-slide-prev");c.$slideNext=c.$theatre.find("#ps-slide-next");c.$outer=c.$theatre.find("#ps-slideshow-outer");c.$inner=c.$theatre.find("#ps-slideshow-inner");c.$imgContentWrapper=c.$theatre.find(".slideshowContentWrapper");c.$slideshowMeta=c.$theatre.find(".slideshowMeta");c.updateLayout();c.bindEvents()};a.prototype.loadImage=function(f,c,e,h){var g=this,d=b("<img />"),i=f.data("src"),c=c||"";d.attr("src",i).load(function(){f.hide();f.attr("src",i);f.addClass(c);f.addClass(g.CLASS_LOADED);f.fadeIn()}).error(function(){if(typeof h==="function"){h()}}).load(function(){if(typeof e==="function"){e()}})};a.prototype.showActiveImage=function(){var d=this,c=null,e=null;e=d.$inner.find("."+d.CLASS_ACTIVE);c=e.find("img");if(!c.length){c=d.$inner.find("li").first().find("img");c.closest("li").addClass(d.CLASS_ACTIVE)}d.showImageContent(c)};a.prototype.showPrevImage=function(){var e=this,c=null,d=null;c=e.$theatre.find("li.active");if(c.prev().length){d=c.prev().find("img");e.manageActiveState(d.closest("li"));e.showImageContent(d);e.slideL2R(e.THUMB_WIDTH+12)}};a.prototype.showNextImage=function(){var e=this,c=null,d=null;c=e.$theatre.find("li.active");if(c.next().length){d=c.next().find("img");e.manageActiveState(d.closest("li"));e.showImageContent(d);e.slideR2L(e.THUMB_WIDTH+12)}};a.prototype.manageActiveState=function(d){var c=this;d.addClass(c.CLASS_ACTIVE);d.siblings().removeClass(c.CLASS_ACTIVE)};a.prototype.handleSliderNavigationVisiblity=function(){var c=this;if(parseInt(c.$inner.width()-5)<=c.$outer.width()){c.$slideNext.hide();c.$slidePrev.hide()}else{c.$slideNext.show();c.$slidePrev.show()}};a.prototype.setInnerWidth=function(){var c=this;width=c.TOTAL_IMAGES*c.THUMB_WIDTH;if(width<=c.$outer.width()){width=c.$outer.width()}c.$inner.width(width)};a.prototype.setOuterWidth=function(){var c=this.$modal.width();this.$outer.width(c)};a.prototype.alignNavigation=function(){var d=this,c=d.$inner.width(),g=d.$outer.width(),e=parseFloat(d.$inner.css("margin-left")),f=c-(g+Math.abs(e));if(f<=0){d.$inner.css({marginLeft:Math.abs(f)-Math.abs(e)})}};a.prototype.updateLayout=function(){var c=this;c.resizeModal();c.setOuterWidth();c.setInnerWidth();c.handleSliderNavigationVisiblity();c.alignNavigation()};a.prototype.slideR2L=function(g,j){var i=this,g=g||0,j=j||false,d=0,l=0,k=0,c=0,h=0,e=0,m=null,f=i.SLIDE_DURATION;if(i.isAnimated){return}d=i.getLeftMargin();l=Math.abs(d);k=i.$outer.width();c=l+k;c=Math.floor(c*2);if((i.$inner.width()-(l+k))<k){k=i.$inner.width()-(l+k)}else{if(g!==0){k=g;f=200}}h=Math.ceil(c/i.THUMB_WIDTH);i.loadThumbs(h);if(!j){i.isAnimated=true;i.$inner.animate({marginLeft:d-k},f,function(){i.isAnimated=false})}};a.prototype.slideL2R=function(h){var f=this,h=h||0,e=0,d=0,c=0,g=f.SLIDE_DURATION;if(f.isAnimated){return}e=f.getLeftMargin();d=Math.abs(e);c=f.$outer.width();if(h!==0){c=h;g=200}if(e+c>0){c=d}if(h==0){f.loadThumbs()}f.isAnimated=true;f.$inner.animate({marginLeft:e+c},g,function(){f.isAnimated=false})};a.prototype.loadThumbs=function(d){var g=this,f=0,c=0;c=d||Math.ceil((g.$outer.width()*2)/g.THUMB_WIDTH);f=g.$inner.find("."+g.CLASS_LOADED).last().index();f=f<0?0:f;for(var e=f;e<=c;e++){$imgToLoad=g.$inner.find("."+g.CLASS_LAZY).eq(e);if($imgToLoad.length){$imgToLoad.trigger(g.EVENT_DISPLAY)}}};a.prototype.getLeftMargin=function(){var c=this;return parseInt(c.$inner.css("margin-left").replace("px",""))};a.prototype.setLeftMargin=function(d){var c=this,d=parseInt(d);c.$inner.css("margin-left",d+"px")};a.prototype.getImageSizeBasedOnScreenSize=function(e){var d=window.screen||false,c={width:0,height:0};if(e==1){c.width=640;c.height=960;if(d){if(d.width<433||d.height<650){c.width=280;c.height=420}else{if(d.width<640||d.height<960){c.width=433;c.height=650}}}}else{c.width=1200;c.height=800;if(d){if(d.width<960||d.height<640){c.width=650;c.height=433}else{if(d.width<1200||d.height<800){c.width=960;c.height=640}}}}return c};a.prototype.showImageContent=function(d){var e=this,g="",c={},f=d.clone();c=e.getImageSizeBasedOnScreenSize(f.data("is-portrait"));g=f.data("src").replace("100x67",c.width+"x"+c.height);f.data("image-width",c.width);f.data("image-height",c.height);f.attr("src",e.IMAGE_LOADER);f.data("src",g);f.removeClass(e.CLASS_LAZY);f.removeAttr("id");e.$imageHolder.empty();e.$imageHolder.append(f);e.loadImage(f);e.appendFbShare(f.data("url"));e.appendTwShare(f.data("url"));e.appendCaption(f.data("description"));e.appendDate(f.data("date-location"));e.updatePhotoCount(f.data("ordinal"));e.handleImageNavigationVisiblity(f);e.updateLayout()};a.prototype.handleImageNavigationVisiblity=function(d){var f=this,g=d.data("ordinal"),c=f.$inner.find("li").first().find("img").data("ordinal"),e=f.$inner.find("li").last().find("img").data("ordinal");f.$imgPrev.show();f.$imgNext.show();if(g==c){f.$imgPrev.hide()}else{if(g==e){f.$imgNext.hide()}}};a.prototype.appendTwShare=function(f){var e=this,c=e.$twitterWrapper,d=[];d.push('<a id="t_btn" href="https://twitter.com/share" data-text="IPLT20 Photos" class="twitter-share-button" rel="canonical" data-hashtags="'+e.HASHTAG+'" data-url="'+f+'">Tweet</a>');d.push('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"><\/script>');c.html(d.join(""))};a.prototype.appendFbShare=function(e){var d=this,c="";c='<iframe scrolling="no" frameborder="0" allowtransparency="true" style="border:none; overflow:hidden; width:100px; height:21px;" src="//www.facebook.com/plugins/like.php?href='+e+"&amp&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId="+d.FB_APP_ID+'"></iframe>';d.$fbWrapper.empty();d.$fbWrapper.append(c)};a.prototype.appendWhatsAppShare=function(e){var d=this,c="";c='<a href="whatsapp://send?text=IPLT20 Photos%0A'+e+'" class="whatsAppShare" target="_blank"><span class="whatsApp-small"></span>Share</a>';d.$whatsAppWrapper.empty();d.$whatsAppWrapper.append(c)};a.prototype.appendCaption=function(c){var d=this;d.$captionWrapper.text(c)};a.prototype.appendDate=function(c){var d=this;d.$dateWrapper.text(c)};a.prototype.updatePhotoCount=function(c){var d=this,c=c||0;c=parseInt(c)+1;d.$photoCountWrapper.text(c+" / "+d.TOTAL_IMAGES)};a.prototype.getOrdinalById=function(c){return this.$inner.find("#ps-image_"+c).data("ordinal")};a.prototype.open=function(d){var g=this,d=parseInt(d)||0,e=0,f=0,c=0;e=Math.abs(g.getLeftMargin());sliderWidht=g.$outer.width();c=d*g.THUMB_WIDTH;g.$theatre.show();g.resetLastMaxSize();g.$inner.find("#ps-thumb-item_"+d).find("img").click();g.showActiveImage();if(g.$inner.width()<(c+g.$outer.width())){c=g.$inner.width()-g.$outer.width()}g.setLeftMargin(-(c));g.loadThumbs(d+parseInt(g.$outer.width()/g.THUMB_WIDTH)*2)};a.prototype.bindEvents=function(){var c=this,d=null;c.$theatre.find("."+c.CLASS_LAZY).on(c.EVENT_DISPLAY,function(){var e=b(this);e.show();if(!e.hasClass(c.CLASS_LOADED)){c.loadImage(e,c.CLASS_LAZY,function(){e.closest("li").css("background-image","none")})}});c.$theatre.find("."+c.CLASS_LAZY).on("click",function(){var e=b(this);c.manageActiveState(e.closest("li"));c.showImageContent(e)});b("body").on("click",function(e){d=e.target.id;if(d==="ps-theatre"&&c.$theatre.is(":visible")){c.$theatre.hide()}});c.$imgPrev.on("click",function(){c.showPrevImage()});c.$imgNext.on("click",function(){c.showNextImage()});c.$slidePrev.on("click",function(){c.slideL2R()});c.$slideNext.on("click",function(){c.slideR2L()});c.$theatre.find(".closeModal").on("click",function(){c.$theatre.hide()});c.$imageHolder.on("click",function(){c.showNextImage()});b(document).keyup(function(f){if(f.keyCode==27){c.$theatre.hide()}if(f.keyCode==39){c.showNextImage()}if(f.keyCode==37){c.showPrevImage()}});b(window).resize(function(){c.resetLastMaxSize();c.updateLayout()})};a.prototype.resizeModal=function(){var f=this,e=null,d={},c={},g={};c=f.getOriginalImageSize();d=f.getImageHolderSize(c);f.$imageHolder.width(d.width);f.$imageHolder.height(d.height);g=f.getNewImageSize(f.$imageHolder.width(),f.$imageHolder.height(),c);$img=f.$imageHolder.find("img");$img.width(g.width);$img.height(g.height);$img.css("margin-left",g.marginLeft);$img.css("margin-top",g.marginTop);f.$slideshowMeta.css("height",$img.height()+"px");e=b("#ps-img-prev, #ps-img-next");e.css("top",((f.$imageHolder.height()-e.height())/2)+"px");f.$modal.width(f.$imageHolder.width()+f.META_WIDTH+1);f.alignModalVertically();f.setLastMaxSize(d.width,d.height)};a.prototype.getNewImageSize=function(f,c,d){var g=this,h={},e=f/c;if(e>=d.ratio){h.height=c;h.width=h.height*d.ratio}else{h.width=f;h.height=h.width/d.ratio}h.ratio=h.width/h.height;if(h.width>=d.width){h=d}h.marginTop=c>h.height?(c-h.height)/2:0;h.marginLeft=f>h.width?(f-h.width)/2:0;return h};a.prototype.getOriginalImageSize=function(){var d=this,e=b("."+d.CLASS_ACTIVE).find("img"),c={};c.width=parseInt(e.data("image-width"))||0;c.height=parseInt(e.data("image-height"))||0;c.ratio=c.width/c.height||0;return c};a.prototype.getImageHolderSize=function(g){var h=this,e=b(window),j={width:0,height:0,ratio:0},c=e.height(),f=e.width(),i=f/c,d={},k=10;if(i>=g.ratio){j.height=c-k-h.SLIDER_HEIGHT;j.width=j.height*g.ratio}else{j.width=f-k-h.META_WIDTH;j.height=j.width/g.ratio}j.ratio=j.width/j.height;if(j.width>=g.width){j=g}if(g.ratio>=1){if(j.width<h.MIN_LANDSCAPE_WIDTH){j.width=h.MIN_LANDSCAPE_WIDTH;j.height=j.width/g.ratio}}else{if(j.height<h.MIN_PORTRAIT_HEIGHT){j.height=h.MIN_PORTRAIT_HEIGHT;j.width=j.height*g.ratio}}d=h.getLastMaxSize(j);if(d.width>0){j=d}return j};a.prototype.getLastMaxSize=function(d){var f=this,c=0,e=0;c=Math.max(d.width,f.lastMaxWidth);e=Math.max(d.height,f.lastMaxHeight);return{width:c,height:e,ratio:c/e}};a.prototype.resetLastMaxSize=function(){this.setLastMaxSize(0,0)};a.prototype.setLastMaxSize=function(c,d){this.lastMaxWidth=c;this.lastMaxHeight=d};a.prototype.alignModalVertically=function(){var c=this,f=b(window),e=f.height()-c.$modal.height(),d=parseInt(e/2);if(parseInt(c.$modal.css("margin-top"))!=d){c.$modal.css({marginTop:parseInt(d)})}};return a})(jQuery);