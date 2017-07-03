//$(document).foundation(); //uncomment if you use foundation
$( document ).ready(function() {


});//end of $doc ready function

/*
// Smooth scrolling inside the page, id must start with 'page'
$('a[href^="#page"]').click(function(e){
  e.preventDefault();
  var target = $(this).attr('href');
  $('html, body').animate({scrollTop: $(target).offset().top-100}, 800, function(){    });
  return false;
});
*/

/*
// Sending form
$('.js-form-order').on('submit',function(e) {
    e.preventDefault();
    var form = $(this);
    var dataToSend = form.serialize();
    var button = form.find('.js-button__send-form');

    // Form reaction on sending 
    button.attr('disabled',true);
    button.find('span').text('Отправка...');
    form.find('input').attr('disabled',true);

    // Send
    jQuery.ajax({
                url:      "sendmail.php",
                type:     "POST",
                dataType: "html",
                data: dataToSend,

                success: function(response) {
                    button.find('span').text(response);
                  	button.prop('disabled', false);
                    form.find('input').attr('disabled',true);
                    form.find('.modal__success-text').fadeIn();
                    form.trigger( 'reset' );
                },
                error: function(response) {
                    button.find('span').text("Неуспешно");
                    form.find('input').attr('disabled',true);
                    form.trigger( 'reset' );
                }
    });

    return false;
});
*/

/*
// Reset modal if it's closed at any time
$('.modal').on('hide.bs.modal', function (e) {
    $(this).find('input').attr('disabled',false);
    $(this).find('.modal__success-text').fadeOut();
    $(this).find('.js-button__send-form').prop('disabled', false);
    $(this).find('.js-button__send-form').text("Отправить");
    $(this).find('form').trigger('reset');
})
*/