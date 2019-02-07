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
        url: Host.host+'/result/upload-ca/'
      },
      uploadExam:{
        method: 'post',
        url: Host.host+'/result/upload-exam/'
      },
      getReleaseStatus:{
        method: 'get',
        url: Host.host+'/release-status/1/'
      },
      setReleaseStatus:{
        method: 'patch',
        url: Host.host+'/release-status/1/'
      },
      getUploadStatus:{
        method: 'get',
        url: Host.host+'/upload-status/1/'
      },
      setUploadStatus:{
        method: 'patch',
        url: Host.host+'/upload-status/1/'
      },
      patch:{
        method: 'patch'
      },
      editCA:{
        method: 'post',
        url: Host.host+'/result/edit-ca/'
      },
      editExam:{
        method: 'post',
        url: Host.host+'/result/edit-exam/'
      }
    });
  });
