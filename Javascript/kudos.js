jQuery(function($){
  
  var $kudosMenuItm = $('.dashboard_nav .mi.kudos'),
      $kudosContent,
      clappingImgs = [],
      isInit = false;
  
  var randomizeFiles = function(files){
    while(files.files.length > 0){
      var randIdx = Math.floor(Math.random()*files.files.length);
      clappingImgs.push(files.files.splice(randIdx,1)[0]);
    }    
  };
  
  var addImages = function(){
    $kudosContent.find('.kudo').each(function(){
      var $imgCont = $('<div class="kudo_image"></div>').appendTo($(this).find('.kudo_content'));
      $(this).on('click',function(){
        kudoClicked($imgCont);
      });
    });
  };
  
  var kudoClicked = function($imgCont){
    if($imgCont.children().length){
      $imgCont.toggleClass('hide');
    }else {
      var randIdx = Math.floor(Math.random()*clappingImgs.length);
      $imgCont.append('<img src="'+clappingImgs[randIdx]+'" alt="Good For You!"/>');
    }
  };
  
  $.getJSON('/ws/dashboard/clapping-img',function(data, status){
    var polling = setInterval(function(){
      if(status == 'success'){
        var images = data;
        randomizeFiles(images);
        clearTimeout(polling);
      }
    },500);
    
  });
  
  $kudosMenuItm.on('click','a',function(){
    window.addEventListener('kudos-Loaded',function(){
      $kudosContent = $('.content_column .content_container.kudos');
      addImages();
    },false);
  });

});