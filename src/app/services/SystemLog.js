/**
 * Created by GHostEater on 15-May-17.
 */
angular.module('b')
  .factory("SystemLog", function(Host,$http,$q,Loc,Ranker,CurrentUser){
    function getAll(min,max){
      return $http.get(Host.host+'/system-log/',{params:{min:min,max:max}})
        .then(function(response){
          return response.data;
        })
        .catch(function(response){
          return $q.reject(response.status);
        });
    }
    function add(action){
      var role = Ranker.get();
      var user = CurrentUser.profile.last_name.toUpperCase()+", "+CurrentUser.profile.first_name;
      Loc.get()
        .then(function(data){
          log(data);
        });
      function log(location) {
        return $http({
          method: 'POST',
          url: Host.host+'/system-log/',
          data:{
            action: action,
            user: user,
            role: role,
            date: new Date(),
            location: location
          }
        })
          .then(function(response){
            return response.status;
          })
          .catch(function(response){
            return $q.reject(response.status);
          });
      }
    }
    return{
      getAll: getAll,
      add: add
    }
  });
