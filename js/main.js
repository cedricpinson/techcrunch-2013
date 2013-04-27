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


var clampMotion = function(value) {
    var v = value;
    v = Math.min(width, v);
    v = Math.max(0, v);
    return v;
};

var controller = new Leap.Controller({enableGestures: 'swipe'});
controller.loop(function(frame) {
    latestFrame = frame;
    var display = pausedFrame || latestFrame;
    var gestures = display.gestures;
    if (previousFrame === null) {
        previousFrame = frame;
    }

    if (frame.valid) {
        targetPosition = previousFrame.translation(frame)[0];
        //console.log(targetPosition);
        targetPosition = clampMotion(targetPosition);

        var displacement = (targetPosition*5 - virtualCursor) * 0.05;
        virtualCursor += displacement;

        virtualCursor = clampMotion(virtualCursor);

        if (virtualCursor >= width-1 || virtualCursor <= 1) {
            previousFrame = frame;
        } else {
            $('html, body').scrollLeft(virtualCursor);
        }
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
    //previousFrame = frame;
    document.getElementById('out').innerHTML = (pausedFrame ? "<p><b>PAUSED</b></p>" : "") + "<div>"+display.dump()+ "<br> " +displayGesture + "</div>";
});
