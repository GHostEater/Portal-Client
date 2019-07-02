/* eslint-disable angular/controller-name,no-undef */
/**
 * Created by GHostEater on 18-Mar-18.
 */
angular.module('b')
  .controller('SessionAddCtrl',function (Session,$uibModalInstance,toastr,SystemLog) {
    var vm = this;
    vm.admission = false;
    vm.current = false;
    vm.start_date = moment().format("YYYY-MM-DD");

    vm.ok = function () {
      if(vm.form.$valid){
        var data = {
          session: vm.session,
          start_date: moment(vm.start_date).format("YYYY-MM-DD"),
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
