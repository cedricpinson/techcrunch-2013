var Entry = function() {
    this._radiusShare = 80;
    this._likeDelta = 6;
    this._liked = false;
    this._shared = false;
};

Entry.prototype = {
    init: function(content) {
        $('#right-part').empty();
        var nbComments = 5;
        for (var i = 0; i < nbComments; i++) {
            var url = 'data/pp.jpg';
            var com = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam posuere massa in quam fermentum volutpat";
            $("#right-part").append(this.createElement(url, com));
        }

        var mediaURL = 'data/11.jpg';
        var post = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam posuere massa in quam fermentum volutpat";
        $('#media').empty();
        //$('#media').append('<div style="background-image: url('+ mediaURL + ')"></div>');
        $('#media').append('<img src="'+ mediaURL + '">');
        $('#post').empty();
        $('#post').append("<p>"+post+"</p>");
    },

    render: function() {

    },

    createElement: function(avatar, comment) {
        var entry = "<div class='comment-entry'><div class='comment-avatar'> <img src='"+ avatar + "'></div><div class='comment'>"+ comment + "</div></div>";
        return entry;
    },

    share: function(txt) {
        $('.overlay').text('share');
        $('.overlay').show();
        $('.overlay').fadeOut(1000); //, 'easeInOutCubic');
        this._shared = true;
        console.log("share " + txt);
    },

    like: function(txt) {
        $('.overlay').text('like');
        $('.overlay').show();
        $('.overlay').fadeOut(1000); //, 'easeInOutCubic');
        this._liked = true;
        // console.log("like " + txt);
        leapAndTime.like();
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
