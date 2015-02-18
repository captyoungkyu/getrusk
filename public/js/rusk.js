$(document).ready(function(){
	$(".button-collapse").sideNav();
	$('.modal-trigger').leanModal();

	$("#share-url-input-box").on("click",function(){
		$(this).select();
	});

  $(".js-del").on("click",function(e){
    var card = $(this);
    $.ajax({
      url: "/"+$(this).attr("data-storage")+"/delete/"+$(card.attr("href")).attr("data-info"),
      type: "DELETE"
    }).done(function(reply){
      if(reply.result == "success"){
        $(card.attr("href")).remove();
        console.log(reply.result);
        console.log(card.attr("href"));
      } else {
        alert("삭제 실패.");
      }
    }).fail(function(){
      alert("삭제 실패.");
    });
    e.preventDefault();
  });

});