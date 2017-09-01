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

// sorting - table rewrite
$(document).ready( function(){

    // write content into a array
    var data = [];

    function catchTable(){
        data = [];
        for (var i = 0 ; i < 10 ; i++){
            var row = $("#sorting-test tbody tr").eq(i);
            data[i] = { "name": row.children().eq(0).text(), "score": row.children().eq(1).text(), "win": row.children().eq(2).text() };
        };
    };


    function show(arr){
        var objProper = Object.keys(arr[0]);
        var objLength = Object.keys(arr[0]).length;

        var html = "";

        for (var i = 0 ; i < arr.length ; i++) {

            html += "<tr>";

            for (var j = 0 ; j < objLength ; j++){
                html += "<td>";
                html += arr[i][objProper[j]];
                html += "</td>";
            };

            html += "</tr>";
        };

        return html;
    }

    // choose header to sorting
    $("th").click(function(){
        var sortTarget = $(this).text();

        catchTable();

        // sorting
        data.sort( function(a,b){

            return b[sortTarget] - a[sortTarget];

            // if ( Number(a.score) > Number(b.score) ){
            //     return -1;
            // } else if ( Number(a.score) < Number(b.score) ) {
            //     return 1;
            // } else {
            //     return 0;
            // };



        });


        $("#sorting-test tbody").empty().html( show(data) );

    });

});
