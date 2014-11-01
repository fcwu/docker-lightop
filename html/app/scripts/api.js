/* ===== Backend API ===== */

var api = {};

// login: user login
api.login = function(username, password, session, callback) {
  $.ajax({
    url: '/login',
    type: 'POST',
    data: {
      'username': username,
      'password': password
    }
  })
    .done(function(result) {
      json = JSON.parse(result);
      //console.info(json);

      callback({
        'session': session,
        'user': json,
        'error': json.error
      });
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}

// login: get session list
api.session_list = function(callback) {
  $.ajax({
      url: '/session',
      type: 'GET'
  })
    .done(function(response) {
      var session_list = [];

      json = JSON.parse(response);
      //console.info(json);

      $.each(json, function(idx, session) {
        session_list.push({
          'name': session,
          'value': session
        });
      });

      callback(session_list);
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}

// account: get user list
api.user_list = function(callback) {
  $.ajax({
      url: '/user/',
      type: 'GET'
  })
    .done(function(response) {
      var user_list = [];

      json = JSON.parse(response);
      //console.info(json);

      $.each(json, function(idx, user) {
        user_list.push({
          'id': user.id,
          'name': user.name,
          'volume': user.volume
        });
      });

      callback(user_list);
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}

// account: add user
api.user_add = function(username, password, callback) {
  $.ajax({
      url: '/user/',
      type: 'POST',
      data: {
        'username': username,
        'password': password
      }
  })
    .done(function(response) {
      json = JSON.parse(response);
      //console.info(json);

      callback();
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}

// account: delete user
api.user_delete = function(id, callback) {
  $.ajax({
      url: '/user/' + id,
      type: 'DELETE'
  })
    .done(function(response) {
      json = JSON.parse(response);
      //console.info(json);

      callback();
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}

// container: get container list
api.container_list = function(callback) {
  $.ajax({
      url: '/container/',
      type: 'GET'
  })
    .done(function(response) {
      var container_list = [];

      json = JSON.parse(response);
      //console.info(json);

      $.each(json, function(idx, container) {
        container_list.push({
          'id': container.id,
          'session': container.session,
          'owner': container.owner
        });
      });

      callback(container_list);
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}

// account: delete container
api.container_delete = function(id, callback) {
  $.ajax({
      url: '/container/' + id,
      type: 'DELETE'
  })
    .done(function(response) {
      json = JSON.parse(response);
      //console.info(json);

      callback();
    })
    .fail(function(response) {
      console.info(response.status + ': ' + response.statusText);
    });
}