angular.module("b")
  .controller("StudentListCtrl",function(CurrentUser,$uibModal,Student,lodash){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.view = view;
    vm.edit = edit;
    vm.students = [];
    Student.query().$promise
      .then(function (data) {
        if(vm.user.levelAdviser){
          vm.s = lodash.filter(data,{major:vm.user.levelAdviser.major});
          angular.forEach(vm.user.levelAdviser.level,function (level) {
            vm.t = lodash.filter(vm.s,{levelId:String(level)});
            angular.forEach(vm.t,function (s) {
              vm.students.push(s);
            });
          });
        }
        else if(vm.user.examOfficer){
          vm.students = lodash.filter(data,{dept:vm.user.examOfficer.dept});
        }
      });
    function view(matricNo){
      var options = {
        templateUrl: 'app/studentMgmt/studentView.html',
        controller: "StudentViewController",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          matricNo: function(){
            return matricNo;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
        });
    }
    function edit(matricNo){
      var options = {
        templateUrl: 'app/studentMgmt/studentEdit.html',
        controller: "StudentEditController",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          matricNo: function(){
            return matricNo;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
        });
    }
  });
