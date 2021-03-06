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
        method: 'get'
      },
      student:{
        url: Host.host+'/course-review/student/',
        method: 'get',
        isArray: true
      },
      std:{
        url: Host.host+'/course-review-student/',
        method: 'get',
        isArray: true
      },
      lecturer:{
        url: Host.host+'/course-review/lecturer/',
        method: 'get',
        isArray: true
      },
      dept:{
        url: Host.host+'/course-review/dept/',
        method: 'get',
        isArray: true
      },
      restrict:{
        url: Host.host+'/course-review-restrict/',
        method: 'get'
      }
    });
  });
