jQuery(function(){
  $('.venture-item').each(function(){
    var venture = $(this).closest('.ventures').get(0);
    $(this).on('click', function(event){
      event.stopPropagation();
      if($(venture).hasClass('active')){
        $(venture).removeClass('active');
      }else{
        $('.ventures.active').removeClass('active');
        $(venture).addClass('active');
      }
    });
  });
  $(document).click(function(event){
    $('.ventures.active').removeClass('active');
  });
});


