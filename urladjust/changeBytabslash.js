function showTabs(){
    var showTab = 0;
    var link = location.href;
    var linkLen = link.length;

    // 點擊tab 顯示內容 交換.active
    $(".score-tabs-change").each(function(){
        var $this = $(this);
        $('ul li', $this).eq(showTab).addClass("score-tab-active");

        $(".score-tabs-change li").click(function(){

            var id = $(this).find("a").attr('href');
            // show content
            $(id).css("display" , "block").siblings().css("display" , "none");
            // 交換.active
            $(this).addClass("score-tab-active").siblings().removeClass("score-tab-active");
            // console.log (id);


            // remove old tab name
            var start = link.lastIndexOf("/") < 38 ? false : link.lastIndexOf("/");
            if (start){
                link = link.substring(0,linkLen);
            };

            // 寫入新的tab 名稱
            link += '/' + id.substring(1, id.length);
            window.history.pushState({page: id}, null, link);

            return false;

        });
    });



    // 按照網址置換到對應的tab
    function switchTab(tabname){
        if (tabname) {
            var id = tabname
            $(id).css("display" , "block").siblings().css("display" , "none");
            $('a[href="' + id + '"]').parent().addClass("score-tab-active").siblings().removeClass("score-tab-active");
        };
    }
    switchTab(location.hash);

    window.onpopstate = function(event) {
        // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        var tabname = event.state["page"];
        switchTab(tabname);
    };
}
