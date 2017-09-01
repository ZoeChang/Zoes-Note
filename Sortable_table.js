// sorting - active style
$(document).ready( function(){

    $(".score-sorting").click(function(){

        var index = $(this).index();

        $(this).addClass("score-sorting-active").siblings().removeClass("score-sorting-active");
        // $(this).addClass("score-sorting-active");
        $("#score-table-playerdata tbody tr.score-data-true").find(":nth-child(" + ( index + 1 ) + ")").addClass("score-sorting-active")
            .siblings().removeClass("score-sorting-active");

    });
});
