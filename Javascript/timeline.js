jQuery(function($){
  
  var active_id = -1;
  var marker_interval = 5;
  var fix_width_timer = null;
  
  var $con = $('#timeline');
  var original_min_height = parseInt($con.css('min-height'), 10);
  
  var $key = $('<ul class="key" />').appendTo($con);
  var $controls = $('<div class="controls" />').appendTo($con);
  var $bar = $('<div class="bar" />').appendTo($con);
  var $popups = $('<div class="popups" />').appendTo($con);
  var $scale_markers = $('<div class="scale_markers" />').appendTo($bar);
  var $markers = $('<div class="markers" />').appendTo($bar);
  
  var $prev = $('<a class="browse left prev" href="#"><span>Previous Event</span></a>').appendTo($controls);
  var $next = $('<a class="browse right next" href="#"><span>Next Event</span></a>').appendTo($controls);
  
  //get a list of popups from all the timelines
  var popups = [];  
  $('.timeline_point').find('.content').each(function(){ 
    popups.push({
      date: moment($('time', this).attr('datetime')).toDate(),
      article: this
    });
  }).end().remove();
  
  //sort the popups by date
  popups.sort(function(a,b){ 
    if(a.date < b.date) return -1;
    if(a.date > b.date) return 1;
    return 0;
  });
  
  var start = popups[0].date.getFullYear();
  var now = new Date();
  var end = now.getFullYear() + 2;
  var timeline_year_count = end - start;
  
  //add padding to ends of the timeline so that it always has at least 2 years 
  var start_mod = start % 5;
  var end_mod = end % 5;
  if(start_mod == 0 || start_mod == 4) start -= (start_mod == 0 ? 2 : 1);
  if(end_mod  < 2) end += (end_mod == 0 ? 2 : 1);
  
  
  var setActive = function(id){
    active_id = id;
  };
  
  var getActive = function(){
    return active_id;
  };
  
  var prevEvent = function(){
    var cur_idx = getActive();
    var new_idx = ( cur_idx <= 0 ? 0 : cur_idx - 1 );
    
    openPopup(new_idx); 
  };
  
  var nextEvent = function(){ 
    var cur_idx = getActive();
    var new_idx = (cur_idx >= (popups.length - 1) ? cur_idx : cur_idx + 1 );
    
    openPopup(new_idx); 
  };
  
  var openPopup = function(idx){  
    closeAllPopups();
    
    $prev.add($next).removeClass('disabled');
    
    if(0 >= idx) $prev.addClass('disabled');
    if(popups.length <= idx + 1) $next.addClass('disabled');
    
    setActive(idx);
    popups[idx].$popup.addClass('opened');
    $markers.find('.marker').eq(idx).addClass('active').siblings().removeClass('active');
  };
  
  var closeAllPopups = function(){
    $('.opened.popup', $popups).removeClass('opened');
  };
 
  var createBar = function(){
    $markers.empty();
    $popups.empty();
    $scale_markers.empty();
    
    var pixels_per_year = Math.floor($bar.width() / timeline_year_count);
    var pixels_per_month = pixels_per_year / 12;
    
    for(var i = start; i < end; i++){
      if(i % marker_interval == 0){
        $('<span class="marker" />')
          .attr('id', 'year'+i)
          .text(i)
          .data('year-diff', (i - start))
          .css('left', (pixels_per_year * (i - start)))
          .appendTo($scale_markers)
          .append($('<span class="line" />'));
      }
    }
    
    var bar_width = $bar.width();
    $.each(popups, function(idx){
      var $event = $(this.article);
      
      //don't wonder why I parse the date like this.  Thank IE and their date parser.
      var event_date = popups[idx].date;
      var $marker  = $('<div class="marker" />').wrapInner('<span>&nbsp;</span>').appendTo($markers);
      var $popup = $('<div class="popup" />').appendTo($popups);

      
      var $line = $('<div class="line" />').appendTo($popup);
      $popup.append($('<div class="title" />').text($event.find('time').text()));
      $popup.append($event.find('.description'));
      
      $event.remove();
      
      $marker.click(function(evt){
        $popups.find('.popup.clicked').removeClass('clicked');
        $popups.find('.popup').eq(idx).addClass('clicked');
        openPopup(idx);
      });
      
      $marker.hover(function(evt){
        if($popups.find('.popup').eq(idx).hasClass('clicked')){
          $popups.find('.popup').eq(idx).removeClass('clicked')
        }
        openPopup(idx);
      },function(evt){});
      
      popups[idx].$marker = $marker;
      popups[idx].$popup = $popup;
    });
      
    updateBar();
    
    openPopup(0);
  };
  

  var updateBar = function(){
    
    var pixels_per_year = Math.floor($bar.width() / timeline_year_count);
    var pixels_per_month = pixels_per_year / 12;
    
    $('.marker', $scale_markers).each(function(){
      $(this).css('left', (pixels_per_year * $(this).data('year-diff')));
    });
    
    var bar_width = $bar.width();
    $.each(popups, function(idx){
      
      var event_date = popups[idx].date;
      
      var marker_position = ((event_date.getFullYear() - start) * pixels_per_year) + (event_date.getMonth() * pixels_per_month);
      popups[idx].$marker.css('left', marker_position);
      
      var popup_width = popups[idx].$popup.outerWidth(true);
      if(marker_position > bar_width - popup_width){
        var popup_left = bar_width - popup_width;
        var line_left = marker_position - (bar_width - popup_width);
      } else {
        var popup_left = marker_position;
        var line_left = 0;
      }
      
      popups[idx].$popup.css('left', popup_left);
      $('.line', popups[idx].$popup).css('left', line_left - parseInt(popups[idx].$popup.css('border-left-width'), 10));
      
    });
    
    openPopup(0);
    
    $con.css('min-height', original_min_height + 1);
    clearTimeout(fix_width_timer);
    fix_width_timer = setTimeout(function(){
      $con.css('min-height', original_min_height);
    }, 200);
  };
  
  
      
       
  $prev.click(function(evt){
    evt.preventDefault();
    prevEvent();
  });
  
  $next.click(function(evt){
    evt.preventDefault();
    nextEvent();
  });

  var bar_state = '';
  $(window).resize(function(){
    var width = $bar.width();
    if((bar_state != 'big' && width > 750) || (bar_state == 'big' && width < 750)){
      if(width  > 750)
        bar_state = 'big';
      else
        bar_state = 'small';
      
      updateBar();
    }
  });

  createBar();
});