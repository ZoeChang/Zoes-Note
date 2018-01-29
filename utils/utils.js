window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

export function animate({timing, draw, duration}) {
    let start = performance.now()

    // if(animFrame !== null){
        window.requestAnimationFrame(function animate(time) {
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // calculate the current animation state
            let progress = timing(timeFraction)

            draw(progress); // draw it

            if (timeFraction < 1) {
                window.requestAnimationFrame(animate);
            }

        })
    // }


}

export function checkCookie(cookieName, expriresDay) {
    let haveCookie = getCookie(cookieName)
    // no cookie, show and set cookie
    if ( !haveCookie ) {
        setCookie(cookieName, expriresDay)
        return false

    } else {
    // have cookie already, not show
        return true
    }

}

function setCookie(cookieName , day) {
    let today = new Date()
    let expriresDay = new Date( today.getTime() + day * 86400000 )

    document.cookie = `${cookieName}=true; expires=${expriresDay.toUTCString()}`;

}

function getCookie(cname) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';');

    for ( let i = 0; i <ca.length; i++) {
        let c = ca[i];
        if (c.indexOf(name) > -1) {
            return c.substring(name.length, c.length)
        }
    }

    return ''

}