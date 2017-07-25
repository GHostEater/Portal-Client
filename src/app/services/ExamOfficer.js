angular.module('b')
  .factory('ExamOfficer',function ($resource, Host) {
    return $resource(Host.host+'/exam-officer/:lecturerId/',{lecturerId:'@lecturerId'});
  });
