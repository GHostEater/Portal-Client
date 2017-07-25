/**
 * Created by GHostEater on 08-Apr-16.
 */
(function () {
    'use strict';
    angular.module('b')
        .factory('Host',function(){
            var host = 'http://127.0.0.1:2000/api';
            return{
                host: host
            }
        });
})();
