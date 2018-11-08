/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('PaymentToMajorDeleteCtrl',function (id,toastr,$uibModalInstance,PaymentToMajor,SystemLog) {
    var vm = this;
    vm.ok = function () {
      PaymentToMajor.remove({id:id}).$promise
        .then(function(){
          SystemLog.add("Delete Payment To Major");
          toastr.success("Payment To Major Assignment Removed");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Error");
        });
    }
  });
