$(document).ready(function() {
  $(".rating").rating();

  $(".ui.heart.rating").on("click", function(event) {
    event.preventDefault();
    //event.stopPropagation();
  });

  $("#login .ui.form").form({
    fields: {
      username: "empty",
      password: "empty"
    }
  });

  $(".ui.comments a").on("click", function(event) {
    event.preventDefault();
    $(this).siblings(".ui.edit.form").toggle();
  });

  $("#register .ui.form").form({
    fields: {
      username: {
        identifier: "username",
        rules: [
          {
            type: "minLength[3]",
            prompt: "Your username must have at least {ruleValue} characters"
          }
        ]
      },
      password: {
        identfier: "password",
        rules: [
          {
            type: "minLength[4]",
            prompt: "Your password must have at least {ruleValue} characters"
          }
        ]
      }
    }
  });

  $("#cat-content-grid .reply.form").form({
    fields: {
      text: "empty"
    }
  });
});