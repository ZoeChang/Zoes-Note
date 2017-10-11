function barchart(data){

    // // D3 test for bar chart
    // window.addEventListener("load",function(){

    //     var data1 = [
    //         {x:1, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:2, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:3, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:4, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:5, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:6, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:7, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:8, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)},
    //         {x:9, w1:Math.floor(Math.random()*300), w2:Math.floor(Math.random()*300)}
    //     ];

    //     var itemH = 53;
    //     var svgW = 474;
    //     var svgH = itemH * 9;
    //     var barH = 26;

    //     var btn = d3.select("#btn").on("click",function(){
    //                     for(var i = 0; i < data1.length ; i++){
    //                         data1[i].w1 = Math.floor(Math.random()*300);
    //                     };
    //                     _transition();
    //                 });

    //     // scale width in percentage
    //     var xScale = d3.scaleLinear()
    //                     .domain([0,300])
    //                     .range([13,474 - 26]);

    //     // draw svg
    //     var s = d3.selectAll(".barcharttest")
    //                 .append("svg")
    //                 .attrs({
    //                 "width": svgW,
    //                 "height": svgH
    //                 })
    //                 .append("g");

    //     // bind all data
    //     var eventGroup = s.selectAll(".g-event")
    //     .data(data1)
    //     .enter()
    //     .append("g")
    //     .attrs({"class": "g-event"});

    //     // background bar
    //     var bars2 = eventGroup.append("rect")
    //     .attrs({
    //         "fill": "#F44336",
    //         "width": svgW,
    //         "height": barH,
    //         "rx": 13,
    //         "x": 0,
    //         "y": function(d){
    //             return (d.x-1) * itemH;
    //         }
    //     });


    //     // percentage bar group
    //     var barsGroup = eventGroup.append("g")
    //     .attrs({
    //         "class": "score-aniBar"
    //     });

    //     // left side design
    //     var barsZero = barsGroup.append("circle")
    //     .attrs({
    //         "fill": "#0099FF",
    //         "cx": function(){ return barH / 2;},
    //         "cy": function(d){ return ( d.x - 1 ) * itemH + ( barH / 2 );},
    //         "r": 13,
    //     });

    //     var bars = barsGroup.append("rect")
    //     .attrs({
    //         "fill": "#0099FF",
    //         "width": 200,
    //         "height": barH,
    //         "x": 13,
    //         "y": function(d){
    //                 return ( d.x - 1 ) * itemH;
    //             }
    //     })
    //     .transition()
    //     .duration(1500)
    //     .attrs({
    //         "width": function(d) { return xScale(d.w1) }
    //     });

    //     function _transition(){

    //         s.selectAll(".score-aniBar rect")
    //         .data(data1)
    //         .transition()
    //         .duration(1500)
    //         .attrs({
    //             "width": function(d){ return xScale(d.w1) }
    //         });

    //     }

    // },false);







    // write content into a array
    var vsData = [];
    var eventArr = ["得分", "籃板", "助攻", "抄截", "阻攻", "失誤", "罰球", "三分", "犯規"];

    // score-barCharts-table
    function catchTable(){
        vsData = [];
        for (var i = 0 ; i < 9 ; i++){
            var vsItem = jQuery(".score-justifyBW-mb").eq(i);
            var w1 = vsItem.children().first().text();
            var w2 = vsItem.children().last().text();
            vsData[i] = { "x": i, "w1": Number( w1 ),"w2": Number( w2 ), "absum": Number( w1 ) +  Number( w2 ) };
        };
    };
    catchTable();


    // Draw bar charts

    // total height = bar height + gap between two bars
    var itemH = jQuery(".score-barCharts-mb .score-gameData-td").height();
    // bar heigth
    var barH = itemH == 56 ? 26 : 20 ;
    var svgPaddingTop = ( itemH - barH ) / 2;
    var svgW = jQuery(".score-gameData-vs").width() * 0.6;
    var svgH = itemH * 9;


    var test = jQuery(".score-barCharts-mb .score-gameData-td").height();


    // scale width  to get percentage
    var xScale = d3.scaleLinear()
                    .range([barH / 2,svgW - barH]);

    // draw svg
    var s = d3.selectAll("#score-barCharts")
                .append("svg")
                .attrs({
                "width": svgW,
                "height": svgH
                })
                .append("g");

    // bind data with .g-event
    var eventGroup = s.selectAll(".g-event")
    .data(vsData)
    .enter()
    .append("g")
    .attrs({"class": "g-event"});

    // background bar
    var bars2 = eventGroup.append("rect")
    .attrs({
        "fill": "#F44336",
        "width": svgW,
        "height": barH,
        "rx": barH / 2,
        "x": 0,
        "y": function(d){
            return d.x * itemH + svgPaddingTop;
        }
    });


    // percentage bar group
    var barsGroup = eventGroup.append("g")
    .attrs({
        "class": "score-aniBar"
    });

    // left side design
    var barsZero = barsGroup.append("circle")
    .attrs({
        "fill": "#0099FF",
        "cx": function(){ return barH / 2;},
        "cy": function(d){ return d.x * itemH + ( barH / 2 ) + svgPaddingTop;},
        "r": barH / 2,
    });

    var bars = barsGroup.append("rect")
    .attrs({
        "fill": "#0099FF",
        "width": function(d) {
            var xScaleD = xScale.domain([0,d.absum]);
            return xScaleD(d.w1);
        },
        "height": barH,
        "x": barH / 2,
        "y": function(d){
                return d.x * itemH + svgPaddingTop;
            }
    });


    // setting margin left to make bars central
    var adj = - svgW * 0.5;
    jQuery("#score-barCharts").css( "margin-left" ,  adj );

}
