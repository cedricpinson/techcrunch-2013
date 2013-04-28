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

// Logout
// ------
leapAndTime.logout = function logout() {
  FB.logout(function(res) {
    console.log('User is now logged out');
  });
};

// Get data from Facebook
// ----------------------
leapAndTime.getStream = function getStream() {
  var self = this;

  FB.api('/me/home?fields=full_picture,object_id,picture,from,message', function (res) {
    var items = res.data
      , ids   = {}
      , batch = []
      ;

    // Get unique users
    items.forEach(function (item, index, array) {
      ids[item.from.id] = {
        method: 'GET',
        relative_url: item.from.id + '?fields=id,picture',
      };
    });

    // Build batch request data
    for (var prop in ids) {
      if (ids.hasOwnProperty(prop)) {
        batch.push(ids[prop]); 
      }
    }

    // Get user profile picture
    FB.api('/', 'post', { batch : batch }, function (res) {
      res.forEach(function (item, index, array) {
        var json;
        if (item.code === 200) {
          json = JSON.parse(item.body);
          ids[json.id] = json.picture.data.url;
        }
      });

      // Add picture URL to the returned items
      items.forEach(function (item, index, array) {
        item.from.url = ids[item.from.id];
        if (item.picture) {
          $('#timeline').append(createItemElement(item.full_picture, item.from.url, item.message));
        }
      });
      self.items = items;
    });
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
      // document.getElementById('fb-logout').style.display = 'block';
      leapAndTime.getStream();
    } else if (res.status === 'not_authorized') {
      // not_authorized
      leapAndTime.login();
    } else {
      // not_logged_in
      leapAndTime.login();
      // document.getElementById('fb-logout').style.display = 'block';
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
