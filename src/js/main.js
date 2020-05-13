$(document).ready(function() {

    $('.catalog__item-size').click(function(){
        $(this).siblings().removeClass('_active').end().addClass('_active');
        return false;
    });

    $('.catalog__tabs li').click(function(){
        $(this).siblings().removeClass('active').end().addClass('active');
        $('.catalog__tab').removeClass('_active').eq($('.catalog__tabs li').index(this)).addClass('_active');
        return false;
    });

});