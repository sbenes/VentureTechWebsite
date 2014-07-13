jQuery(function($) {
  var $imgs = $('#leadership_img').children();
  var $texts = $('.collapsible-group-leadership');
  
  $('.collapsible-control').prepend('<div class="control-button"></div>').click(function(evt){
    window._gaq = window._gaq || [];
    window._gaq.push(['_trackEvent', 'Leadership', 'Open Bio', $('h2', this).text()]);
  });
  
  $imgs.hover(function(){
    $(this).stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
  }, function(){
    if($texts.filter('.shown').length){
      var $img = $imgs.filter('.'+$texts.filter('.shown').attr('id'));
      $img.stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
    } else {
      $imgs.stop().fadeTo(500,1);
    }
  });
  
  $texts.each(function(){
    $(this).hover(function(){
      var $img = $imgs.filter('.'+$(this).attr('id'));
      $img.stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
    }, function(){
      if($texts.filter('.shown').length){
        var $img = $imgs.filter('.'+$texts.filter('.shown').attr('id'));
        $img.stop().fadeTo(500,1).siblings().stop().fadeTo(500,0);
      } else {
        $imgs.stop().fadeTo(500,1);
      }
    });
  });
});
