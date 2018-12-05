/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 03-Dec-18.
 */
angular.module('b')
  .controller('PaymentReferenceCtrl', function ($stateParams,Payment,$window,Access) {
    Access.student();
    var vm = this;
    vm.payment = Payment.get({id:$stateParams.id});

    vm.print = function () {
      $window.print();
    };
  });
