angular.module('b')
  .factory('CollegeOfficer', function ($resource,Host) {
    return $resource(Host.host+'/college-officer/:user/',{user:'@user'});
  });
