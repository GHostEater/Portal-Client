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
    vm.submit = submit;
    vm.submit2 = submit2;
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
              vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},paid:true});
              if(!vm.payment){
                vm.payment = lodash.find(vm.payments,{payment_type:{id:vm.payment_type.id},session:{id:vm.session.id}});
                if(!vm.payment){
                  vm.payment = {};
                  vm.payment.paid = false;
                  vm.payment.payment_type = {};
                }
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
      var hash_data = vm.payment_type.merchant_id+vm.payment_type.service_type_id+vm.order_id+vm.payment_type.amount+vm.remitaFinalResponse+vm.payment_type.api_key;
      Payment.hasher({enc:hash_data}).$promise
        .then(function (data) {
          vm.hash = data.hex;
          var da = {
            payment_type: vm.payment_type.id,
            student: vm.user.student.id,
            session: vm.session.id,
            level: vm.user.student.level.id,
            order_id: vm.order_id,
            status: "Pending",
            date: new Date()
          };
          Payment.save(da).$promise
            .then(function (data) {
              vm.payment = data;
              var d = {
                payment: vm.payment.id,
                payerName: vm.user.last_name+" "+vm.user.first_name,
                payerEmail: vm.user.email,
                payerPhone: vm.user.student.user.phone,
                amount: vm.payment_type.amount,
                matricNo: $filter('matricNo')(vm.user.username),
                level: vm.user.student.level.level,
                dept: vm.user.student.major.dept.name
              };
              Payment.generate_rrr(d).$promise
                .then(function (data) {
                  vm.payment = data;
                });
            });
        });
    }
    function submit(){
      var hash_data = vm.payment_type.merchant_id+vm.payment_type.service_type_id+vm.order_id+vm.payment_type.amount+vm.remitaFinalResponse+vm.payment_type.api_key;
        Payment.hasher({enc:hash_data}).$promise
          .then(function (data) {
            vm.hash = data.hex;
            var da = {
              payment_type: vm.payment_type.id,
              student: vm.user.student.id,
              session: vm.session.id,
              level: vm.user.student.level.id,
              order_id: vm.order_id,
              status: "Pending",
              date: new Date()
            };
            Payment.save(da).$promise
              .then(function (data) {
                vm.payment = data;
                vm.remita = true;
                $("form.remitaForm").submit();
              });
          });
    }
    function submit2(){
      var hash_data = vm.payment.payment_type.merchant_id+vm.payment.rrr+vm.payment.payment_type.api_key;
      Payment.hasher({enc:hash_data,key:vm.payment.payment_type.api_key}).$promise
        .then(function (data) {
          vm.hash = data.hex;
          vm.remita = true;
          $("form.remitaForm2").submit();
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
