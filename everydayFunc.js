
// origin{} --> target{}
//原始值   数组   对象
//深度克隆
function deepClone (origin, target) {
    var target = target || {},
        compareStr = '[object Array]';
    for(var prop in origin){
        if(origin.hasOwnProperty(prop)){
            if(origin[prop] != null && typeof origin[prop] == 'object'){
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
function myTypeof (arg) {
    var res = undefined;
    if(typeof arg == 'object'){//array obj null 
        if(Object.prototype.toString.call(arg) == '[object Array]'){
            res = 'array';
        }else if(Object.prototype.toString.call(arg) == '[object Object]'){
            res = 'object';
        }else if(arg == null){
            res = 'null';
        }else{
            res = Object.prototype.toString.call(arg);
        }
    }else{
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
    while(i < len){
        if(!obj[this[i]]){
            obj[this[i]] = 1;
            newArr.push(this[i]);
        }else{
            obj[this[i]] ++;
        }
        i ++;
    }
   return newArr;
}
// var arr = [1,2,3,1,2,3, 'a', 'c', 'a'];
// var a = arr.unique();

//继承：圣杯模式 自己原型加属性不影响继承的原型
var inherit = (function () {
    var F = function () {};
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
    while(ans && n){
        ans = ans.parentElement;
        n --;
    }
    return ans;
}

//返回元素e的第n个兄弟元素节点，n为正，返回后面的兄弟元素节点，n为负，返回前面的，n为0，返回自己
function getSiblings(elem, n) {
    while(elem && n){
        if(n > 0){
            elem = elem.nextSibling;
            n --;
        }else if(n < 0){
            elem = elem.previousElementSibling;
            n ++;
        }else {
            return elem;
        }
    }
    return elem;
}

//封装insertAfter
Element.prototype.insertAfter = function (targetNode, afterNode) {
    var beforeNode = afterNode.nextElementSibling;
    if(beforeNode == null){
        this.appendChild(targetNode);
    }else{
        this.insertBefore(targetNode, afterNode);
    }
}
//将目标节点内部节点顺序逆序
