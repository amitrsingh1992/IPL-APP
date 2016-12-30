function putFirstHeader(){
var dom;
$.get("template/header.html",function(data){
 dom = $(data);
});

var ref =firebase.database().ref();

ref.once("value").then(function(data){
  var carDOM = "";
  var imgDOM="";
$.each(data.val().team_info,function(key,value){
if(key===0){
  carDOM+='<li data-target="#myCarousel" data-slide-to="0" class="active"></li>';
    imgDOM+='<div class="item active"><img src="ipl images/team_logo/'+value.team_img_url+'" alt="Delhi Daredevils" width="460" height="345" /></div>';
}else{
  carDOM+='<li data-target="#myCarousel" data-slide-to="'+key+'"></li>';
    imgDOM+='<div class="item"><img src="ipl images/team_logo/'+value.team_img_url+'" alt="'+value.team_name+'" width="460" height="345" /></div>';
}
});
dom.find(".carousel-indicators").append(carDOM);
dom.find(".carousel-inner").append(imgDOM);
$(".myheader").append(dom);
});
};
// <div class="card">
//   <img class="card-img-top" src="..." alt="Card image cap">
//   <div class="card-block">
//     <h4 class="card-title">Card title</h4>
//   </div>
// </div>
function putFirstContent() {

  var ref =firebase.database().ref();

  ref.once("value").then(function(data){
    var carDOM = "";
  $.each(data.val().team_info,function(key,value){
carDOM+=' <div class="card col-lg-3">\
  <a href="#team/'+value.team_name.replace(/\s/g,'')+'"><img class="card-img-top" src="ipl images/team_logo/'+value.team_img_url+'" alt="Card image cap"></a>\
  <div class="card-block">\
    <h4 class="card-title">'+value.team_name+'</h4>\
  </div></div>';
  });
  $(".mycontent").append(carDOM);
  });
}

function putTeamContent(teamName) {

  var ref =firebase.database().ref(teamName);

  ref.once("value").then(function(data){
    var carDOM = "";
  $.each(data.val(),function(key,value){
carDOM+=' <div class="card col-lg-4" >\
      <div class="card1">\
      <div class="front">\
  <img class="card-img-top" src="ipl images/'+value.player_img_url+'" alt="Card image cap">\
  </div><div class="back">\
    <div class="card-block">\
    <h4 class="card-title"><strong>Name:</strong>'+value.player_name+'</h4>\
    <h4 class="card-title"><strong>Role:</strong>'+value.player_role+'</h4>\
    <h4 class="card-title"><strong>Batting Style:</strong>'+value.player_batting_style+'</h4>\
    <h4 class="card-title"><strong>Bowling Style:</strong>'+value.player_bowling_style+'</h4>\
    <h4 class="card-title"><strong>Nationality:</strong>'+value.player_nationality+'</h4>\
    <h4 class="card-title"><strong>Date Of Birth:</strong>'+value.player_dob+'</h4>\
  </div></div></div></div>';
  });
  $(".mycontent").append(carDOM);
  $(function(){
  $(".card1").flip({trigger:'click',axis: 'x'});
  });
  });
}
