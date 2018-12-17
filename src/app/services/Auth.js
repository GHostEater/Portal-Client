/**
 * Created by GHostEater on 19-Feb-16.
 */
angular.module("b")
  .factory("Auth",function(Host,$resource){
    return $resource(Host.host+'/login/',{},{
      login: {
        method: 'post'
      },
      getToken: {
        url: Host.host+'/auth/token/get/',
        method: 'post'
      },
      verifyToken:{
        url: Host.host+'/auth/token/verify/',
        method: 'post'
      },
      pass_reset:{
        url: Host.host+'/auth/pass-reset/',
        method: 'post'
      }
    });
  });
