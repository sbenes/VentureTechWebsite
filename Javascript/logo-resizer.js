$(window).ready(function(){
  var logos = $('.ventures .primary .logo img');
  
  logos.load(function(){
    //console.log('*************************************************************************');
    var $img = $(this);
    var $venture = $img.closest('.ventures');
    //console.log(p.width() + ' ' + p.height() + ' ' + (p.width()*p.height()));
    
    $img.width(100);
    //console.log(x.width() + ' ' + x.height() + ' ' + (x.width()*x.height()));
    
    var w = ((($venture.width()*$venture.height())/2) / (($img.width()*$img.height())) + ($img.width() - $img.height())) + 100;
    $img.width(w);
    
    //console.log(x.width() + ' ' + x.height() + ' ' + (x.width()*x.height()));
  });
});
