angular.module('b')
  .factory('CourseResultUploadLog',function ($resource,Host) {
    return $resource(Host.host+'/upload-log/:id/',{id:'@id'},{
    });
  });
