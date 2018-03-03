/**
 * Created by GHostEater on 08-Apr-16.
 */
angular.module('b')
  .factory('Host',function($location){
    var local = 'http://127.0.0.1:2000/api';
    var server = 'http://api.fuo.edu.ng/api';
    var host = "";
    function test(){
      if($location.absUrl().startsWith('http://localhost:3000')){
        host = local;
        return host;
      }
      else{
        host = server;
        return host;
      }
    }
    return{
      host: host,
      test: test
    };
  });
