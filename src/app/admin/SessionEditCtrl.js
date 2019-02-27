/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 18-Mar-18.
 */
angular.module('b')
  .controller('SessionEditCtrl',function (Session,$uibModalInstance,toastr,SystemLog,session) {
    var vm = this;
    vm.session = session;

    vm.ok = function () {
      if(vm.form.$valid && vm.form.$dirty){
        vm.session.start_date = moment(vm.session.start_date).format("YYYY-MM-DD");
        Session.patch(vm.session).$promise
          .then(function () {
            toastr.success("Edited Session Successfully");
            SystemLog.add("Edited Session");
            $uibModalInstance.close();
          })
          .catch(function () {
            toastr.error("Error");
          });
      }
      else if(vm.form.$pristine){
        toastr.info("No Changes");
        $uibModalInstance.close();
      }
      else{
        toastr.error("Errors in form");
      }
    };
  });
