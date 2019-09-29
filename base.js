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

const colorArray = ['#141614', '#E8BF6A', '#1677DD', '#E81B0E', '#075bba', '#E88D2F', '#5BE817', '#C370E8',];

/**
 * 通过字符串hash获取颜色
 * @param str
 * @returns {string} 颜色eg：#1677DD
 */
function getColorByStringHash(str) {
    let index;
    index = (Math.abs(stringHashCode(str))) % (colorArray.length);
    return colorArray[index];
}


/**
 * 计算字符串hash
 * @param str
 * @returns {number}
 */
function stringHashCode(str) {
    let hash = 0;
    if (str != null && str.length > 0) {
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = 31 * hash + char;
            hash = hash & hash;
        }
    }
    return hash;
}

/**
 * 字符串加密，
 * @param str 源字符串
 * @param count 加密次数 默认1次
 * @returns {*} 密文
 */
function stringEncrypted(str, count) {
    let r = str;
    count = count || 1;
    for (let i = 0; i < count; i++) {
        r = window.btoa(r);
    }
    return r;
}


/**
 * 分组
 * @param arr 源数组
 * @param condition 分组key条件
 */
function groupBy(arr, condition) {
    let res = {};
    if (arr != null) {
        for (let i = 0; i < arr.length; i++) {
            let key = condition(arr[i]);
            if (res[key] == null) {
                res[key] = [];
            }
            res[key].push(arr[i]);
        }
    }
    return res;
}


/**
 * 获取请求url中的指定名称参数
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}


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
 * @param method 请求方法get post
 * @param url  请求url
 * @param param 请求参数对象 object
 * @param done  回调函数
 */
function httpRequest(method, url, param, async, done) {
    let xhr = new XMLHttpRequest();
    if (method === 'get' && param != null) {
        let s = object2QueryString(param);
        if (s.length > 0) {
            url = url + "?" + object2QueryString(param);
        }
    }
    if (url)
        xhr.open(method, url, async);
    if (method === 'post') {
        xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    }
    xhr.setRequestHeader("AccessToken", window.localStorage.getItem("token"));
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let res = JSON.parse(xhr.responseText);
            if (interceptor(res)) {
                done(res);
            }
        }
    };
    if (method === 'post') {
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
    if (res.code === 7) {
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
    let queryStr = "";
    for (let f in obj) {
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
    let n = "";
    for (let i = 0; i < text.length; i++)
        n += String.fromCharCode(text[i].charCodeAt() ^ 17);
    return n;
}


//常用正则

function isPhone(phone) {
    return /^1\d{10}$/.test(phone);
}

function isEmail(email) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
}


/*
*
* 数据结构
*
* */


function Map() {
    let self = this;
    let m = {};
    // 添加
    self.put = function (key, value) {
        m[key] = value;
    };

    //获取
    self.get = function (key) {
        return m[key];
    };

    //删除
    self.remove = function (key) {
        if (m[key]) {
            delete m[key];
        }
    };

    // 是否存在
    self.has = function (key) {
        for (let k in m) {
            if (k === key) {
                return true;
            }
        }
        return false;
    };

    //返回size
    self.size = function () {
        let size = 0;
        for (let key in m) {
            size++
        }
        return size;
    };

    // 获取所有key
    self.keys = function () {
        let arr = [];
        for (let key in m) {
            arr.push(key)
        }
        return arr;
    };

    //获取所有 value
    self.values = function () {
        let arr = [];
        for (let key in m) {
            arr.push(m[key])
        }
        return arr;
    };

    //遍历
    self.forEach = function (call) {
        for (let key in m) {
            call(key, m[key])
        }
    };

    self.toJson = function () {
        return JSON.stringify(m);
    }
}