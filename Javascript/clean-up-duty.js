jQuery(function($){
  
  var $kudos_info,
      $cont,
      $employeeLegend,
      $colorWheel,
      employee = [
        "Matt",
        "Scott",
        "Michael",
        "Joe",
        "Lana",
        "Irina",
        "Suzanne",
        "Conner",
        "Ying",
        "Ken",
        "Justin",
        "Taka",
        "Todd",
        "Muhlin",
        "Russ",
        "Josh",
        "Dao",
        "Tyler",
        "Aprille",
        "Andrew",
        "Kaitlyn"
      ],
      arcLength,
      colorIdx = 0,
      stage,
      employeeIdx = 0,
      curRotation = 0,
      spun = false,
      nextSet = [],
      currSet = [],
      initialized = false,
      currRound;
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function addSlice(){
    var layer = new Kinetic.Layer(),
        color = getRandomColor();
    
    //$employeeLegend.append('<div class="employee"><span class="color_preview" style="background-color:'+color+';"></span><span class="employee">'+employee[employeeIdx]+'</span></div>');
    
    var employee = currSet[employeeIdx];
    
    var $employee = $('<div class="employee">'+employee+'</div>');
    var rotation = arcLength*employeeIdx++;
    
    $employeeLegend.append($employee);
    $employee.css({
      'transform':'rotate('+(rotation+(arcLength/2))+'deg)',
      '-webkit-transform':'rotate('+(rotation+(arcLength/2))+'deg)'
    });
    
    var wedge = new Kinetic.Wedge({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 250,
      angle: arcLength,
      fill: color,
      strokeWidth: 4,
      rotation: rotation
    });
    
    // add the shape to the layer
    layer.add(wedge);
    
    // add the layer to the stage
    stage.add(layer);
    
  }
  
  function constructPerson(name){
    
    var roundInfo = '{"currRound":'+currRound+'}';
    
    localStorage.setItem(name,roundInfo);
    
  }
  
  function buildSets(){
    var localRound = localStorage.getItem("Round");
    
    if(localRound == null || localRound <= 0){
      currRound = 1;
      localStorage.setItem("Round","1");
    }else {
      currRound = localRound;
    }
    
    $.each(employee,function(idx){
      
      var info = localStorage.getItem(this);
      
      if(info == null){
        constructPerson(this);
        currSet.push(this);
      }else {
        var roundInfo = JSON.parse(info),
            round = parseInt(roundInfo.currRound);
        
        if(round > currRound){
          nextSet.push(this);
        }else {
          currSet.push(this);
        }
        
      }
      
    });
    
    arcLength = 360/currSet.length;
    
  }
  
  function resetCanvas(){
    stage.clear();
    $employeeLegend.empty();
    employeeIdx = 0;
    curRotation = 0;
    
    $('.container').addClass('clear');
    
    $employeeLegend.css({
      'transform':'rotate(0deg)',
      '-webkit-transform':'rotate(0deg)'
    });
    
    $colorWheel.css({
      'transform':'rotate(0deg)',
      '-webkit-transform':'rotate(0deg)'
    });
    
    setTimeout(function(){
      $('.container').removeClass('clear');    
    },500);
  }
  
  function addSlices() {
    $.each(currSet,function(){
      addSlice();      
    });
  }
  
  function choosePeople(callback){
    var ridx,
        name;
    
    if(currSet.length > 0){
      ridx = Math.floor(Math.random()*currSet.length);
    }else{
      ridx = Math.floor(Math.random()*nextSet.length);
    }
    spinTo(ridx);
    name = currSet[currSet.length-ridx-1];
    
    console.log(name);
    
    if(currSet.length > 0){
      name = currSet.splice(currSet.length-ridx-1,1);
    }else {
      name = nextSet.splice(currSet.length-ridx-1,1);
      currRound ++;
      localStorage.setItem("Round",currRound.toString());
    }
    
    var nxtRnd = parseInt(currRound)+1;
    localStorage.setItem(name.toString(),'{"currRound":'+nxtRnd+'}');
    
    callback();
    
  }
  
  function init(){
    if (Modernizr.localstorage) {
      //localStorage.clear();
      initialized = true;
      
      $cont = $('<div class="container"><div class="pointer_cont"><div class="pointer"></div></div></div>').addClass('hide');
      $employeeLegend = $('<div class="employee_legend"></div>');
      $colorWheel = $('<div id="target_container"></div>');
      var $closeBtn = $('<div class="close">X</div>');
      
      $('body').append($cont);
      $cont.append($colorWheel).append($employeeLegend).append($closeBtn);
      
      stage = new Kinetic.Stage({
        container: 'target_container',
        width: 500,
        height: 500
      });
      
      $kudos_info = $('.kudos_info');
      
      var $btnCont = $("<div class='btn_cont'></div>").appendTo($('.kudos_info'));
      /* Checks to make sure that the button doesn't already exist */
      if(!$('.lunch.btn').length){
        var $spinCont = $btnCont.clone().appendTo($cont);
        var $btn = $("<span class='lunch btn'>Clean Up Duty</span>").appendTo($btnCont);
        var $spinBtn = $("<span class='spin btn'>Spin</span>").appendTo($spinCont);
        var $resetBtn = $("<span class='reset btn'>Reset</span>").appendTo($spinCont).addClass('hide');
        
        buildSets();
        addSlices();
        $btn.on('click',function(){
          
          $cont.removeClass('hide');
          $('div.page').addClass('fade');
          if(spun){
            $resetBtn.removeClass('hide');
          }else {
            $spinBtn.removeClass('hide');
          }
          
        });
        
        $spinCont.on('click','.spin',function(){
          choosePeople(function(){
            
            $spinBtn.addClass('hide');
            $resetBtn.removeClass('hide');
            currSet = [];
            nextSet = [];
            buildSets();
            
          });
          spun = true;
        });
        
        $spinCont.on('click','.reset',function(){
          $spinBtn.removeClass('hide');
          $resetBtn.addClass('hide');
          resetCanvas();
          addSlices();
          spun = false;
        });
        
      }
      
      $closeBtn.click(function(){
        $cont.addClass('hide');
        $('div.page').removeClass('fade');
      });
      
    } else {
      console.log("Why you use old browser!?");
    }
  }
  
  $('.dashboard_nav .mi.kudos').on('click','a',function(){
    window.addEventListener('kudos-Loaded',function(){
      init();
    },false);
  });
  
  function spinTo(idx){
    
    var rotateTo = curRotation + idx * arcLength +720;
    
    rotateTo += (arcLength/4);
    
    $employeeLegend.css({
      'transform':'rotate('+(rotateTo)+'deg)',
      '-webkit-transform':'rotate('+(rotateTo)+'deg)'
    });
    
    $colorWheel.css({
      'transform':'rotate('+(rotateTo)+'deg)',
      '-webkit-transform':'rotate('+(rotateTo)+'deg)'
    });
    
    curRotation = rotateTo;
    
  }
  
  //$.each(employee,addSlice);
  
});
