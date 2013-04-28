var Entry = function() {
    this._radiusShare = 80;
    this._likeDelta = 6;
    this._liked = false;
    this._shared = false;
};

Entry.prototype = {
    init: function(content) {
        
    },

    render: function() {

    },

    share: function(txt) {
        //this._shared = true;
        console.log("share " + txt);
    },

    like: function(txt) {
        //this._liked = true;
        console.log("like " + txt);
    },

    goBack: function() {
        AppState.switchMode('TimelineView');
    },

    checkGestures: function(frame) {

        var deltaFrame = previousFrame.translation(frame);

        // do not check if already liked
        if ( !this._liked ) {
            if (deltaFrame[1] < -this._likeDelta && frame.fingers.length === 0) {
                this.like(deltaFrame);
                return;
            }
        }

        if (!this._shared) {
            var gestures = frame.gestures;
            var displayGesture = '';
            if (gestures.length > 0 ) {
                for (var i = 0; i < gestures.length; i++) {
                    //console.log(gestures[i].type);
                    //console.log(gestures[i].type);
                    var type = gestures[i].type;
                    if (type === "circle" && gestures[i].radius > this._radiusShare) {
                        this.share(gestures[i].radius);
                    } else if (type === "keyTap" || type === "screenTap") {
                        this.goBack();
                        return;
                    }
                }
            }
        }
    },
    
    update: function(frame) {
        this.checkGestures(frame);
    }
};
