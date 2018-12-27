/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 16-Dec-18.
 */
angular.module('b')
  .controller('RequestExtraUnitModalController', function(ExtraUnit,Session,Semester,toastr,$uibModalInstance,CurrentUser,SystemLog){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.ok = function(){
      if(vm.form.$dirty && vm.form.$valid){
        var request = {
          student: vm.user.student.id,
          date: new Date(),
          session: vm.session.id,
          semester: vm.semester.semester,
          status: 0,
          units: vm.units
        };
        ExtraUnit.save(request).$promise
          .then(function () {
            SystemLog.add("Sent Extra Unit Request");
            toastr.success("Extra Unit Request Sent");
            $uibModalInstance.close();
          })
          .catch(function () {
            toastr.warning("Unable to Send Extra Unit Request");
          });
      }
      else if(vm.form.$pristine && vm.form.$valid){
        toastr.info("No Changes");
        $uibModalInstance.close();
      }
      else if(vm.form.$invalid){
        toastr.error("Errors in form");
      }
    };
  });
