/**
 * Created by GHostEater on 08-Dec-17.
 */
angular.module('b')
  .factory('CourseReview',function ($resource,Host) {
    return $resource(Host.host+'/course-review/:id/',{id:'@id'},{
      save:{
        url: Host.host+'/course-review/new/',
        method: 'post'
      },
      patch:{
        method: 'patch'
      },
      course:{
        url: Host.host+'/course-review/course/',
        method: 'get',
        isArray: true
      },
      student:{
        url: Host.host+'/course-review/student/',
        method: 'get',
        isArray: true
      },
      lecturer:{
        url: Host.host+'/course-review/lecturer/',
        method: 'get',
        isArray: true
      }
    });
  });
