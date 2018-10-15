/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('PaymentToMajorAddCtrl',function (PaymentType,Level,PaymentToMajor,toastr,lodash,major,Major,$uibModalInstance,SystemLog) {
    var vm = this;
    vm.paymentSelect = 0;
    vm.selectPayment = selectPayment;
    vm.deSelectPayment = deSelectPayment;
    vm.payments = PaymentType.query();
    vm.levels = Level.query();
    vm.major = major;
    vm.jme = false;
    vm.de = false;
    vm.conversion = false;
    vm.pt = false;

    function selectPayment(id){
      vm.payment = lodash.find(vm.payments,{id:id});
      vm.paymentSelect = 1;
    }
    function deSelectPayment(){
      delete vm.payment;
      vm.paymentSelect = 0;
    }
    vm.ok = function() {
      var data = {
        payment_type: vm.payment.id,
        major: vm.major.id,
        level: vm.level.id,
        jme: vm.jme,
        de: vm.de,
        conversion: vm.conversion,
        pt: vm.pt
      };
      PaymentToMajor.add(data).$promise
        .then(function(){
          SystemLog.add("Add Payment To Major");
          toastr.success("Payment Added Successfully");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Error");
        });
    };
  });
