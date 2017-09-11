function dateObj(datenumber){
    var date = typeof datenumber == "number" ? new Date(datenumber) : datenumber ;

    this.getMonthLen = function( year , month ){ //當月天數
        var nextMonth = new Date(year,month+1,1); //取得下個月的第一天
        nextMonth.setHours(nextMonth.getHours() - 3); //由於獲取的天是0時,所以減去3小時則可以得出該月的天數
        return nextMonth.getDate(); //返回當天日期 //返回當月最後一天日期
    };

    this.getWeekLen = function( firstDay , monthLen ){
        var firstSat = 7 - firstDay;
        var weekLen = 1;
        var dateOfSat = firstSat;

        while (dateOfSat < monthLen){
            weekLen ++;
            dateOfSat  +=7;
        };

        if (dateOfSat < monthLen) {
            weekLen ++;
        }
        return weekLen;
    };

    this.year = date.getFullYear();
    this.month = date.getMonth(); // 範圍: 0~11
    this.date = date.getDate(); //日期 1~31
    this.day = date.getDay(); //星期 0~6
    this.time = new Date( this.year , this.month , this.date ).getTime(); //以毫秒表示日期
    this.zhDays = ["日","一","二","三","四","五","六"];
    this.zhDay = this.zhDays[this.day]; // 轉換中文星期
    this.firstDay = new Date(this.year,this.month,1).getDay(); // 當月的第一天
    this.monthLen = this.getMonthLen( this.year , this.month ); // 當月的天數
    this.weekLen = this.getWeekLen( this.firstDay , this.monthLen ); // 當月的週數
    this.lastMonthLen = this.getMonthLen( this.year , this.month-1 ); // 前一個月的天數

};


var calendar = {
    // 現在 初始設定 當天
    current: new dateObj(new Date()),
    today: new dateObj( new Date() ),

    // 移動前後一天
    moveCurrent: function(move){
        // 調整current: -1 往前一天 ; 1 往後一天
        if (move == -1){
            // if (this.current.date == 1 ){
            //     this.current = new dateObj( new Date(this.current.time - 24*60*60*1000) );
            //     calendar.createCalendar( calendar.current );
            // };
            this.current = new dateObj( new Date(this.current.time - 24*60*60*1000) );

        } else if (move == 1){
            this.current = new dateObj( new Date(this.current.time + 24*60*60*1000) );
        };

        // 加上 .active
        var $pickedDate = $("#score-calendar-cellGroup").find(`[data-date="${calendar.current.time}"]`);
        var isThisMonth = $pickedDate.hasClass("score-calendar-thisMonth");
        if (isThisMonth) {
            $pickedDate.addClass("score-calendar-active").siblings().removeClass("score-calendar-active");
        } else {
            // 繪製前一個月 或 後一個月
            calendar.createCalendar(calendar.current);
            $("#score-calendar-cellGroup").find(`[data-date="${calendar.current.time}"]`).addClass("score-calendar-active").siblings().removeClass("score-calendar-active");
        };
    },

    // 調整最上方標題內容 及 data-date內容
    resetInfo: function(theDate){
        var information = `${theDate.year}-${theDate.month+1}-${theDate.date} / 週${theDate.zhDay} / 99場比賽`;

        // information寫入html
        $("#score-calendar-info").empty().append(information);

        // 日期放入data-date
        $("#score-calendar-info").attr("data-date" , dateObj.time);
    },

    // click on cell
    clickCell: function(){
        $(".score-calendar-thisMonth").each(function(){

            $(this).click(function(){
                // chagne .active between cell
                $(this).addClass("score-calendar-active").siblings().removeClass("score-calendar-active");

                // get data-date
                var data = $(this).data("date");
                calendar.current = new dateObj(data);

                // rewrite top tittle and data-date
                calendar.resetInfo(calendar.current);

                // hidden
                $("#score-calendar-page").hide();

            });

        });
    },

    // print date in calendat
    printDate: function(day){
        var lastCell = document.getElementById("score-calendar-cellGroup").lastChild;
        lastCell.innerHTML = day;
    },

    //draw calendar by cell
    createCell: function(thisMonth,time){
        var cell = document.createElement("div");
        if (thisMonth) {
            cell.className = "score-calendar-showCell score-calendar-thisMonth";
            document.getElementById("score-calendar-cellGroup").appendChild(cell);
        } else {
            cell.className = "score-calendar-showCell";
            document.getElementById("score-calendar-cellGroup").appendChild(cell);
        }
        cell.setAttribute("data-date", time);
    },

    // clean calendar
    clearCalendar: function(){
        var cellGroup = document.getElementById("score-calendar-cellGroup");
        while (cellGroup.firstChild) {
            cellGroup.removeChild(cellGroup.firstChild);
        };
    },

    //draw calendar
    createCalendar: function(theDate){

        var printedDate = 0; //日期
        var time = 0; // numeric date
        var thisMonth = true;

        //清空TABLE
        this.clearCalendar();

        //月曆標頭 插入年和月
        document.getElementById("score-calendar-Tittle").innerHTML = `${theDate.year}年${theDate.month + 1}月`;

        // 按照週數建立cell
        for (var j = 0 ; j < theDate.weekLen * 7 ; j++ ){

            if (j < theDate.firstDay){
                // 前一個月
                thisMonth = false;
                printedDate = theDate.lastMonthLen - (theDate.firstDay - 1 - j);
                time = new Date( theDate.year, theDate.month-1, printedDate ).getTime();
            } else if ( j >= theDate.monthLen + theDate.firstDay){
                // 後一個月
                thisMonth = false;
                printedDate = j - ( theDate.monthLen + theDate.firstDay - 1);
                time = new Date( theDate.year, theDate.month+1, printedDate ).getTime();
            } else {
                // 當月
                thisMonth = true;
                printedDate = j - (theDate.firstDay - 1);
                time = new Date( theDate.year, theDate.month, printedDate ).getTime();
            };
            this.createCell(thisMonth, time);
            this.printDate(printedDate);
        };
        this.clickCell();
    },

    // 上下月btn轉換
    btnMonth: function(){

        //當點擊左按鈕時,減去一個月,並重繪月曆
        $("#score-calendar-preMonth").click(function(){
            calendar.current =  new dateObj( new Date(calendar.current.year, calendar.current.month-1,1) );
            calendar.createCalendar( calendar.current );
        });

        // 當點擊右按鈕時,加上一個月,並重繪月曆
        $("#score-calendar-nextMonth").click(function(){
            calendar.current =  new dateObj( new Date(calendar.current.year, calendar.current.month+1,1) );
            calendar.createCalendar( calendar.current );
        });
    },

    //top area
    simpleHeader: function() {
        // 點擊 單日按鈕收月曆
        $("#score-calendar-preDay, #score-calendar-nextDay").click(function(){
            $("#score-calendar-page").hide();
        });

        // 點擊 score-calendar-info 收放月曆
        $("#score-calendar-info").click(function(){
            $("#score-calendar-page").toggle();
        });

        // 點擊單日轉換
        $("#score-calendar-preDay").click(function(){
            calendar.moveCurrent(-1);
            calendar.resetInfo(calendar.current);

        });
        $("#score-calendar-nextDay").click(function(){
            calendar.moveCurrent(1);
            calendar.resetInfo(calendar.current);
        });
    },

    //主方法
    main: function(){
        // var today = this.time;
        // var current = today;
        // TODO 建立資料
        // 建立月曆
        this.createCalendar(this.today);
        this.resetInfo(this.today);
        this.moveCurrent(0);

        this.btnMonth();
        this.simpleHeader();
    }
}



window.onload = function(){
    calendar.main();


}
