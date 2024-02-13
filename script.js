$(document).ready(function () {


$('#ble-checkbox').on("change", (function(e){
    if($(this).is(':checked')){
        console.log("a");  // checked
    }
    else{
        console.log("b");  // checked
    }
}));

$('.ble-btn').on("click", (function(e){
    if($(this).hasClass('on'))
    {
        $(this).removeClass('on');
        $(this).children('span').text('OFF');
        $('body').css('background','#D56062');
    }
    else
    {
        $(this).addClass('on');
        $(this).children('span').text('ON');
        $('body').css('background','#7AC74F');
    }
}));


});