/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('PaymentToMajorCtrl',function (PaymentToMajor,College,CollegeOfficer,Dept,Major,Level,toastr,lodash,$uibModal,CurrentUser,Access) {
    Access.notStudent();
    var vm = this;
    vm.user = CurrentUser.profile;
    College.query().$promise
      .then(function (data) {
        vm.colleges = data;
        getCO();
      });
    vm.levels = Level.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.getMajorPayments = getMajorPayments;
    vm.add = add;
    vm.remove = remove;
    function getCO() {
      if(vm.user.type === '5'){
        CollegeOfficer.get({userId:vm.user.id}).$promise
          .then(function (data) {
            vm.collegeOfficer = data;
            vm.college = vm.collegeOfficer.college;
          });
      }
    }
    function getMajorPayments(id){
      vm.majorPayments = PaymentToMajor.query({majorId:id});
    }
    function add(major){
      var options = {
        templateUrl: 'app/paymentToMajor/paymentToMajorAdd.html',
        controller: "PaymentToMajorAddCtrl",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          major: function(){
            return major;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getMajorPayments(major.id);
        });
    }
    function remove(id){
      var options = {
        templateUrl: 'app/paymentToMajor/paymentToMajorDelete.html',
        controller: "PaymentToMajorDeleteCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          id: function(){
            return id;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getMajorPayments(vm.major.id);
        });
    }
  });
