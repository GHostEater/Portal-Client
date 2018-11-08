/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 05-Mar-18.
 */
angular.module('b')
  .controller('ExamOfficerCtrl',function (CurrentUser,ExamOfficer,lodash,$uibModal,Access) {
    Access.lecturer();
    var vm = this;
    vm.add = add;
    vm.replace = replace;
    vm.user = CurrentUser.profile;
    function get_exam_officer() {
      ExamOfficer.query().$promise
        .then(function (data) {
          vm.exam_officer = lodash.find(data,{dept:{id:vm.user.hod.dept.id}});
        });
    }get_exam_officer();

    function add(){
      var options = {
        templateUrl: 'app/hod/exam_officer_add.html',
        controller: "ExamOfficerAddCtrl",
        controllerAs: 'vm',
        size: 'sm'
      };
      $uibModal.open(options).result
        .then(function(){
          get_exam_officer();
        });
    }
    function replace(){
      var options = {
        templateUrl: 'app/hod/exam_officer_replace.html',
        controller: "ExamOfficerReplaceCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          officer: function(){
            return vm.exam_officer;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          get_exam_officer();
        });
    }
  });
