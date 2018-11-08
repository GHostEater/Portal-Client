/* eslint-disable angular/controller-name */
angular.module("b")
  .controller("CourseSlipCtrl",function(CourseReg,Student,Semester,toastr,lodash,Session,CurrentUser,Access,$uibModal,$window){
    Access.student();
    var vm = this;
    vm.counter = 0;
    vm.student = CurrentUser.profile.student;
    vm.user = CurrentUser.profile;
    vm.deleteCourse = deleteCourse;
    vm.print = print;
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester() {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getCourses();
        });
    }
    function getCourses() {
      CourseReg.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.courses = lodash.filter(data,{course:{semester:Number(vm.semester.semester)},session:{id:vm.session.id}});
          for(var i = 0; i < vm.courses.length; i++){
            vm.counter += Number(vm.courses[i].course.unit);
          }
        });
    }
    function deleteCourse(id){
      var options = {
        templateUrl: 'app/courseReg/courseRegDelete.html',
        controller: "CourseRegDeleteCtrl",
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
          getCourses();
        });
    }
    function print(){
      $window.print();
    }
  });
