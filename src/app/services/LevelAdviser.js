angular.module('b')
  .factory('LevelAdviser',function ($resource,Host) {
    return $resource(Host.host+'/level-adviser/:lecturerId/',{lecturerId:'@lecturerId'});
  });
