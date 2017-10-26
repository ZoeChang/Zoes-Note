function infiniteScroll(){

        var isloaded = false;
        var loadedPage = 2;

        // caculate position
        var windowH = window.innerHeight;
        var footerH = jQuery("footer").outerHeight(true);

        jQuery(window).scroll( function(){
            var yScroll = jQuery(window).scrollTop();

            var htmlH = jQuery("body").outerHeight();
            var moreposiH = htmlH - footerH - windowH - 60;

            if (!isloaded){
                if (yScroll > moreposiH){
                    isloaded = true;
                    console.log("in");

                    getNextPage( loadedPage, function( data, nextpage){
                        var html = compose(data);

                        jQuery("#writer-stickies").append(html);

                        if( nextpage ) {
                            isloaded = false;
                            loadedPage = nextpage;
                        };

                    });
                }
            }
        });
    }



    window.onload = function(){
        // infiniteScroll();

        var isloaded = false;
        var loadedPage = 2;

        // caculate position
        var windowH = window.innerHeight;
        var elmtFooter = document.getElementsByTagName("footer")[0];
        var elmtBody = document.getElementsByTagName("body")[0];
        var footerH = parseInt(window.getComputedStyle( elmtFooter ,null).getPropertyValue("margin-top")) + elmtFooter.offsetHeight;

        window.onscroll = function() {
            var yScroll = document.body.scrollTop > document.documentElement.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;

            var htmlH = parseInt(window.getComputedStyle( elmtBody ,null).getPropertyValue("margin-top")) + parseInt(window.getComputedStyle( elmtBody ,null).getPropertyValue("margin-bottom")) + elmtBody.offsetHeight;;
            var moreposiH = htmlH - footerH - windowH - 60;

            if (!isloaded){
                if (yScroll > moreposiH){
                    isloaded = true;

                    getNextPage( loadedPage, function( data, nextpage){
                        var html = compose(data);

                        jQuery("#writer-stickies").append(html);

                        if( nextpage ) {
                            isloaded = false;
                            loadedPage = nextpage;
                        };

                    });
                }
            }
        };
    }
