
// origin{} --> target{}
//原始值   数组   对象
//深度克隆
function deepClone(origin, target) {
    var target = target || {},
        compareStr = '[object Array]';
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] != null && typeof origin[prop] == 'object') {
                target[prop] = Object.prototype.toString.call(origin[prop]) == compareStr ? [] : {};
                deepClone(target[prop], origin[prop]);
                // if(Object.prototype.toString.call(origin[prop]) == '[object Array]'){
                //     target[prop] = [];
                //     deepClone(target[prop], origin[prop]);
                // }else if(Object.prototype.toString.call(origin[prop]) == '[object Object]'){
                //     target[prop] = {};
                //     deepClone(target[prop], origin[prop]);
                // }
            } else {
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}
// []-->'array', {}--> 'object', null-->'null',
//new Number... --> '[object Number]'...其他与typeof一样
function myTypeof(arg) {
    var res = undefined;
    if (typeof arg == 'object') {//array obj null 
        if (Object.prototype.toString.call(arg) == '[object Array]') {
            res = 'array';
        } else if (Object.prototype.toString.call(arg) == '[object Object]') {
            res = 'object';
        } else if (arg == null) {
            res = 'null';
        } else {
            res = Object.prototype.toString.call(arg);
        }
    } else {
        res = typeof arg;
    }
    return res;
}

//数组去重 返回一个新数组
Array.prototype.unique = function () {
    var obj = {};
    var newArr = [];
    var len = this.length;
    var i = 0;
    while (i < len) {
        if (!obj[this[i]]) {
            obj[this[i]] = 1;
            newArr.push(this[i]);
        } else {
            obj[this[i]]++;
        }
        i++;
    }
    return newArr;
}
// var arr = [1,2,3,1,2,3, 'a', 'c', 'a'];
// var a = arr.unique();

//继承：圣杯模式 自己原型加属性不影响继承的原型
var inherit = (function () {
    var F = function () { };
    return function (target, origin) {
        F.prototype = origin.prototype;
        target.prototype = new F();
        target.prototype.constructor = target;
        target.prototype.uber = origin.prototype; //把真正的父级记录下来，预防之后会使用到
    }
})();
//test:
// Father.prototype.name = {
//     ha:'ss',
//     age: 122
// };
// function Father() {

// }
// function Son() {

// }
// inherit(Son, Father);
// var son = new Son();
// var father = new Father();

//遍历元素节点树
Element.prototype.traverse = function () {

}

//返回元素e的第n层祖先元素节点
function retAncstor(elem, n) {
    var ans = elem;
    while (ans && n) {
        ans = ans.parentElement;
        n--;
    }
    return ans;
}

//返回元素e的第n个兄弟元素节点，n为正，返回后面的兄弟元素节点，n为负，返回前面的，n为0，返回自己
function getSiblings(elem, n) {
    while (elem && n) {
        if (n > 0) {
            elem = elem.nextSibling;
            n--;
        } else if (n < 0) {
            elem = elem.previousElementSibling;
            n++;
        } else {
            return elem;
        }
    }
    return elem;
}

//封装insertAfter
Element.prototype.insertAfter = function (targetNode, afterNode) {
    var beforeNode = afterNode.nextElementSibling;
    if (beforeNode == null) {
        this.appendChild(targetNode);
    } else {
        this.insertBefore(targetNode, afterNode);
    }
}
//将目标节点内部节点顺序逆序




//优化网络请求-1： 节流
//场景： 窗口调整(resize)  页面滚动(scroll)  抢购疯狂点击(mousedown)
//wait: 等待时间    handler:处理函数
function throttle(handler, wait) {
    var lastTime = 0;
    return function (e) {
        var nowTime = new Date().getTime();
        if (nowTime - lastTime > wait) {
            handler.apply(this, arguments);
            lastTime = nowTime;
        }
    }
}

//优化网络请求-2：防抖
//场景：实时搜索 拖拽
//调用实例： oInput.oninput = debounce(handler, 1000);
function debounce(handler, delay) {
    var timer = null;
    return function (e) {
        var _self = this,
            _args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            handler.apply(_self, _args);
        }, delay);
    }
}

//bind的模拟实现  
//总结：
//1. 函数A调用bind方法时，传递的参数o, x, y, ..
//2. 返回新的函数B
//3. 函数B在执行的时候 具体功能还是A  只是this指向变成了o
//4. 函数B在执行的时候 传递的参数会拼接到x, y,...后面，再执行
//5. new B() 方式执行时构造函数依旧为A， bind(o) 不会起到作用

Function.prototype.newBind = function (target) {
    //target改变返回函数执行的this指向
    var self = this;
    var args = [].slice.call(arguments, 1);
    var temp = function () {};
    var f = function () {
        var _arg = [].slice.call(arguments, 0);
        //真正执行的其实是 self
        return self.apply(this instanceof temp ? this : (target || window), args.concat(_arg));
    }
    temp.prototype = self.prototype;
    f.prototype = new temp();
    return f;
}

//getElementsByClassName 做一个兼容
Element.prototype.getElementsByClassName = Document.prototype.getElementsByClassName
    = document.getElementsByClassName || function (_className) {
        var allDomArr = document.getElementsByTagName('*'); //获取所有元素
        var lastDomArr = [];
        for (var i = allDomArr.length - 1; i > -1; i--) {
            var domClassName = allDomArr[i].className.split(' ');
            for (var j = 0; j < domClassName.length; j++) {
                if (domClassName[j].indexOf(_className) == 0 && domClassName[j].length == _className.length) {
                    lastDomArr.push(allDomArr[i]);
                    break;
                }
            }
        }
        return lastDomArr;
    }

    //ajax 
    function ajax( method, url, data, isAsync, callback ) {
        //1.create ajax object
        var xhr = null;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{
            xhr = new ActiveXObject('Microsoft.XMLHttp');
        }
        //2.initialize
        //3.send request
        if(method == 'get' || method == 'GET'){
            xhr.open('GET', url + '?' + data, isAsync);
            xhr.send();
        }else if(method == 'post'|| method == 'POST'){
            xhr.open('POST', url, isAsync);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        }else {
            alert('method is only GET or POST');
        }
        //4.response
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    callback(xhr.responseText);
                }
            }
        }
    }