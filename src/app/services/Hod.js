angular.module('b')
  .factory('Hod',function ($resource,Host) {
    return $resource(Host.host+'/hod/:lecturerId/',{lecturerId:'@lecturerId'});
  });
