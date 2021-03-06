/* eslint-disable angular/controller-name,no-undef,angular/angularelement */
/**
 * Created by GHostEater on 26-Apr-18.
 */
angular.module('b')
  .controller('StudentPayCtrl',function (PaymentType,Access,lodash,Host,$sce,$window,Random,$state,$filter,Payment,$stateParams,SystemLog,Session,$location,Remita,toastr,CurrentUser,$rootScope) {
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
    vm.narration = $stateParams.narration;
    if(!vm.narration){
      vm.narration = '';
    }
    vm.generate_order_id = generate_order_id;
    vm.reload = reload;
    vm.check_status = check_status;
    vm.generateRrr = generateRrr;
    vm.back = back;

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
              if(vm.payment_type.tuition === true){
                Payment.tuition_fee_clearance({student:vm.user.student.id}).$promise
                  .then(function (data) {
                    vm.pay_status = data.pay_status;
                    if(vm.pay_status.p_total === true){
                      vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id},paid:true});
                    }
                    else if(vm.pay_status.p_total === false){
                      vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id},paid:false});
                      if(!vm.payment){
                        vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},order_id:vm.order_id,level:{id:vm.user.student.level.id},paid:true});
                        if(!vm.payment){
                          vm.payment = {};
                          vm.payment.paid = false;
                          vm.payment.payment_type = {};
                          PaymentType.tuition_student({student:vm.user.student.id}).$promise
                            .then(function (data) {
                              vm.tuition_total = data.total;
                              vm.tuition_payments = lodash.filter(vm.payments,{payment_type:{tuition:true},level:{id:vm.user.student.level.id},paid:true});
                              vm.tuition_payments_total = 0;
                              angular.forEach(vm.tuition_payments,function (pay) {
                                vm.tuition_payments_total += Number(pay.amount);
                              });
                              vm.pay_remaining = Number(vm.tuition_total) - Number(vm.tuition_payments_total);
                              if(vm.pay_remaining < Number(vm.payment_type.amount)){
                                vm.payment_type.amount = vm.pay_remaining;
                              }
                            });
                        }
                      }
                    }
                    if(vm.payment.rrr){
                      hash_pay();
                    }
                  });
              }
              else if(vm.payment_type.tag === 'fine' || vm.payment_type.tag === 'summer'){
                vm.payment = {};
                vm.payment.paid = false;
                vm.payment.payment_type = {};
              }
              else{
                vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id},paid:true});
                if(!vm.payment){
                  vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id}});
                  if(!vm.payment){
                    vm.payment = {};
                    vm.payment.paid = false;
                    vm.payment.payment_type = {};
                  }
                }
                if(vm.payment.rrr){
                  hash_pay();
                }
              }
              generate_order_id();
            });
        });
    }
    function generate_order_id() {
      var order_id = $rootScope.school_reciept_name + Random.string(13);
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
        date: new Date(),
        payerName: vm.user.last_name+" "+vm.user.first_name,
        payerEmail: vm.user.email,
        payerPhone: vm.user.student.user.phone,
        amount: vm.payment_type.amount,
        matricNo: $filter('matricNo')(vm.user.username),
        dept: vm.user.student.major.dept.name,
        narration: vm.narration
      };
      Payment.generate_rrr(request).$promise
        .then(function (data) {
          vm.payment = data;
          hash_pay();
          SystemLog.add("Generated RRR for "+vm.payment.payment_type.name);
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
          $rootScope.$broadcast('paymentMade');
        });
    }
    function reload(){
      getPayment();
      $rootScope.$broadcast('paymentMade');
    }
    function back() {
      $window.history.back();
    }
  });
