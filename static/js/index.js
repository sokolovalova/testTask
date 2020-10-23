$(function () {

    $('#btnMenu').on('click', function () {
        $('.wrapper').slideToggle(500, function () {
            $(this).addClass('active');
        });
    });
});