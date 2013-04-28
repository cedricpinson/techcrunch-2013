var Timeline = function() {
    this._virtualCursor = 0;
    this._lastPosition = 0;
    this._targetPosition = 0;
    this._selected = undefined;
    this._width = 8192;
    this._elementWidth = 800;
};

Timeline.prototype = {

    clampMotion: function(value) {
        var v = value;
        v = Math.min(this._width, v);
        v = Math.max(0, v);
        return v;
    },

    leapGetPosition: function(frame) {
        var deltaFrame = previousFrame.translation(frame);

        //console.log(deltaFrame[1]);
        var motion = deltaFrame[0]*5.0;
        this._targetPosition += motion;
        this._targetPosition = this.clampMotion(this._targetPosition);

        // we should take care about the page size for the smooth stop of the scroll
        var displacement = (this._targetPosition - this._virtualCursor) * 0.05;
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

        AppState.switchMode('EntryView');

    },

    timelineSelectItem: function(frame) {
        var gestures = frame.gestures;
        var displayGesture = '';
        if (gestures.length > 0 ) {
            for (var i = 0; i < gestures.length; i++) {
                //console.log(gestures[i].type);
                console.log(gestures[i].type);
                var type = gestures[i].type;
                if (type === "keyTap" || type === "screenTap") {
                    this.selectCurrentItem();
                    //break;
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
