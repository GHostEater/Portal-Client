angular.module('b')
  .factory('LateReg',function ($resource,Host) {
    return $resource(Host.host+"/late-reg/:id/",{id:'@id'},{
      save:{
        method: 'post',
        url: Host.host+'/late-reg/new/'
      },
      patch:{
        method: 'patch'
      },
      log:{
        method: 'get',
        isArray: true,
        url: Host.host+'/late-reg-log/'
      },
      addLog:{
        method: 'post',
        url: Host.host+'/late-reg-log/new/'
      }
    });
  });
