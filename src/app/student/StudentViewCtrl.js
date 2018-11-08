/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 01-Mar-18.
 */
angular.module('b')
  .controller('StudentViewCtrl',function ($stateParams,Access,Student) {
    Access.general();
    var vm = this;
    vm.student = Student.get({user:$stateParams.id});
  });
