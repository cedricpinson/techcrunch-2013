// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var viewMode = 'timeline';
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
var elementWidth = 800;

$(document).ready(function() {
    var nb = 25;
    width = nb*elementWidth;
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

var selectCurrentItem = function() {
    var element = $('.selected');

    if (element.length > 0) {
        console.log("selected " + element[0]);
    } else {
        console.log("nothing selected");
    }

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


var timelineSelectItem = function(frame) {
    var gestures = frame.gestures;
    var displayGesture = '';
    if (gestures.length > 0 ) {
        for (var i = 0; i < gestures.length; i++) {
            //console.log(gestures[i].type);
            console.log(gestures[i].type);
            var type = gestures[i].type;
            if (type === "keyTap" || type === "screenTap") {
                selectCurrentItem();
                break;
            }
        }
    }
};


var controller = new Leap.Controller({enableGestures: 'swipe'});
controller.loop(function(frame) {
    if (!previousFrame)
        previousFrame = frame;
        
    if (frame.valid) {
        if (viewMode === 'timeline') {
            leapGetPosition(frame);
            timelineSelectItem(frame);
        }


        previousFrame = frame;
    }
});

// usage:
// instead of setInterval(render, 16) ....
var render = function() {

    if (viewMode === 'timeline') {

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
    }
};


(function animloop(){
  requestAnimFrame(animloop);
  render();
})();
