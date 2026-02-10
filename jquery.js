$(document).ready(function () {

    // Change button text
    $("#submitBtn").click(function () {
        $(this).text("Submitting...");
    });

    // Set background image
    $("body").css("background-image", "linear-gradient(#f4f6f8, #dfe6e9)");

    // Access form data
    $("#submitBtn").click(function () {
        let name = $("#username").val();
        console.log("Username:", name);
    });

    // Add attribute
    $("#phone").attr("maxlength", "10");
   $(document).ready(function() {
    // JQuery effect: Fade in the project cards on load
    $(".project-card").hide().fadeIn(1500);

    // JQuery: Hover effect on the submit button
    $("#submitBtn").hover(
        function() { $(this).css("opacity", "0.8"); },
        function() { $(this).css("opacity", "1"); }
    );
});
});
