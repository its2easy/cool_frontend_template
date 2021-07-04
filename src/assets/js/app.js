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
    var button = form.find('.js__submit-button');

 	//dataToSend += '&source=' + encodeURIComponent(form.data('source')); //extend dataToSend

    // Form reaction on sending
    button.attr('disabled',true);
    button.text('Отправка...');
    form.find('input').attr('disabled',true);

    // Send
    jQuery.ajax({
                url:      "sendmail.php",
                type:     "POST",
                dataType: "html",
                data: dataToSend,

                success: function(response) {
                   button.text(response);
                  	button.prop('disabled', false);
                   form.find('input').attr('disabled',false);
                   form.trigger( 'reset' );
                },
                error: function(response) {
                    button.text("Неуспешно");
                    form.find('input').attr('disabled',false);
                    button.prop('disabled', false);
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


// анимация загрузки страницы полосой сверху, поместить сразу после html кода страницы
// <script>
// //анимация полосы загрзки страницы, на DOMContentLoaded слишком поздно
// var images = document.images,
//     imagesCount = images.length,
//     imagesLoadedCount = 0,
//     preloadBlock = document.getElementById('tables-preload');
//
// for (var i = 0; i < imagesCount; i++){
//     image_clone = new  Image();
//     image_clone.onload = imageLoaded;
//     image_clone.onerror = imageLoaded;
//     image_clone.src = images[i].src;
// }
// function imageLoaded() {
//     imagesLoadedCount++;
//     var percent = (( 100 / imagesCount) * imagesLoadedCount) << 0;
//     preloadBlock.style.width = percent + '%';
//     //console.log(percent);
//
//     if (imagesLoadedCount >= imagesCount){
//         setTimeout(function () {
//             if (!preloadBlock.classList.contains('done')){
//                 preloadBlock.classList.add('done');
//             }
//         }, 500);
//     }
// }
// </script>


//test is mobile device
// var isMobile = false;
// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//     isMobile = true;
// }

//проверяет на тач устройство, но скорее всего не точно
// function is_touch_device() {
//     return 'ontouchstart' in window        // works on most browsers
//         || navigator.maxTouchPoints;       // works on IE10/11 and Surface
// }
