angular.module('b')
  .factory('CourseResultGPA',function ($resource,Host) {
    return $resource(Host.host+'/gpa/:id/',{id:'@id'},{
      student:{
        method: 'get',
        isArray: true,
        url: Host.host+'/gpa/student/'
      },
      dept:{
        method: 'get',
        isArray: true,
        url: Host.host+'/gpa/dept/'
      },
      save:{
        method: 'post',
        url: Host.host+'/gpa/new/'
      },
      patch:{
        method: 'patch'
      },
      rawResultAndCgpa:{
        method: 'get',
        url: Host.host+'/gpa/raw-result-and-cgpa/'
      },
      rawResultAndCgpaSpecific:{
        method: 'post',
        url: Host.host+'/gpa/raw-result-and-cgpa-specific/'
      },
      releaseResultAndCgpa:{
        method: 'get',
        url: Host.host+'/gpa/release-result-and-cgpa/'
      }
    });
  });
