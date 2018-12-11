angular.module('b')
  .factory('Application',function ($resource,Host) {
    return $resource(Host.host+'/application/:id/',{id:'@id',email:'@email'},{
      save: {
        method: 'post',
        url: Host.host+'/application/new/'
      },
      single:{
        method: 'get',
        url: Host.host+'/application/single/:email/'
      },
      patch:{
        method: 'patch'
      },
      email:{
        method: 'get',
        url: Host.host+'/application/email/'
      }
    });
  });
