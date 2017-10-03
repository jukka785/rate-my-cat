$(document).ready(function() {
  $(".rating").rating();

  $(".rating.rating-disabled").rating("disable");

  $(".ui.heart.rating").on("click", function(event) {
    event.preventDefault();
    //event.stopPropagation();
  });

  
  $(".ui.comments a").on("click", function(event) {
    event.preventDefault();
    $(this).siblings(".ui.edit.form").toggle();
  });

  $("#rating").on("click", function(event) {
      var id = $(this).attr("cat-id");
      var newRating = $(this).rating("get rating");
      var that = $(this);
      $.post("/cats/" + id + "/rating?newRating=" + newRating, function(data) {
        if (data.success) {
          that.rating("set rating", data.rating);
          $(".ui.red.statistic .value").html(data.avg);
          $(".ui.red.statistic .label").html(data.count + " ratings");
        }
      });
  });

  // client side form validation
  $("#login .ui.form").form({
    fields: {
      username: "empty",
      password: "empty"
    }
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