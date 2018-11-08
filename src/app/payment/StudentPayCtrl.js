/* eslint-disable angular/controller-name,no-undef,angular/angularelement */
/**
 * Created by GHostEater on 26-Apr-18.
 */
angular.module('b')
  .controller('StudentPayCtrl',function (PaymentType,Access,lodash,Host,$sce,$window,Random,$state,$filter,Payment,$stateParams,Session,$location,Remita,toastr,CurrentUser) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.remitaPost = $sce.trustAsResourceUrl(Remita.post);
    vm.remitaRrrResponse = $sce.trustAsResourceUrl(Remita.rrr_response);
    vm.remitaFinalResponse = $sce.trustAsResourceUrl(Remita.final_response);
    vm.remitaPay = $sce.trustAsResourceUrl(Remita.pay);
    vm.remita = false;
    vm.payment = {};
    vm.payment.paid = false;
    vm.payment.payment_type = {};
    vm.generate_order_id = generate_order_id;
    vm.reload = reload;
    vm.check_status = check_status;
    vm.generateRrr = generateRrr;

    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getPayment();
      });
    function getPayment() {
      PaymentType.get({id:$stateParams.payment}).$promise
        .then(function (data) {
          vm.payment_type = data;
          if(vm.payment_type.incur_charges){
            vm.charges = 350;
          }
          else{
            vm.charges = 0;
          }
          if($stateParams.amount){
            vm.payment_type.amount = Number($stateParams.amount);
          }
          if($stateParams.level){
            vm.user.student.level.id = $stateParams.level;
          }
          vm.payment_type.amount_orig = vm.payment_type.amount;
          vm.payment_type.amount += vm.charges;

          Payment.student({student:vm.user.student.id}).$promise
            .then(function (data) {
              vm.payments = data;
              vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id},paid:true});
              if(!vm.payment){
                vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id},session:{id:vm.session.id}});
                if(!vm.payment){
                  vm.payment = {};
                  vm.payment.paid = false;
                  vm.payment.payment_type = {};
                }
              }
              if(vm.payment.rrr){
                hash_pay();
              }
              generate_order_id();
            });
        });
    }
    function generate_order_id() {
      var order_id = "FUO-" + Random.string(13);
      Payment.order({order: order_id}).$promise
        .then(function () {})
        .catch(function () {
          vm.order_id = order_id;
        });
    }
    function generateRrr(){
      var request = {
        payment_type: vm.payment_type.id,
        student: vm.user.student.id,
        session: vm.session.id,
        level: vm.user.student.level.id,
        order_id: vm.order_id,
        status: "Pending",
        date: new Date()
      };
      Payment.save(request).$promise
        .then(function (data) {
          vm.payment = data;
          var request = {
            payment: vm.payment.id,
            payerName: vm.user.last_name+" "+vm.user.first_name,
            payerEmail: vm.user.email,
            payerPhone: vm.user.student.user.phone,
            amount: vm.payment_type.amount,
            matricNo: $filter('matricNo')(vm.user.username),
            level: vm.user.student.level.id,
            dept: vm.user.student.major.dept.name
          };
          Payment.generate_rrr(request).$promise
            .then(function (data) {
              vm.payment = data;
              hash_pay();
            });
        });
    }
    function hash_pay(){
      var hash_data = vm.payment.payment_type.merchant_id+vm.payment.rrr+vm.payment.payment_type.api_key;
      Payment.hasher({enc:hash_data}).$promise
        .then(function (data) {
          vm.hash = data.hex;
        });
    }
    function check_status(pay) {
      Payment.get_status({rrr:pay.rrr}).$promise
        .then(function () {
          getPayment();
        });
    }
    function reload(){
      var payment ='';
      var amount = '';
      var level = '';
      if($stateParams.payment){
        payment = $stateParams.payment;
      }
      if($stateParams.amount){
        amount = $stateParams.amount;
      }
      if($stateParams.level){
        level = $stateParams.level;
      }
      $location.url('/student/payment/pay/'+payment+'/'+amount+'/'+level);
      $window.location.reload();
    }
  });
