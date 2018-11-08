angular.module('b')
  .factory('ExamOfficer',function ($resource, Host) {
    return $resource(Host.host+'/exam-officer/:lecturer/',{lecturer:'@lecturer'},{
      patch:{
        method: "patch"
      },
      save:{
        method: 'post',
        url: Host.host+'/exam-officer/new/'
      }
    });
  });
