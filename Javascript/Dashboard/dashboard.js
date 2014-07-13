/* This is used to set options of specific graphs. A global variable is used to store the different options desird. Use the setGraphConfig in a script tag inside the
html generated. Make sure that your key for the setGraphConfig matches the key of it's corresponding display container. */
(function($){
  if (typeof _vt == "undefined") { window._vt = {}; }
  if (typeof _vt.config == "undefined") { window._vt.config = {}; }
  
  window.setGraphConfig = function setGraphConfig(key, value) {
    _vt.config[key] = value;
  };
  
  window.getGraphConfig = function getGraphConfig(key) {
    return typeof _vt.config[key] == "undefined" ? {} : _vt.config[key];
  }
})(jQuery);


jQuery(function($){
  var $mainContentCont = $('#column1').addClass('main_content_container'),
      /* Changing this token WILL NOT change the actual token parsed for. Simply here to show you what token to use */
      token = '${number}',
      countSteps = 35,
      countSpeed = 50,
      hasActiveMenu = false,
      keydownSequence = '',
      refreshKeySequence = '',
      $indicator = $('<div class="time_indicator"></div>').appendTo('#footer'),
      cssDisplaySpeed = parseTransitionSpeed($indicator),
      setDisplaySpeed = 10000,
      maxContentHeight = 1010,
      cachingTime = 60, /* Please enter minutes to cache here. Correct time is calculated later */
      newsItemLimit = 10,
      emptyDataPush = {
        "columnTypes": [],
        "columnTitles": [],
        "rows": []
      },
      menuInitialized = false,
      menuConts = [],
      results,
      menuCycle;
  
  function parseTransitionSpeed($target){
    var speed = $target.css('transition-duration'),
        num = parseFloat(speed),
        properNum = num*1000;
    
    return properNum;
    
  }
  
  function numberParse(data){
    $.each(data.rows, function(rowIdx, row) {
      $.each(data.columnTypes, function(idx, type) {
        if (type == 'number') {
          data.rows[rowIdx][idx] = parseInt(data.rows[rowIdx][idx]);
        }
      });    
    });
    
    return data.rows;
    
  }
  
  function dateParse(data){
    $.each(data.rows, function(rowIdx, row) {
      $.each(data.columnTypes, function(idx, type) {
        if (type == 'date') {
          data.rows[rowIdx][idx] = moment(data.rows[rowIdx][idx],"YYYY-MM-DD").toDate();
        }
      });
    });
    
    return data.rows;
    
  }
  
  function stateParse(data){
    var usIdxs = [];
    $.each(data.rows, function(rowIdx, row) {
      if(row[0] == "US"){
        usIdxs.push(rowIdx);
      }
    });
    
    $.each(usIdxs, function(idx, usIdx){
      data.rows.splice(usIdx, 1);
    });
  }
  
  function annotateRows(rows){
    var size = rows[0].length;
    
    if(parseInt(rows[0][size-1]) != parseInt(rows[0][size-2])){
      $.each(rows, function(rowIdx, row){
        row.push(row[size-1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        
      });
    }
    
    return rows;
    
  }
  
  function addDateTicks(rows) {
    var ticks = [];
    
    $.each(rows, function(rowIdx, row){
      ticks.push(row[0].format('ddd, DD YY'));
    });
  }
  
  var addData = function(data, newData){
    var lastIdx = $(data.columnTypes).length,
        newDataGrabIdx = 1;
    
    if(lastIdx <= 0){
      
      $.each(newData.columnTypes, function(colIdx, colType){
        data.columnTypes.push(colType);
        
      });
      
      $.each(newData.columnTitles, function(colIdx, colTitle){
        data.columnTitles.push(colTitle);
        
      });
      
      $.each(newData.rows, function(rowIdx, row){
        data.rows.push([row[0],row[1]]);
      });
      
    }else {
      data.columnTypes.push(newData.columnTypes[newDataGrabIdx]);
      data.columnTitles.push(newData.columnTitles[newDataGrabIdx]);
      
      $.each(data.rows, function(rowIdx, row){
        row.push(newData.rows[rowIdx][newDataGrabIdx]);
        
      });
      
    }
    
    return data;
  
  };
  
  var limitNews = function(newsCont){    
    //Loops through all the news items and adds a hidden class to the ones not needing to be shown
    $.each($(newsCont).children('span.bc_item'),function(newsIdx, newsItem){
      if(newsIdx > newsItemLimit){
        newsItem.addClass('hidden');        
      }
      
    });
    
  };
  
  /* Draws a line graph based on the data, container, and options provided. Options aren't necissary */
  function drawLine(data, container, options){
    var tableData = new google.visualization.DataTable();
    
    if(data.columnTypes.length == data.columnTitles.length){
      for(var i=0; i<data.columnTypes.length; i++){
        tableData.addColumn(data.columnTypes[i],data.columnTitles[i]);
      }
    }else {
      console.log('Error, miss-matching column sizes');
      return;
    }
    
    //Checks if the options want annotation and if annotation has already been done
    if(options.annotate){
      tableData.addColumn({type: "string", role: "annotation"});
      data.rows = annotateRows(data.rows);
    }
      
    if(data.rows.length){
      tableData.addRows(data.rows);
    }
    
    var chart = new google.visualization.LineChart(container);
    
    if($(options).length){
      chart.draw(tableData, options);
    }else {
      chart.draw(tableData);
    }
    
  }
  
  /* Draws a pie chart based on the data, container, and options provided. Options aren't necissary */
  function drawPie(data, container, options){
    var tableData = new google.visualization.DataTable();
    
    if(data.columnTypes.length == data.columnTitles.length){
      for(var i=0; i<data.columnTypes.length; i++){
        tableData.addColumn(data.columnTypes[i],data.columnTitles[i]);
      }
    }else {
      console.log('Error, miss-matching column sizes');
      return;
    }
    
    if(data.rows.length){
      tableData.addRows(data.rows);
    }
    
    var chart = new google.visualization.PieChart(container);
    
    if($(options).length){
      chart.draw(tableData, options);
    }else {
      chart.draw(tableData);
    }
    
  }
  
  /* Draws a area graph based on the data, container, and options provided. Options aren't necissary */
  function drawArea(data, container, options){
    var tableData = new google.visualization.DataTable();
    
    if(data.columnTypes.length == data.columnTitles.length){
      for(var i=0; i<data.columnTypes.length; i++){
        tableData.addColumn(data.columnTypes[i],data.columnTitles[i]);
      }
    }else {
      console.log('Error, miss-matching column sizes');
      return;
    }
    
    if(data.rows.length){
      tableData.addRows(data.rows);
    }
    
    var chart = new google.visualization.AreaChart(container);
    
    if($(options).length){
      chart.draw(tableData, options);
    }else {
      chart.draw(tableData);
    }
    
  }
  
  /* Draws a geo graph based on the data, container, and options provided. Options aren't necissary */
  function drawGeo(data, container, options){
    var tableData = new google.visualization.DataTable();
    
    if(data.columnTypes.length == data.columnTitles.length){
      for(var i=0; i<data.columnTypes.length; i++){
        tableData.addColumn(data.columnTypes[i],data.columnTitles[i]);
      }
    }else {
      console.log('Error, miss-matching column sizes');
      return;
    }
    
    if(data.rows.length){
      tableData.addRows(data.rows);
    }
    
    var chart = new google.visualization.GeoChart(container);
    
    if($(options).length){
      chart.draw(tableData, options);
    }else {
      chart.draw(tableData);
    }
    
  }
  
  /* Draws a column graph based on the data, container, and options provided. Options aren't necissary */
  function drawColumn(data, container, options){
    var tableData = new google.visualization.DataTable();
    
    if(data.columnTypes.length == data.columnTitles.length){
      for(var i=0; i<data.columnTypes.length; i++){
        tableData.addColumn(data.columnTypes[i],data.columnTitles[i]);
      }
    }else {
      console.log('Error, miss-matching column sizes');
      return;
    }
    
    if(options.annotate){
      tableData.addColumn({type: "string", role: "annotation"});
      data.rows = annotateRows(data.rows);
    }
    
    if(data.rows.length){
      tableData.addRows(data.rows);
    }
    
    var chart = new google.visualization.ColumnChart(container);
    
    //var ticks = {hAxis: {ticks: []}};
        
    /*$.each(data.rows, function(rowIdx, row){
      ticks.hAxis.ticks.push(row[0]);
      
    });*/
    
    if($(options).length){
      chart.draw(tableData, options);
    }else {
      chart.draw(tableData);
    }
    
  }
  
  /* Determines which type of graph should be displayed, and also parses out data types */
  function renderGraphData(type, data, container, options) {
    
    if(parseInt(data.rows[0][data.rows[0].length-1]) != parseInt(data.rows[0][data.rows[0].length-2])){
    
    //Changes the data rows to the correct data types
    for(var i=0; i<data.columnTypes.length; i++){
      switch (data.columnTypes[i]){
          
        case "number":
          data.rows = numberParse(data);
          break;
          
        case "date":
          data.rows = dateParse(data);
          break;
          
      }
    }
    
    for(var i=0; i<data.columnTitles.length; i++){
      switch (data.columnTitles[i]){
          
        case "State":
          stateParse(data);
          break;
          
      }
    }
        
    }
        
    
    /* Graph determination */
    switch (type) {
        
      case "line":
        google.load('visualization', '1', {callback: function(){
          drawLine(data, container, options);
          
        }, packages:['corechart']});
        break;
        
      case "pie":
        google.load('visualization', '1', {callback: function(){
          drawPie(data, container, options);
          
        }, packages:['corechart']});
        break;
        
      case "area":
        google.load('visualization', '1', {callback: function(){
          drawArea(data, container, options);
          
        }, packages:['corechart']});
        break;
        
      case "geo":
        google.load('visualization', '1', {callback: function(){
          drawGeo(data, container, options);
          
        }, packages:['geochart']});
        break;
        
      case "column":
        google.load('visualization', '1', {callback: function(){
          drawColumn(data, container, options);
          
        }, packages:['corechart']});    
        break;
    }
  }
  
  /* Determines which data will be used in drawing the graph */
  var drawGraph = function(){
    $('.content_container.active .graph_container .graph').each(function(){
      var $graph = $(this);
      var type = $graph.data('type');
      var key = $graph.data('key');
      var data;
      var options = window.getGraphConfig(key);
      
      if(!$graph.children('div').length){
        
        switch(key) {
            
          case "venturetech_pageviews":
            data = emptyDataPush;
            data = addData(data, results.vipasuite_pageviews.data);
            data = addData(data, results.pitchburner_pageviews.data);
            data = addData(data, results.providertrust_pageviews.data);
            renderGraphData(type, data, this, options);
            break;
           
          default:
            data = results[key].data;
            renderGraphData(type, data, this, options);
            break;
            
        }
        
      }else {
        //do Nothing                  
      }
      
    });
    
  };
  
  /* This will count up to the number in the count data-attribute. countSteps controls how far back the count begins */
  var countUp = function(counts){
    $(counts).each(function(){
      var $dispNum = $(this).find('.count'),
          finish = $dispNum.data('count'),
          start = finish - countSteps;
      
      if(start < 0){
        start = 2;
      }
      
      var currCount = $dispNum.html(start.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      
      var countInterval = setInterval(function(){
        currCount = parseInt($dispNum.html().replace(',', ''));
        
        if(currCount < finish){
          $dispNum.html((++currCount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }else {
          clearInterval(countInterval);
        }
      
      },countSpeed);
    
    });
    
  };
  
  /* Searches the current active graph container for any count up fields */
  var displayCount = function(){
    $('.content_container.active .graph_container script.template').each(function(){
      
      /* This means that the count ups have already been constructed */
      if($(this).siblings('div.template').length == $('.content_container.active .graph_container script.template').length){
        //Do nothing
        
      }else {
        
        var $template = $(this),
            temp = $template.data('template'),
            text = $template.html(),
            data;
        
        /* Determines what data should be used */
        switch(temp) {
            
          case "vipasuite_data_submissions":
            data = results.vipasuite_data_submissions;
            break;
            
          case "vipasuite_accounts":
            data = results.vipasuite_accounts;
            break;
            
          case "pitchburner_live_events":
            data = results.pitchburner_live_events;
            break;
           
          case "pitchburner_events":
            data = results.pitchburner_events;
            break; 
            
          case "providertrust_facilities":
            data = results.providertrust_facilities;
            break;
            
          case "providertrust_people_monitored":
            data = results.providertrust_people_monitored;
            break;
            
          case "providertrust_vendors_monitored":
            data = results.providertrust_vendors_monitored;
            break;
            
        }
        
        /* Finds the token ${number} and replaces it with the span that will be used to count in */
        text = text.replace(/(\$\{number\})/,'<span class="count" data-count="'+ data[0] +'"></span>');
        $template.parent().prepend('<div class="template">'+text+'</div>');
        
      }
      
      //Count up
      countUp($(this).siblings('div.template'));
      
    });
    
  };
  
  /* Cycles the menu*/
  var cycleMenu = function(){
    var $currMenu = $('.aside .dashboard_nav .mi.active'),
        $fullMenu = $('.aside .dashboard_nav .mi'),
        $activeMenu = $('.aside .dashboard_nav .mi_active'),
        idx = $currMenu.index();
    
    $currMenu.removeClass('active');
      
    if($activeMenu.length && !hasActiveMenu){
      $currMenu = $($activeMenu[0]).addClass('active');
      hasActiveMenu = true;
      
    }else {
      
      if(!$currMenu.length || $fullMenu.length-1 <= idx){
        $currMenu = $($fullMenu[0]).addClass('active');
        
      }else {
        $currMenu = $($fullMenu[++idx]).addClass('active');
        
      }
      
    }
    
    $currMenu.find('a').click();
    
  };
  
  var slideUpContent = function(overflow,offset,$contentCont){
    $indicator.removeClass('active');
    if(overflow > maxContentHeight){
      offset += maxContentHeight;
    }else {
      offset += overflow;
    }
    
    $contentCont.css('bottom',offset);
    
    var wait = setTimeout(function(){
      changeMenu($contentCont);
    },5000);
    
  };
  
  var changeMenu = function($contentCont){
    $indicator.addClass('active');
    
    //Cycle menu
    menuCycle = setTimeout(function(){
      var offset = parseInt($contentCont.css('bottom')),
          height = $contentCont.outerHeight(),
          overflow = height - offset - maxContentHeight;
      
      if(overflow <= 30){
        cycleMenu();
      }else {
        slideUpContent(overflow,offset,$contentCont);
      }
    },cssDisplaySpeed);
    
  };
  
  //This is a menu object that is used to help initiate and contain the content to display for each menu item
  var MenuContainer = function(target){
    
    var $menuItem = $(target),
        $link = $menuItem.find('a.menuitemlabel'),
        $parent = $link.parent('li.mi'),
        $allLinks = $('.dashboard_nav li.mi'),
        initialized = false,
        $contentCont = $('<div class="content_container"></div>'),
        $content = $(''),
        isNews = false,
        contentType;
    
    this.clearContent = function(){
      if($content.length){
        $content.remove();
        initialized = false;
      }
    };
    
    var clearOffset = function(){
      $contentCont.css('bottom',0);
    };
    
    $link.click(function(event){
      event.preventDefault();
      clearTimeout(menuCycle);
      
      $allLinks.removeClass('active');
      $parent.addClass('active');
      $indicator.removeClass('active');
      $mainContentCont.removeClass('stopped');
      
      $('.content_column .content_container').removeClass('active');
      
      //Had to create a slight timeout so that the time indicator could reset
      var delay = setTimeout(function(){
        //Determines if it already has content, or needs to grab it
        if($menuItem.hasClass('mi_active') && !initialized){
          $contentCont = $('<div class="content_container active"></div>').append($('.content_column').children());
          $('.content_column').append($contentCont);
          drawGraph();
          displayCount();
          changeMenu($contentCont);
          initialized = true;
          
        }else if (!initialized){
          var href = $link.attr('href'),
              partial = '/partial' + href + '/FdxbQVIpg24000,bx15203,bx15182',        
              request = $.get(partial,function(data, status){
                
                var polling = setInterval(function(){
                  if(status == 'success'){
                    $content = $(data);
                    $contentCont.append($content);
                    $mainContentCont.append($contentCont);
                    
                    $contentCont.addClass('active');
                    
                    if(href == '/news'){
                      isNews = true;
                      
                      var pollNews = setInterval(function(){
                        if($('div.world_news').length && $('div.local_news').length){
                          
                        }
                        
                      },500);
                      
                    }
                    contentType = /[^\/]+/.exec(href.replace('/dashboard',''))[0];
                    $contentCont.addClass(contentType);
                    
                    // Event pertaining to the contentType, main use is for Kudos egg but could potentially be used elsewhere
                    var event = new Event(contentType+'-Loaded');
                    
                    // Dispatch the event.
                    window.dispatchEvent(event);
                    
                    drawGraph();
                    displayCount();
                    changeMenu($contentCont);
                    clearTimeout(polling);
                  }
                },500);
                
              });
          
          initialized = true;
          
        }else {
          clearOffset();
          $contentCont.addClass('active');
          displayCount();
          changeMenu($contentCont);
          
        }
        
      },250);
      
    });
    
    /*
    return {
      foo: bar
    };*/
    
  };
  
  /*
  MenuComponent.prototype.fooburger = function(){
    
    
  };*/
    
  
  var toggleActive = function(){
    $mainContentCont.toggleClass('stopped');
    
    if($indicator.hasClass('active')){
      clearTimeout(menuCycle);
      $indicator.removeClass('active');
      console.log('Paused');
    }else {
      $('.aside .dashboard_nav .mi.active a').click();
      console.log('Playing');
    }
    
  };
  
  /* Listens for pattern to stop the rotation */
  $(document).keydown(function(evt){
    var keyCode = evt.keyCode;
    
    switch(keyCode){
        
      // Space bar
      case 32:
        toggleActive();
        break;
        
    }
    
    /* Removed the old sequences for stopping/refreshing the dashboard
       Version 29 has the old sequences */
    
  });
  
  //Grabs feed data 15 minutes after noon each day since that's when the data is updated
  var refreshFeedData = function(){
    var startTime = moment(),
        refreshTime = moment().hour(12).minute(30).second(00),
        timeLeft = refreshTime.diff(startTime);
    
    if(timeLeft < 0){
      var today = refreshTime.date(),
          tomorrow = today += 1;
      refreshTime.date(tomorrow);
      timeLeft = refreshTime.diff(startTime);
    }
    
    var feedTimeout = setTimeout(function(){
      getData();
      
    },timeLeft);
  };
  
  //Used to create the menu container objects and attaches the click handlers
  var initializeMenu = function(){
    $('.dashboard_nav li.mi').each(function(){
      menuConts.push(new MenuContainer(this));
    });
    menuInitialized = true;
    
    //Initiate menu
    cycleMenu();
    
  };
  
  //Gets data from the json file
  var getData = function(){
    $.getJSON('/dashboard.json',function(data){
      results = data.data_feed;
      refreshFeedData();
      if(!menuInitialized){
        initializeMenu();
      }
        
    });
    
  };
  
  //Countdown to clearing the data cache
  var clearCache = function(){
    clearInterval(cacheClear);
    
    var cacheClear = setInterval(function(){
      toggleActive();
      
      $.each(menuConts, function(idx, menuContainer){
        menuContainer.clearContent();
        
      });
      
      toggleActive();
      console.log('The data cache for content has been cleared');
      
    },(10000));
  };
  
  //Get data
  getData();
  //clearCache();
  
});