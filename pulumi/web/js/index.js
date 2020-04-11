function submitToAPI(e) {
    e.preventDefault();
    var URL = "${API_URL}enter";

         var Namere = /[A-Za-z]{1}[A-Za-z]/;
         if (!Namere.test($("#name-input").val())) {
            alert ("Name can not be less than 2 char");
            return;
         }
         var mobilere = /[0-9]{10}/;
         if (!mobilere.test($("#phone-input").val())) {
             alert ("Please enter valid mobile number");
             return;
         }
         if ($("#email-input").val()=="") {
             alert ("Please enter your email address");
             return;
         }

         var reeamil = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
         if (!reeamil.test($("#email-input").val())) {
             alert ("Please enter valid email address");
             return;
         }

    var name = $("#name-input").val();
    var phone = $("#phone-input").val();
    var email = $("#email-input").val();
    var data = {
       name : name,
       phone : phone,
       email : email
     };

    $.ajax({
        type: "POST",
        url : URL,
        dataType: "json",
        crossDomain: "true",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),

      
      success: function () {
        // clear form and show a success message
        alert("Success");
      },
      error: function () {
        // show an error message
        alert("Failure");
      }});
  }