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
            
            // without return false, click event will show hash on url automatically and jump to anchor position
            // if don't need jumpping, open return false.
            // return false;

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

    window.onhashchange = function(){
        // hash changed. Do something cool.
        console.log("hash is" + location.hash);
        switchTab(location.hash);
    }

}
