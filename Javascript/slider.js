jQuery(function(){
  var slides = $('.slider').find('.text, .post');
  slides.each(function(){
    var slide = $(this);
    slide.addClass('slide');
  });
  $(slides[0]).addClass('current');
  
  setInterval(function(){
    var oldIndex;
    var index;
    slides.each(function(){
      var slide = this;
      if(slide.className.indexOf("current") >= 0){
        oldIndex = slides.index(slide);
        if(oldIndex >= (slides.length - 1)){
          index = 0;
        }else{
          index = oldIndex + 1;
        }
      }
    });
    $(slides[oldIndex]).removeClass("current");
    $(slides[index]).addClass("current");
  }, 5000);
});

$(window).load(function(){
  $('.slider').css('opacity', 1);
});
