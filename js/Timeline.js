var Timeline = function() {
    this._virtualCursor = 0;
    this._lastPosition = 0;
    this._targetPosition = 0;
    this._selected = undefined;
    this._width = 8192;
    this._elementWidth = 800;
    this._lastTime;
};

Timeline.prototype = {

    clampMotion: function(value) {
        var v = value;
        v = Math.min(this._width, v);
        v = Math.max(0, v);
        return v;
    },

    leapGetPosition: function(frame) {
        var t = new Date().getTime();
        if (!this._lastTime) {
            this._lastTime = t;
        }
        var dt = t-this._lastTime;
        this._lastTime = t;

        var deltaFrame = previousFrame.translation(frame);

        var motion = deltaFrame[0]*dt;
        this._targetPosition += motion;
        this._targetPosition = this.clampMotion(this._targetPosition);

        // we should take care about the page size for the smooth stop of the scroll
        var displacement = (this._targetPosition - this._virtualCursor) * dt/500.0;
        this._virtualCursor += displacement;
        
        this._virtualCursor = this.clampMotion(this._virtualCursor);
    },

    selectCurrentItem: function() {
        var element = $('.selected');

        if (element.length > 0) {
            console.log("selected " + element[0]);
        } else {
            console.log("nothing selected");
        }

        AppState.EntryView.init(element.attr('data-id'));
        AppState.switchMode('EntryView');

        leapAndTime.getObject(element.attr('data-id'), element.attr('data-type'));
    },

    timelineSelectItem: function(frame) {
        var gestures = frame.gestures;
        var displayGesture = '';
        if (gestures.length > 0 ) {
            for (var i = 0; i < gestures.length; i++) {
                //console.log(gestures[i].type);
                var type = gestures[i].type;
                if (type === "keyTap" || type === "screenTap") {
                    this.selectCurrentItem();
                    break;
                } else if (type === "swipe") {
                    console.log("swipe " + gestures[i].direction);
                }
            }
        }
    },

    render: function() {
        if (Math.abs(this._targetPosition - this._virtualCursor) > 0.001) {

            // used to select an element
            var center = window.innerWidth/2;

            var selected = (this._virtualCursor+center)/this._elementWidth;
            selected = Math.floor(selected);
            
            var elements = $(".timeline-element");
            elements.removeClass('selected');
            $(elements[selected]).addClass('selected');

            $('html, body').scrollLeft(this._virtualCursor);
        }
    },

    update: function(frame) {
        this.leapGetPosition(frame);
        this.timelineSelectItem(frame);
    }
};
