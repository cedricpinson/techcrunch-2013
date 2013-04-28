// Facebook
// ========

var leapAndTime = {};

// Facebook Login
// --------------
leapAndTime.login = function login() {
  var self = this;

  FB.login(function (res) {
    if (res.authResponse) {
      // connected
      self.getStream();
    } else {
      // TODO: cancelled
    }
  }, { scope: 'read_stream,publish_stream,publish_actions,share_item' });
};

// Get data from Facebook
// ----------------------
leapAndTime.getStream = function getStream() {
  FB.api('/me/home', function (res) {
    console.log(res.data);

    // Get individual user profile picture
    // /uid?fields=id,picture
  });
};

// Facebook Login
// --------------
window.fbAsyncInit = function() {
  FB.init({
    appId      : '250556575082188', // App ID
    channelUrl : '//leapandtime.com/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // Additional init code here
  FB.getLoginStatus(function (res) {
    if (res.status === 'connected') {
      // connected
      leapAndTime.getStream();
    } else if (res.status === 'not_authorized') {
      // not_authorized
      leapAndTime.login();
    } else {
      // not_logged_in
      leapAndTime.login();
    }
  });
};

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));
