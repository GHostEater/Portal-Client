angular.module('b')
  .factory('Session', function ($resource,Host) {
    return $resource(Host.host+'/session/:id/', {id:'@id'},{
      getCurrent:{
        method: 'get',
        url: Host.host+'/session-current/1/'
      },
      actions:{
        method: 'get',
        url: Host.host+'/session-actions/'
      },
      save:{
        method: 'post',
        url: Host.host+'/session/new/'
      },
      setCurrent:{
        method: 'post',
        url: Host.host+'/session/set-current/'
      },
      setAdmission:{
        method: 'post',
        url: Host.host+'/session/set-admission/'
      },
      patch:{
        method: 'patch'
      }
    });
  });
