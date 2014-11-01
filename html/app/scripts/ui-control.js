/* ===== UI Actions ===== */

var ui = {};

// ui: bind login session
ui.bind_login_session = function(session_list) {
  var session_data = '';

  session_list.push({
    'name': 'Admin Panel',
    'value': 'admin-panel'
  });

  if ($('#login-session').val() == '') {
    $('#login-session-name').text(session_list[0].name);
    $('#login-session').val(session_list[0].value);
  }

  $.each(session_list, function(idx, session) {
    session_data += '<li>';
    session_data += '<a href="#" data-value="' + session.value + '">'
    session_data += session.name;
    session_data += '</a>';
    session_data += '</li>';
  });

  $('.dropdown-menu').html(session_data);
}

// ui: bind user data
ui.bind_user_data = function(user_list) {
  var account_rows = '';

  $.each(user_list, function(idx, user) {
    account_rows += '<tr>';
    account_rows += '<td>' + user.id + '</td>';
    account_rows += '<td>' + user.name + '</td>';
    account_rows += '<td>' + user.volume.join('<br />') + '</td>';
    account_rows += '<td><button type="button" class="btn btn-default btn-remove-user">Remove</button></td>';
    account_rows += '</tr>';
  });

  $('#tbody-account').html(account_rows);

  $('button.btn-remove-user').on('click', null, ui.model_delete_user);
}

// ui: bind container data
ui.bind_container_data = function(container_list) {
  var container_rows = '';

  $.each(container_list, function(idx, container) {
    container_rows += '<tr>';
    container_rows += '<td>' + container.id + '</td>';
    container_rows += '<td>' + container.session + '</td>';
    container_rows += '<td>' + container.owner + '</td>';
    container_rows += '<td><button type="button" class="btn btn-default btn-remove-container">Remove</button></td>';
    container_rows += '</tr>';
  });

  $('#tbody-container').html(container_rows);

  $('button.btn-remove-container').on('click', null, ui.model_delete_container);
}

// ui: open delete user modal
ui.model_delete_user = function() {
  var dom_selector = $(this).closest('td').prev('td').prev('td');

  var user_id = dom_selector.prev('td').text();
  var username = dom_selector.text();

  $("#del-user-modal .modal-body > p").text(username);
  $("#del-user-id").val(user_id);
  $('#del-user-modal').modal('show');
}

// ui: open delete container modal
ui.model_delete_container = function() {
  var dom_selector = $(this).closest('td').prev('td');

  var container_id = dom_selector.prev('td').prev('td').text();
  var session = dom_selector.prev('td').text();
  var owner = dom_selector.text();

  dom_selector = $("#del-container-modal .modal-body > p");
  dom_selector.text(container_id);
  dom_selector.next('p').text(session);
  dom_selector.next('p').next('p').text(owner);

  $("#del-container-id").val(container_id);
  $('#del-container-modal').modal('show');
}

// ui: do switch navbar
ui.do_switch_navbar = function() {
  var isAdd = false;
  var hash;

  $('#navbar > ul > li').each(function() {
    hash = $(this).children('a').prop('hash');

    if (window.location.hash == hash) {
      isAdd = true;
      $(this).addClass("active");
      $('#layout-' + hash.substring(1)).show();
    }
    else {
      $(this).removeClass("active");
      $('#layout-' + hash.substring(1)).hide();
    }
  });

  if (!isAdd) {
    hash = $('#navbar > ul > li:first-child a').prop('hash');

    $('#navbar > ul > li:first-child').addClass("active");
    $('#layout-' + hash.substring(1)).show();
  }
}

// ui: do session login
ui.do_session_login = function(data) {
  if (data.error != undefined) {
    $("#login-msg").text(data.error.code + ': ' + data.error.message);
    return;
  }

  if (data.session == 'admin-panel' && data.user.isAdmin) {
    api.user_list(ui.bind_user_data);
  }
  else if (data.session == 'ubuntu-trusty-lxde') {
    window.location = '/u/' + data.session + '/vnc_auto.html?width=' + (window.innerWidth - 16) + '&height=' + (window.innerHeight - 16);
  }
  else {
    window.location = '/u/' + data.session + '/';
  }

  $('#login-modal').modal('hide');
}

// ui: do user login
ui.do_user_login = function() {
  var username = $('#login-username').val();
  var password = $('#login-password').val();
  var session = $('#login-session').val();

  api.login(username, password, session, ui.do_session_login);
}

// ui: do add user
ui.do_add_user = function() {
  var username = $("#add-username").val();
  var password = $("#add-password").val();

  // TODO: check is username existed

  api.user_add(username, password, ui.do_refresh_user_list);
}

// ui: do delete user
ui.do_delete_user = function() {
  var user_id = $("#del-user-id").val();

  api.user_delete(user_id, ui.do_refresh_user_list);
}

// ui: do refresh user list
ui.do_refresh_user_list = function(action) {
  // TODO: check add/delete user correctly

  api.user_list(ui.bind_user_data);
  $('#' + action + '-user-modal').modal('hide');
}

// ui: do delete container
ui.do_delete_container = function() {
  var container_id = $("#del-container-id").val();

  api.container_delete(container_id, ui.do_refresh_container_list);
}

// ui: do refresh container list
ui.do_refresh_container_list = function() {
  // TODO: check delete container correctly

  api.container_list(ui.bind_container_data);
  $('#del-container-modal').modal('hide');
}