var HH=HH||{};HH.MobileAppsPromo=(function(b){var a=function(){var c=this;this.init=function(){c.bindEvents();if(c.isNewVisitor()){b("#mobile-apps-promo").slideToggle("slow");b("#mobile-apps-promo").height("137");c.animate("open")}};this.bindEvents=function(){b("#mobile-apps-promo .close").click(function(){c.close()})};this.close=function(){c.setCookie();c.animate("close")};this.open=function(){c.animate("open")};this.animate=function(e){var d="0px";if(e=="open"){d="137px"}b("#mobile-apps-promo").animate({height:d},1000,function(){})};this.isNewVisitor=function(){var d="mobile-app-promo-2016";if(b.cookie(d)===null){return true}return false};this.setCookie=function(){var e="mobile-app-promo-2016";if(b.cookie(e)===null){var d=new Date();d.setTime(d.getTime()+60*60*24*7*1000);b.cookie(e,"set",{expires:d,path:"/"})}};this.init()};return new a()})(jQuery);