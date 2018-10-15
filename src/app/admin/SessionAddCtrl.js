/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 18-Mar-18.
 */
angular.module('b')
  .controller('SessionAddCtrl',function (Session,$uibModalInstance,toastr,SystemLog) {
    var vm = this;
    vm.admission = false;
    vm.current = false;

    vm.ok = function () {
      if(vm.form.$valid){
        var data = {
          session: vm.session,
          is_current: vm.current,
          is_admission: vm.admission
        };
        Session.save(data).$promise
          .then(function () {
            toastr.success("Added Session Successfully");
            SystemLog.add("Added Session");
            $uibModalInstance.close();
          })
          .catch(function () {
            toastr.error("Error");
          });
      }
      else{
        toastr.error("Errors in form");
      }
    };
  });
