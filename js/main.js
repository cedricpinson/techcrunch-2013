// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var AppState = {
    ViewMode: 'TimelineView',
    TimelineView: undefined,
    EntryView: undefined,
    update: function(frame) {
        this[this.ViewMode].update(frame);
    },
    render: function() {
        this[this.ViewMode].render();
    },
    switchMode: function(mode) {
        if (mode === this.ViewMode) {
            return;
        }
        if (mode === 'EntryView') {
            this.ViewMode = mode;
            $('#timeline').hide();
            $('#entry').show();
        } else if (mode === 'TimelineView') {
            $('#timeline').show();
            $('#entry').hide();
        }
    }
};

var previousFrame = null;

$(document).ready(function() {

    var elementWidth = 800;
    // initalize timeline
    AppState.TimelineView = new Timeline();
    AppState.EntryView = new Entry();

    var nb = 25;
    width = nb*elementWidth;
    $('#timeline').width(width);
    for (var i = 0; i < nb; i++) {
        var number = Math.random();
        var color = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ", "+ Math.floor(Math.random()*255) + ");";
        $('#timeline').append('<div class="timeline-element"> </div>');
    }

    AppState.TimelineView._width = width;
    AppState.TimelineView._elementWidth = elementWidth;


    var controller = new Leap.Controller({enableGestures: 'swipe'});
    controller.loop(function(frame) {
        if (!previousFrame)
            previousFrame = frame;
        
        if (frame.valid) {
            AppState.update(frame);
            previousFrame = frame;
        }
    });

    // usage:
    // instead of setInterval(render, 16) ....
    var render = function() {

        AppState.render();

    };

    (function animloop(){
        requestAnimFrame(animloop);
        render();
    })();
    
});



