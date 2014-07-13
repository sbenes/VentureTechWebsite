jQuery(function(){
  window.filter = function(label){
    var ventures = $('.composite').find('.venture-wrapper');
    ventures.each(function(i){
      var venture = $(this);
      if(!venture.hasClass(label)){
        venture.fadeOut(300).addClass('filtered');
      }else if(venture.hasClass('filtered')){
       venture.fadeIn(300).removeClass('filtered');
      }
    });
  }
});
