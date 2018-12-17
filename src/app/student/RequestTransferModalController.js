/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */
angular.module('b')
  .controller('RequestTransferModalController', function (Session,College,Dept,Major,IntraUni,toastr,$uibModalInstance,SystemLog,CurrentUser) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.session = Session.getCurrent();

    vm.ok = function () {
      if(vm.form.$dirty && vm.form.$valid){
        var request = {
          major: vm.major.id,
          reason: vm.reason,
          status: 0,
          date: new Date(),
          session: vm.session.id
        };
        IntraUni.save(request).$promise
          .then(function () {
            SystemLog.add("Sent Intra-University Transfer Request");
            toastr.success("Intra-University Transfer Request Sent");
            $uibModalInstance.close();
          }).catch(function () {
            toastr.warning("Unable to Send Intra-University Transfer Request");
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
