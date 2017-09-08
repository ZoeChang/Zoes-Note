var calendar = {
    year: null, //初始化年
    month: null, //初始化月份

    clickCell: function(){
        $(".score-calendar-thisMonth").each(function(){
            $(this).click(function(){
                $(this).addClass("score-calendar-active").siblings().removeClass("score-calendar-active");
            });
        });
    },
    proofreadDate: function(defore) {
        var year = defore.getFullYear();
        var month = defore.getMonth();
        var date = defore.getDate();
        var after = new Date(year,month,date).getTime();
        return after;
    },
    getFirstDay: function(year,month){ //獲取每個月第一天再星期幾
        var firstDay = new Date(year,month,1);
        return firstDay.getDay(); //getDay()方法來獲取
    },
    getMonthLen: function(year,month){ //獲取當月總共有多少天
        var nextMonth = new Date(year,month+1,1); //獲取下個月的第一天
        nextMonth.setHours(nextMonth.getHours() - 3); //由於獲取的天是0時,所以減去3小時則可以得出該月的天數
        return nextMonth.getDate(); //返回當天日期 //返回當月最後一天日期
    },
    getWeekLen: function(firstDay,monthLen){
        var firstSat = 7 - firstDay;
        var weekLen = 1;
        var dateOfSat = firstSat;

        while (dateOfSat < monthLen){
            weekLen ++;
            dateOfSat +=7;
        };

        if (dateOfSat < monthLen) {
            weekLen ++;
        }
        return weekLen;
    },
    getLastMonthLen: function(year,month){
        var LastMonth = new Date(year,month,1);
        LastMonth.setHours(LastMonth.getHours() - 3);
        return LastMonth.getDate();
    },
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
    printDate: function(day){
        var lastCell = document.getElementById("score-calendar-cellGroup").lastChild;
        lastCell.innerHTML = day;
    },
    createCalendar: function(form,date){ //創建日曆方法
        calendar.year = date.getFullYear(); //獲得當時的年份,並賦值到calendar屬性year中,以便別的方法的調用
        calendar.month = date.getMonth(); //跟上面獲取年份的目的一樣

        var monthLen = calendar.getMonthLen(calendar.year,calendar.month); //獲取月份長度
        var firstDay = calendar.getFirstDay(calendar.year,calendar.month); //獲取月份首天為星期幾
        var weekLen = calendar.getWeekLen(firstDay,monthLen); // 取得當月週數
        var lastMonthLen = calendar.getLastMonthLen(calendar.year,calendar.month); //上個月的天數
        var printedDate = 0; //日期
        var time = 0; // numeric date
        var thisMonth = true;


        //月曆標頭 插入年和月
        document.getElementById("score-calendar-Tittle").innerHTML = `${calendar.year}年${calendar.month + 1}月`;
        //清空TABLE
        calendar.clearCalendar(form);

        // 按照週數建立cell
        for (var j = 0 ; j < weekLen * 7 ; j++ ){
            if (j < firstDay){
                thisMonth = false;
                printedDate = lastMonthLen - (firstDay - 1 - j);
                time = new Date(calendar.year,calendar.month-1,printedDate).getTime();
            } else if ( j >= monthLen + firstDay){
                thisMonth = false;
                printedDate = j - (monthLen + firstDay - 1);
                time = new Date(calendar.year,calendar.month+1,printedDate).getTime();
            } else {
                thisMonth = true;
                printedDate = j - (firstDay - 1);
                time = new Date(calendar.year,calendar.month,printedDate).getTime();
            };
            calendar.createCell(thisMonth, time);
            calendar.printDate(printedDate);
        };
        calendar.clickCell();
    },
    clearCalendar: function(form){
        var cellGroup = document.getElementById("score-calendar-cellGroup");
        while (cellGroup.firstChild) {
            cellGroup.removeChild(cellGroup.firstChild);
        }
    },
    init: function(form){ //主方法

        var today = new Date();

        // TODO 建立資料
        // 建立月曆
        this.createCalendar(form,today);


        // 上下月btn轉換
        var preMon = document.getElementById("score-calendar-preMonth");
        var nextMon = document.getElementById("score-calendar-nextMonth");
        preMon.onclick = function(){ //當點擊左按鈕時,減去一個月,並重繪TABLE
            calendar.createCalendar(form,new Date(calendar.year,calendar.month-1,1));
        };
        nextMon.onclick = function(){ //當點擊右按鈕時,加上一個月,並重繪TABLE
            calendar.createCalendar(form,new Date(calendar.year,calendar.month+1,1));
        };

        // 點擊 單日按鈕收月曆
        $("#score-calendar-preDay, #score-calendar-nextDay").click(function(){
            $("#score-calendar-page").hide();
        });


    }

}


window.onload = function(){
    var calendars = document.getElementById("score-calendar");
    calendar.init(calendars);


    $("#score-calendar-info").click(function(){
        $("#score-calendar-page").toggle();
    });


    function dayToZhDay(number){
        var zhDays = ["日","一","二","三","四","五","六"];
        return zhDays[number];
    }

    function moveCurrent(move){
        // 往前一天 往後一天
        if (move == -1){
            current = current - 24*60*60*1000;
        } else if (move == 1){
            current = current + 24*60*60*1000;
        };
    }

    function addActive(){
        // 加上 active
        var $pickedDate = $("#score-calendar-cellGroup").find(`[data-date="${current}"]`);
        var isThisMonth = $pickedDate.hasClass("score-calendar-thisMonth");
        if (isThisMonth) {
            $pickedDate.addClass("score-calendar-active").siblings().removeClass("score-calendar-active");
        } else {
            // 繪製前一個月 或 後一個月
            calendar.createCalendar(calendars,new Date(current));
            $("#score-calendar-cellGroup").find(`[data-date="${current}"]`).addClass("score-calendar-active").siblings().removeClass("score-calendar-active");
        };
    }

    function resetInfo(dateTime){
        var dateString = new Date(dateTime);
        var year = dateString.getFullYear();
        var month = dateString.getMonth();
        var date = dateString.getDate();
        var zhDay = dayToZhDay( dateString.getDay() );

        var information = `${year}-${month+1}-${date} / 週${zhDay} / 99場比賽`;

        // information寫入html
        $("#score-calendar-info").empty().append(information);

        // 日期放入data-date
        $("#score-calendar-info").attr("data-date" , current);
    };

    var today = calendar.proofreadDate ( new Date() );
    var current = today;

    console.log(current);

        resetInfo(current);
        addActive()

        $("#score-calendar-preDay").click(function(){
            moveCurrent(-1);
            resetInfo(current);
            addActive()
        });

        $("#score-calendar-nextDay").click(function(){
            moveCurrent(1);
            resetInfo(current);
            addActive()
        });
}
