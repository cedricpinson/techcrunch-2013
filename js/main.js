// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var pausedFrame = null;
var latestFrame = null;
var previousFrame = null;
window.onkeypress = function(e) {
    if (e.charCode == 32) {
        if (pausedFrame === null) {
            pausedFrame = latestFrame;
        } else {
            pausedFrame = null;
        }
    }
};
var firstFrame = null;
var virtualCursor = 0;
var lastPosition = 0;
var targetPosition = 0;
var width = 8192;
var selected = undefined;
var elementWidth = 512;

$(document).ready(function() {
    var nb = 25;
    width = nb*512;
    $('#timeline').width(width);
    for (var i = 0; i < nb; i++) {
        var number = Math.random();
        var color = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ", "+ Math.floor(Math.random()*255) + ");";
        //$('#timeline').append('<div class="timeline-element" style="background-color:'+color+'"> </div>');
        $('#timeline').append('<div class="timeline-element"> </div>');
    }
});



var clampMotion = function(value) {
    var v = value;
    v = Math.min(width, v);
    v = Math.max(0, v);
    return v;
};

var leapSelectElement = function(frame) {
    
};

var leapGetPosition = function(frame) {
    if (!previousFrame) {
        previousFrame = frame;
    }
    var motion = previousFrame.translation(frame)[0]*5.0;
    targetPosition += motion;
    targetPosition = clampMotion(targetPosition);

    // we should take care about the page size for the smooth stop of the scroll

    var displacement = (targetPosition - virtualCursor) * 0.05;
    virtualCursor += displacement;
    
    virtualCursor = clampMotion(virtualCursor);
};

var controller = new Leap.Controller({enableGestures: 'swipe'});
controller.loop(function(frame) {
    latestFrame = frame;
    var display = pausedFrame || latestFrame;
    var gestures = display.gestures;

    if (frame.valid) {
        leapGetPosition(frame);
    }

    var displayGesture = '';
    if (gestures.length > 0 ) {
        for (var i = 0; i < gestures.length; i++) {
            //console.log(gestures[i].type);
            if (gestures[i].type === "swipe" && gestures[i].state === 'start') {
//                    
                //console.log(gestures[i].state);
//                debugger;
                console.log(gestures[i].id + " swipe " + gestures[i].speed + " " + gestures[i].direction[0]);
            }
        }
        //displayGesture = gestures[0];
    }
    previousFrame = frame;
    document.getElementById('out').innerHTML = (pausedFrame ? "<p><b>PAUSED</b></p>" : "") + "<div>"+display.dump()+ "<br> " +displayGesture + "</div>";
});

// usage:
// instead of setInterval(render, 16) ....
var render = function() {
    if (Math.abs(targetPosition - virtualCursor) > 0.001) {

        // used to select an element
        var center = window.innerWidth/2;
        

        var selected = (virtualCursor+center)/elementWidth;
        selected = Math.floor(selected);
        
        var elements = $(".timeline-element");
        elements.removeClass('selected');
        $(elements[selected]).addClass('selected');


        $('html, body').scrollLeft(virtualCursor);
    }
};


(function animloop(){
  requestAnimFrame(animloop);
  render();
})();
