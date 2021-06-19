$(document).ready(function(){

  $(".regist").on('click', function(e) {
    console.log(0);
    regisClick();
  });

  $(".signin").on('click', function(e) {
    console.log(1);
    authClick();
  });

  $(".overlay").on('click', function(e) {
    console.log(2);
    closeRegisClick();
  });

  function regisClick() {
    $(".overlay").addClass("form-opened");
    $(".regis").addClass("form-opened");
  }

  function authClick() {
    $(".overlay").addClass("form-opened");
    $(".auth").addClass("form-opened");
  }

  function closeRegisClick() {
    $(".overlay").removeClass("form-opened");
    $(".auth").removeClass("form-opened");
    $(".regis").removeClass("form-opened");
  }

});
