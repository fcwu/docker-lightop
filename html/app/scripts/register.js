/* ===== Register Listener ===== */

$(window).hashchange(function() {
    ui.do_switch_navbar();
});

$(".dropdown-menu").on('click', 'li a', function() {
  $("#login-session-name").text($(this).text());
  $("#login-session").val($(this).attr('data-value'));
});

$('#btn-sign-in').on('click', null, ui.do_user_login);
$('#btn-add-user').on('click', null, ui.do_add_user);
$('#btn-del-user').on('click', null, ui.do_delete_user);