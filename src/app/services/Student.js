angular.module('b')
  .factory('Student', function ($resource,Host) {
    return $resource(Host.host+'/student/:userId/',{userId:'@userId'},{
      get:{
        method: 'get'
      },
      upload:{
        url: Host.host+'/student/new/',
        method: 'post'
      },
      dept:{
        isArray: true,
        url: Host.host+'/student/dept/',
        method: 'get'
      },
      autoWithdraw:{
        url: Host.host+'/student/auto-withdraw/',
        method: 'get'
      }

    });
  });
