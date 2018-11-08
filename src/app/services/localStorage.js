/**
 * Created by GHostEater on 20-Feb-16.
 */
(function () {
    'use strict';
angular.module("b")
    .factory("localStorage",function($window){
        var store = $window.localStorage;

        function add (key,value){
            value = angular.toJson(value);
            store.setItem(key,value);
        }
        function get (key){
            var value = store.getItem(key);
            if(value){
                value = angular.fromJson(value);
            }
            return value;
        }
        function remove (key){
            store.removeItem(key);
        }
        return{
            add: add,
            get: get,
            remove: remove
        }
    });
})();