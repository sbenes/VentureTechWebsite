jQuery(function($){
  
  var $ventures = $('.venture_list .ventures');
  var $filterCon = $('.venture_filter');
  var filterMap = {};
  
  var getSide = function getSide(evt, offset, width, height, tolerance) {
    var side;
    var tolerance = typeof tolerance === 'undefined' ? 10 : tolerance;
    
    var pos = {
      top: offset.top,
      right: offset.left + width,
      bottom: offset.top + height,
      left: offset.left
    };
    
    var diffs = {
      top: Math.abs(evt.pageY - pos.top),
      right: Math.abs(evt.pageX - pos.right),
      bottom: Math.abs(evt.pageY - pos.bottom),
      left: Math.abs(evt.pageX - pos.left)
    };
    
    var betweenAxis = {
      x: evt.pageX > pos.left && evt.pageX < pos.right,
      y: evt.pageY > pos.top && evt.pageY < pos.bottom
    };
    
    
    if (diffs.top < tolerance || evt.pageY < pos.top) {
      if (diffs.left < tolerance || evt.pageX < pos.left) {
        side = 'left';          
      } else if (diffs.right < tolerance || evt.pageX > pos.right) {
        side = 'right';
      } else {
        side = 'top';
      }
    } else if (diffs.bottom < tolerance || evt.pageY > pos.bottom) {
      if (diffs.left < tolerance || evt.pageX < pos.left) {
        side = 'left';          
      } else if (diffs.right < tolerance || evt.pageX > pos.right) {
        side = 'right';
      } else {
        side = 'bottom';
      }
    } else {
      if (diffs.right < tolerance || evt.pageX > pos.right) {
        side = 'right';
      } else {
        side = 'left';
      }
    } 
    
    return side;
  };
  
  function updateVisibleVentures() {
    $ventures.removeClass('last').not('.hide').filter(function( index ) {
      return index % 3 === 2;
    }).addClass('last'); 
  }
  
  $ventures.each(function(){
    var $venture = $(this);
    var $secondary = $venture.find('.secondary');
    var addOverClassTimer;
    var addOverClassDelay = 100;
    
    $venture.hover(function(evt){
      var sideClass = 'goto-' + getSide(evt, $venture.offset(), $venture.width(), $venture.height(), 15);
      if (!$venture.hasClass(sideClass)) {
        $secondary.addClass('notransition');
        $venture.removeClass('goto-top goto-right goto-bottom goto-left');
        $venture.addClass(sideClass);
      }
      
      clearTimeout(addOverClassTimer);
      addOverClassTimer = setTimeout(function(){
        $secondary.removeClass('notransition');
        $venture.addClass('active');
        $venture.removeClass('goto-top goto-right goto-bottom goto-left');
      }, addOverClassDelay);
    }, function(evt){
      var sideClass = 'goto-' + getSide(evt, $venture.offset(), $venture.width(), $venture.height(), 15);
      
      $venture.addClass(sideClass);
      $venture.removeClass('active');
      
      clearTimeout(addOverClassTimer);
    });
  });
  
  
  $filterCon
    .on('click', '.menuitemlabel', function(evt) {
      var $link = $(this);
      var label = $link.attr('href').replace(/^.*#/, '#').substr(1);
      
      $link.parent().addClass('mi_active').siblings().removeClass('mi_active');
      
      if (label == 'all' || label == '') {
        $ventures.removeClass('hide');
        return;
      }
      
      $ventures.addClass('hide');
      if (filterMap[label]) {
        filterMap[label].removeClass('hide');
      }
      
      updateVisibleVentures();
    })
    .find('.mi').removeClass('mi_active');
  
  $ventures.each(function(){
    var $venture = $(this);
    var labels = $venture.find('.config').data('labels').split('|');
    $.each(labels, function(idx, item) {
      if (!item.length) {
        return;
      }
      
      if (!filterMap[item]) {
        filterMap[item] = $([]);
      }
      filterMap[item] = filterMap[item].add($venture);
    });
  });
  
  if (window.location.hash.length) {
    $filterCon.find('.menuitemlabel[href$=' + window.location.hash + ']').trigger('click');
  } else {
    $filterCon.find('.menuitemlabel:first').trigger('click');
  }
    
  updateVisibleVentures();
});