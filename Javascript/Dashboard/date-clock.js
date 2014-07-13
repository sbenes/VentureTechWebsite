jQuery(function($){
  
  var $clockCont = $('<div class="clock_container"></div>'),
      $date = $('<div class="curr_date"></div>').appendTo($clockCont),
      $clock = $('<div class="curr_time"></div>').appendTo($clockCont),
      $menu = $('#aside1 .menu.dashboard_nav');
  
  var changeDate = function(){
    var shownDate = $date.html(),
        currDate = moment().format('dddd MMM Do YYYY');
    
    if(shownDate != currDate){
      $date.html(currDate);
    }
    
  };
  
  var clockPoll = setInterval(function(){
    var newTime = moment().format('h:mm:ss A'),
        currHour = moment().hours(),
        currMinute = moment().minutes(),
        currSecond = moment().seconds();
    
    if(currHour == 0 && currMinute == 0 && currSecond == 0){
      changeDate();
    }
    
    $clock.html(newTime);
    
  }, 500);
  
  changeDate();
  
  //Add that clock dog
  $clockCont.insertBefore($menu);
  
});