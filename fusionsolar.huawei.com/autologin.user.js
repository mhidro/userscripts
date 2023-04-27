// ==UserScript==
// @name        Autologin for fusionsolar.huawei.com
// @namespace   https://github.com/mhidro/userscripts/tree/master/fusionsolar.huawei.com
// @match       https://eu5.fusionsolar.huawei.com/unisso/login.action*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1
// @author      MH
// @description 27-4-2023
// ==/UserScript==

if ( typeof(isNullOrEmpty) === 'undefined' )
{
  var isNullOrEmpty = function(value){
    return (
    // null or undefined
    (value == null) ||

    // has length and it's zero
    (value.hasOwnProperty('length') && value.length === 0) ||

    // is an Object and has no keys
    (value.constructor === Object && Object.keys(value).length === 0)
  )
  }
}

var username = GM_getValue("username","");
var password = GM_getValue("password","");

if (isNullOrEmpty(username)) { username = prompt("Username/e-mail"); console.log(username); GM_setValue("username",username); }
if (isNullOrEmpty(password)) { password = prompt("Password"); console.log(password); GM_setValue("password",password); }


function nuke_cookies(){
  function eraseCookie (cookieName) {
    //--- ONE-TIME INITS:
    //--- Set possible domains. Omits some rare edge cases.?.
    var domain      = document.domain;
    var domain2     = document.domain.replace (/^www\./, "");
    var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, "$2");;

    //--- Get possible paths for the current page:
    var pathNodes   = location.pathname.split ("/").map ( function (pathWord) {
        return '/' + pathWord;
    } );
    var cookPaths   = [""].concat (pathNodes.map ( function (pathNode) {
        if (this.pathStr) {
            this.pathStr += pathNode;
        }
        else {
            this.pathStr = "; path=";
            return (this.pathStr + pathNode);
        }
        return (this.pathStr);
    } ) );

    ( eraseCookie = function (cookieName) {
      console.log(`Erasing cookie ${cookieName}`);
        //--- For each path, attempt to delete the cookie.
        cookPaths.forEach ( function (pathStr) {
            //--- To delete a cookie, set its expiration date to a past value.
            var diagStr     = cookieName + "=" + pathStr + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = diagStr;

            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain  + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain2 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain3 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        } );
    } ) (cookieName);
}

  //--- Loop through cookies and delete them.
var cookieList  = document.cookie.split (/;\s*/);

for (var J = cookieList.length - 1;   J >= 0;  --J) {
    var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, "$1");

    eraseCookie (cookieName);
}
}


setTimeout(
  function(){
    nuke_cookies();

    document.getElementById('username').value=username;
    document.getElementById('username').change ? document.getElementById('username').change():{};
    document.getElementById('value').value=password;
    document.getElementById('value').change ? document.getElementById('value').change():{};
    try{
      document.getElementById('submitDataverify').click();
    } catch(e){
      console.error(e);
    }
  },1500);
