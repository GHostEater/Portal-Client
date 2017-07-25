/**
 * Created by GHostEater on 15-May-17.
 */
angular.module('b')
  .factory("Loc", function ($http,$q) {
    function get(){
      return $http.get('http://ipinfo.io/json')
        .then(function(response){
          var ip = response.data.ip;
          var city = response.data.city;
          var region = response.data.region;
          var country = response.data.country;
          return ip+', '+city+', '+region+', '+country;
        })
        .catch(function(response){
          return $q.reject(response.status);
        });
    }
    return{
      get: get
    }
  });
