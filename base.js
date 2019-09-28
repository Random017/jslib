/* Create by ruanmingcong on   */

/**
 * 获取当前浏览器的语言，区域
 * <br/>并且设置到 localStorage中 lang
 * @returns {string} eg：zh-CN
 */
function getCurrentLanguage() {
    let type = navigator.appName, lang;
    if (type === "Netscape") {
        lang = navigator.language;
    } else {
        lang = navigator.userLanguage;
    }
    window.localStorage.setItem("lang", lang);
    return lang;
}


//初始化全局变量
!function () {
    var BASE_URL, isTest = false, homePageUrl = '/static/index.html';
    var geduo = window.parent.location.href.toLowerCase();
    var f = new Array();
    f = geduo.split("/");
    var ztwww = f[2];
    // console.log("当前运行环境：", ztwww);
    if (ztwww.indexOf("www.skycong.com:9999") >= 0) {
        BASE_URL = "https://www.skycong.com:9999";
    } else if (ztwww.indexOf("benteng.skycong.com") >= 0) {
        BASE_URL = "http://benteng.skycong.com:10020";
    } else {
        BASE_URL = "http://127.0.0.1:10020";
        isTest = true;
        homePageUrl = "index.html";
    }
    var lang = getCurrentLanguage();
    // console.log("pre BASE_URL：", BASE_URL);
    // console.log("pre isTest：", isTest);
    // console.log("pre language：", lang);
    window.localStorage.setItem("BASE_URL", BASE_URL);
    window.localStorage.setItem("isTest", isTest);
    window.localStorage.setItem("language", lang);
    window.localStorage.setItem("homePageUrl", homePageUrl);
}(window);

var
    BASE_URL = window.localStorage.getItem("BASE_URL"),
    // isTest = window.localStorage.getItem("isTest"),
    isTest = false,
    language = window.localStorage.getItem("language"),
    colorArray = ['#141614', '#E8BF6A', '#1677DD', '#E81B0E', '#075bba', '#E88D2F', '#5BE817', '#C370E8',];


/**
 *  http post method
 * @param url
 * @param param js 对象
 * @param done 响应完成后的callback
 */
function httpPost(url, param, done) {
    httpRequest('post', url, param, true, done);
}

/**
 *  http post method
 * @param url
 * @param param js 对象
 * @param done 响应完成后的callback
 */
function httpGet(url, param, done) {
    httpRequest('get', url, param, true, done);
}


/**
 *  http get method sync
 * @param url
 * @param param js 对象
 * @param done 响应完成后的callback
 */
function httpGetSync(url, param, done) {
    httpRequest('get', url, param, false, done);
}

/**
 * http 请求
 * @param method
 * @param url
 * @param param
 * @param done
 */
function httpRequest(method, url, param, async, done) {
    if (isTest) {
        console.log("---------------------" + new Date().getTime() + "-------------------------------------------------------------");
        console.log("----->请求URL: " + url);
        console.log("----->请求参数: ");
        console.log(param);
    }
    var xhr = new XMLHttpRequest();
    if (method == 'get' && param != null) {
        var s = object2QueryString(param);
        if (s.length > 0) {
            url = url + "?" + object2QueryString(param);
        }
    }
    if (url)
        xhr.open(method, url, async);
    if (method == 'post') {
        xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    }
    xhr.setRequestHeader("AccessToken", window.localStorage.getItem("token"));
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var res = JSON.parse(xhr.responseText);
            if (isTest) {
                console.log("----->响应结果: ");
                console.log(res);
                console.log("-----------------------------------------------------------------------------------------------");
            }
            if (interceptor(res)) {
                done(res);
            }
        }
    };
    if (method == 'post') {
        xhr.send(JSON.stringify(param));
    } else {
        xhr.send();
    }
}


/**
 * 拦截器
 * @param res
 * @returns {boolean} true 通过，false拦截
 */
function interceptor(res) {
//    do something
//     console.log("进入拦截器---------")
    if (res.code == 7) {
        window.location.href = "/";
        return false;
    }
    return true;
}


/**
 * 将 js 对象转换为 query string
 * @param obj
 * @returns {string}  key=value&k2=v2
 */
function object2QueryString(obj) {
    var queryStr = "";
    for (var f in obj) {
        queryStr += f + "=" + obj[f] + "&";
    }
    return queryStr.slice(0, queryStr.length - 1);
}

/**
 * xor 简单加密
 * @param text
 * @returns {string}
 */
function xor(text) {
    if (!text) return "";
    var n = "";
    for (var i = 0; i < text.length; i++)
        n += String.fromCharCode(text[i].charCodeAt() ^ 17);
    return n;
}


function log(msg) {
    if (isTest)
        console.log(msg)
}

function isPhone(phone) {
    return /^1\d{10}$/.test(phone);
}

function isEmail(email) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
}


/**
 * 获取请求url中的指定名称参数
 * @param name
 * @returns {*}
 */
function getQueryString(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if (r != null) return decodeURI(r[2]);
    return null;
}


function Map() {
    var slet = this;
    var m = {};
    // 添加
    slet.put = function (key, value) {
        m[key] = value;
    };

    //获取
    slet.get = function (key) {
        return m[key];
    };

    //删除
    slet.remove = function (key) {
        if (m[key]) {
            delete m[key];
        }
    };

    // 是否存在
    slet.has = function (key) {
        for (k in m) {
            if (k === key) {
                return true;
            }
        }
        return false;
    };

    //返回size
    slet.size = function () {
        var size = 0;
        for (key in m) {
            size++
        }
        return size;
    };

    // 获取所有key
    slet.keys = function () {
        var arr = [];
        for (key in m) {
            arr.push(key)
        }
        return arr;
    };

    //获取所有 value
    self.values = function () {
        var arr = [];
        for (key in m) {
            arr.push(m[key])
        }
        return arr;
    };

    //遍历
    slet.forEach = function (call) {
        for (key in m) {
            call(key, m[key])
        }
    };

    slet.toJson = function () {
        return JSON.stringify(m);
    }
}


/**
 * 通过字符串hash获取颜色
 * @param string
 * @returns {string}
 */
function getColorByHash(string) {
    var index = 0;
    index = (Math.abs(stringHashCode(string))) % (colorArray.length);
    return colorArray[index];
}

/**
 * 计算字符串hash
 * @param str
 * @returns {number}
 */
function stringHashCode(str) {
    var hash = 0;
    if (str != null && str.length > 0) {
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = 31 * hash + char;
            hash = hash & hash;
        }
    }
    return hash;
}




