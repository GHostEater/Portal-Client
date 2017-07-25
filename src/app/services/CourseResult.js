angular.module('b')
  .factory('CourseResult',function ($resource,Host) {
    return $resource(Host.host+'/result/:id/',{id:'@id'},{
      student:{
        method: 'get',
        isArray: true,
        url: Host.host+'/result/student/'
      },
      course:{
        method: 'get',
        isArray: true,
        url: Host.host+'/result/course/'
      },
      dept:{
        method: 'get',
        isArray: true,
        url: Host.host+'/result/dept/'
      },
      uploadCA:{
        method: 'post',
        url: Host.host+'/result/new/'
      },
      uploadExam:{
        method: 'patch'
      },
      patch:{
        method: 'patch'
      }
    });
  });
