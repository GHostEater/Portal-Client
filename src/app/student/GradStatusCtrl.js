/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */
angular.module('b')
  .controller('GradStatusCtrl', function (CurrentUser,Student,Access,$window,Session,Semester) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.student = Student.get({user:vm.user.id});
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();

    vm.print = function () {
      $window.print();
    }
  });
