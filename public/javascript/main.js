$(document).ready(function() {
  $(".rating").rating();

  $(".ui.heart.rating").on("click", function(event) {
    event.preventDefault();
    //event.stopPropagation();
  });

  $(".message .close").on("click", function() {
    $(this).closest(".message").transition("fade");
  });
});