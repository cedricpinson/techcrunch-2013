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
        if (this[this.ViewMode] && this[this.ViewMode].update)
            this[this.ViewMode].update(frame);
    },
    render: function() {
        if (this[this.ViewMode] && this[this.ViewMode].render)
            this[this.ViewMode].render();
    },
    switchMode: function(mode) {
        if (mode === this.ViewMode) {
            return;
        }
        var self = this;
        if (mode === 'EntryView') {
            setTimeout(function() {
                self.ViewMode = mode;
            },500);
            $('#timeline').fadeOut(500);
            $('#entry').fadeIn(500);
        } else if (mode === 'TimelineView') {
            setTimeout(function() {
                self.ViewMode = mode;
            },500);
            $('#timeline').fadeIn(500);
            $('#entry').fadeOut(500);
        }
        this.ViewMode = 'transition';
    }
};

var previousFrame = null;

var createItemElement;

$(document).ready(function() {


    createItemElement = function(id, type, media, imageAvatar, description) {
        return '<div class="timeline-element" data-id="' + id + '" data-type="' + type + '"><img src="' + media +'"><br>'+  '<div class="avatar"><img src="' + imageAvatar + '"></div> <div class="description">' + description + '</div></div>';
    };

    var elementWidth = 840;
    // initalize timeline
    AppState.TimelineView = new Timeline();
    AppState.EntryView = new Entry();

    var nb = 25;
    width = nb*elementWidth;
    $('#timeline').width(width);


    AppState.TimelineView._width = width;
    AppState.TimelineView._elementWidth = elementWidth;


    var controller = new Leap.Controller({enableGestures: 'swipe'});
    controller.on('ready', function() {
        window.LeapMotionReady = true;
        console.log('ready');
    });
    setTimeout(function() {
        // check leap motion is ok
        if (!window.LeapMotionReady) {
            console.log('leap motion not ready');
        }
    }, 1000);
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



