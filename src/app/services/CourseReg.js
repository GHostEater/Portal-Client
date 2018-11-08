angular.module('b')
  .factory('CourseReg',function ($resource, Host) {
    return $resource(Host.host+'/course-reg/:id/',{id:'@id'},{
      student:{
        method: 'get',
        isArray: true,
        url: Host.host+'/course-reg/student/'
      },
      course:{
        method: 'get',
        isArray: true,
        url: Host.host+'/course-reg/course/'
      },
      getRegAndRawResult:{
        method: 'get',
        url: Host.host+'/course-reg/reg-and-raw-result/'
      },
      status:{
        method: 'get',
        url: Host.host+'/reg-status/1/'
      },
      save:{
        method: 'post',
        url:Host.host+'/course-reg/new/'
      },
      registerCourses:{
        method: 'post',
        url:Host.host+'/course-reg/register-courses/'
      },
      getRegistrableCourses:{
        method: 'get',
        url:Host.host+'/course-reg/registrable-courses/'
      }
    });
  });
