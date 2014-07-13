jQuery(function($){
  
  function SlideManager(target, opts) {
    var $root = $(target);
    var $nav, $navi, $slides;
    var defaults = {
      slideSelector: '.featured_slide',
      activeClass: 'active',
      rotateDelay: 7000,
      autoRotate: true
    };
    var settings = {};
    var rotateTimer;
    
    function getDocumentVisibilityState() {
      return typeof document.visibilityState !== "undefined" ? document.visibilityState:
        typeof document.msVisibilityState !== "undefined" ? document.msVisibilityState:
        typeof document.mozVisibilityState !== "undefined" ? document.mozVisibilityState:
        typeof document.webkitVisibilityState !== "undefined" ? document.webkitVisibilityState: 
        undefined;
    };
    
    function activateSlide(index) {
      $slides.addClass('notransition-children');
      $navi.eq(index).addClass(settings.activeClass).siblings().removeClass(settings.activeClass);
      $slides.eq(index).addClass(settings.activeClass).siblings().removeClass(settings.activeClass);
    }
    
    function getNextItemIndex() {
      var $active = getActiveItem();
      var activeIndex = $active.index();
      
      return (activeIndex == $navi.length - 1 ? 0 : ++activeIndex);
    };
    
    function getActiveItem() {
      return $navi.filter('.' + settings.activeClass);      
    };
    
    function startAutoRotate() {
      stopAutoRotate();
      rotateTimer = setTimeout(function(){
        if (getDocumentVisibilityState() != "hidden") {
          activateSlide(getNextItemIndex());
        } 
        startAutoRotate();
      }, settings.rotateDelay);
    };
    
    function stopAutoRotate() {
      clearTimeout(rotateTimer);
    };
    
    function pause(state) {
      if (state) {
        stopAutoRotate();
      } else {
        startAutoRotate();
      }
    };
    
    function init() {
      
      if ($root.data('slideinit')) {
        return;
      }
      
      //get the settings, combination of defaults and option overrides
      settings = $.extend({}, defaults, opts);
      
      //make a nav element
      $nav = $('<ul class="nav" />').appendTo($root);
      
      $slides = $root.find(settings.slideSelector).each(function() {
        $('<li class="ni" />').appendTo($nav);
      });
      
      //wrap interior for styling purposes
      $slides.wrapInner('<div class="inner-wrap"><div class="inner" /></div>');
      
      //cache the nav elements
      $navi = $nav.find('.ni');
      
      //set up event handling for navigation
      $nav.on('click', '.ni', function(evt) {
        activateSlide($(this).index());
      });    
      
      if (settings.autoRotate) {
        $root.on('mouseenter', function(evt){
          pause(true);
        });
        
        $root.on('mouseleave', function(evt){
          pause(false);
        });
      }
      
      //remove extra elements from VS output
      $root.find(' > .clear_float_bounding').remove();                 
      
      //make sure the slide knows it is ready for work
      $root.data('slideinit', true);
    }
    
    init();
    
    if (settings.autoRotate) {
      startAutoRotate();
    }
    
    return {
      activateSlide: activateSlide,
      startAutoRotate: startAutoRotate
    };
  }
  
  $('.tile.facts').each(function() {
    var $con = $(this);
    var callbacks = [], index, heading;
    var start = moment([1992, 12, 1]);
    
    function addCommas(nStr) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    }
    
    //allows you to do custom logic to generate your string, not just static strings
    callbacks.push(function(){ return 'the first SMS message was sent from a computer to a mobile phone'; });
    callbacks.push(function(){ return 'the first digital hand-size mobile telephone was in the market'; });
    callbacks.push(function(){ return 'Microsoft introduced Windows 3.1'; });
    callbacks.push(function(){ return 'the price of a gallon of regular gasoline was $1.13 (July 27, 1992)'; });
    callbacks.push(function(){ return 'the cost of a dozen eggs was $0.93'; });
    callbacks.push(function(){ return 'the average price of a movie ticket was $4.14'; });
    callbacks.push(function(){ return 'the popular Song at the time was Baby Got Back by Sir Mix A Lot'; });
    
    $con.find('.days .count').text(addCommas(moment().diff(start, 'days')));
    $con.find('.months .count').text(addCommas(moment().diff(start, 'months')));
    $con.find('.years .count').text(addCommas(moment().diff(start, 'years')));
    
    index = Math.min(callbacks.length - 1, Math.round(Math.random() * callbacks.length));
    
    $('<p />').text('When we started, ' + callbacks[index].call()).appendTo($con.find('.time-fact'));
  });
  
  $('.featured_slide.proven_results .ventures').each(function(idx, item) {
    $(this).addClass('venture'+idx);
  });
  
  
  $('.grid .tile').each(function() {
    var $tile = $(this);
    
    $tile.find('.readmore').each(function(){
      $('<a class="overlay" />')
        .attr({
          href: $(this).attr('href'),
          title: $(this).attr('title')
        })
        .insertAfter(this);
    })
  });
  
  $('.featured_slides').each(function() {
    var sm = new SlideManager(this);
    
    setTimeout(function() {
      sm.activateSlide(0);
    }, 500);
  });
  
  $('.featured_ventures').each(function() {
    var $con = $(this);
    var $ventures = $con.find('.ventures');
    
    $ventures.eq(Math.floor(Math.random() * $ventures.length)).addClass('active');
  });
  
  $('.features').each(function() {
    var $con = $(this);
    var $images = $con.find('.home_featured');
    var rotateTimer;
    var rotateDelay = 4000;
    var directions = ['top', 'right', 'bottom', 'left'];
    
    var getDocumentVisibilityState = function getDocumentVisibilityState() {
      return typeof document.visibilityState !== "undefined" ? document.visibilityState:
        typeof document.msVisibilityState !== "undefined" ? document.msVisibilityState:
        typeof document.mozVisibilityState !== "undefined" ? document.mozVisibilityState:
        typeof document.webkitVisibilityState !== "undefined" ? document.webkitVisibilityState: 
        undefined;
    };
    
    var showImage = function showImage(idx) {
      $images
        .eq(idx)
        .addClass('active')
        .removeClass('goto-top goto-right goto-bottom goto-left');
    };
    
    var hideImage = function hideImage(idx) {
      $images
        .removeClass('active')
        .eq(idx)
        .addClass('goto-' + directions[Math.floor(Math.random() * 4)]);
    };
    
    var getActiveItem = function getActiveItem() {
      return $images.filter('.active');      
    };
    
    var getNextItemIndex = function getNextItemIndex() {
      var $active = getActiveItem();
      var activeIndex = $active.index();
      
      return (activeIndex == $images.length - 1 ? 0 : ++activeIndex);
    };
    
    var startAutoRotate = function startAutoRotate() {
      stopAutoRotate();
      rotateTimer = setTimeout(function(){
        if (getDocumentVisibilityState() != "hidden") {
          activateImageByIndex(getNextItemIndex());
        } 
        startAutoRotate();
      }, rotateDelay);
    };
    
    var stopAutoRotate = function stopAutoRotate() {
      clearTimeout(rotateTimer);
    };
    
    var activateImageByIndex = function activateImageByIndex(idx) {  
      if (idx != getActiveItem().index()) {
        hideImage(getActiveItem().index());
      } 
      showImage(idx);
    };
    
    var pause = function pause(state) {
      if (state) {
        stopAutoRotate();
      } else {
        startAutoRotate();
      }
    };
    
    var setupSlides = function setupSlides() {      
      $con.on('mouseenter', function(evt){
        pause(true);
      });
      
      $con.on('mouseleave', function(evt){
        pause(false);
      });
    };
    
    setupSlides();
    activateImageByIndex(0);
    startAutoRotate();
  });
});