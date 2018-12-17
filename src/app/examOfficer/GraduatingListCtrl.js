/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 29-May-17.
 */
angular.module('b')
  .controller("GraduatingListCtrl",function(CurrentUser,toastr,Lecturer,GradePoint,Hod,LevelAdviser,Dept,College,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window,Access) {
    Access.notStudent();
    var vm = this;
    vm.getStudents = getStudents;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.majors = Major.query();
    vm.grade_points = GradePoint.query();
    Level.query().$promise
      .then(function(data){
        vm.levels = [];
        vm.lvls = data;
        if(vm.user.levelAdviser){
          vm.levels = vm.user.levelAdviser.level;
          vm.major = vm.user.levelAdviser.major;
        }
        else{
          vm.levels = data;
        }
        if(vm.user.examOfficer || vm.user.hod){
          vm.levels = data;
        }
      });
    if(vm.user.type === '6'){
      vm.college = vm.user.lecturer.dept.college;
      vm.dept = vm.user.lecturer.dept;
    }
    if(vm.user.type === '5'){
      vm.college = vm.user.co.college;
    }
    function getStudents(){
      CourseResultGPA.dept({dept:vm.dept.id,session:vm.session.id}).$promise
        .then(function (data) {
          vm.gps = data;
          vm.students = lodash.filter(vm.gps,{status:1,student:{major:{id:vm.major.id},level:{id:vm.level.id}}});
        });
       Hod.query().$promise
        .then(function (data) {
          vm.hod = lodash.find(data,{dept:{id:vm.dept.id}});
        });
       vm.grades = lodash.orderBy(vm.grade_points,['upper_limit'],['desc']);
       vm.high_grade = vm.grades[0];
    }
    vm.graduate_students = function () {
      var request = [];
      angular.forEach(vm.students,function (student) {
        var std = {id:student.student.id};
        request.push(std);
      });
      Student.graduate(request).$promise
        .then(function () {
          toastr.success("Students Graduated");
        });
    };
    vm.print = function(){
      $window.print();
    };
  });
