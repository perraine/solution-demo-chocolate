// Global alert box
function alertBox(title, txt, button) {
    $('.alert__title').html(title);
    $('.alert__txt p').html(txt);
    $('.alert__button').html(button);
    $('.alert').addClass('on');
}