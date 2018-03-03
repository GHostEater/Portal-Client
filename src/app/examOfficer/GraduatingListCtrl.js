/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 29-May-17.
 */
angular.module('b')
  .controller("GraduatingListCtrl",function(CurrentUser,Lecturer,Hod,LevelAdviser,Dept,College,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window,Access) {
    Access.general();
    var vm = this;
    vm.getStudents = getStudents;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.majors = Major.query();
    Level.query().$promise
      .then(function(data){
        vm.levels = [];
        vm.lvls = data;
        if(vm.user.levelAdviser){
          vm.levels = vm.user.levelAdviser.level;
        }
        else{
          vm.levels = data;
        }
        if(vm.user.examOfficer || vm.user.hod){
          vm.levels = data;
        }
      });
    if(vm.user.type === '6'){
      vm.lecturer = vm.user.lecturer;
      vm.dept = vm.user.lecturer.dept;
    }
    function getStudents(){
      CourseResultGPA.dept({dept:vm.dept.id,session:vm.session.id}).$promise
        .then(function (data) {
          vm.gps = data;
          vm.students = lodash.filter(vm.gps,{status:1,student:{major:vm.major,level:vm.level}});
        });
       Hod.query().$promise
        .then(function (data) {
          vm.hod = lodash.find(data,{dept:vm.dept});
        });
    }
    vm.print = function(){
      $window.print();
    };
  });
