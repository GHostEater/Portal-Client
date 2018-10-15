/* eslint-disable angular/controller-name,angular/controller-name */
/**
 * Created by GHostEater on 5/24/2016.
 */
angular.module("b")
  .controller("BroadSheetCtrl",function(Access,CurrentUser,Hod,LevelAdviser,CourseResultGPA,Level,Major,Session,Semester,lodash,$window){
    Access.lecturer();
    var vm = this;
    vm.print = print;
    vm.getResults = getResults;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.levelAdvisers = LevelAdviser.query();
    vm.majors = Major.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.lecturer = vm.user.lecturer;
    vm.hods = Hod.query();
    if(vm.user.examOfficer || vm.user.hod){
      Level.query().$promise
        .then(function (data) {
          vm.levels = data;
        });
    }
    else if(vm.user.levelAdviser){
      vm.levels = vm.user.levelAdviser.level;
    }

    function getResults() {
      if (vm.user.examOfficer) {
        vm.hod = lodash.find(vm.hods, {dept: vm.user.examOfficer.dept});
        vm.levelAdviser = lodash.find(vm.levelAdvisers, {major: vm.major, level: [vm.level]});
      }
      else if (vm.user.levelAdviser) {
        vm.hod = lodash.find(vm.hods, {dept: vm.user.levelAdviser.lecturer.dept});
        vm.levelAdviser = vm.user.levelAdviser;
        vm.major = vm.user.levelAdviser.major;
      }

      var data = {
        session: vm.session.id,
        semester: vm.semester.semester,
        major: vm.major.id,
        level: vm.level.id
      };

      CourseResultGPA.rawResultAndCgpa(data).$promise
        .then(function (data) {
          vm.students = data.students;
          vm.total = data.total;
          vm.pass = data.pass;
          vm.pcso = data.pcso;
          vm.probation = data.probation;
          vm.withdrawal = data.withdrawal;
          vm.leave = data.leave;
          vm.sick = data.sick;
          vm.deferment = data.deferment;
          vm.suspension = data.suspension;
        });
    }
    function print(){
      $window.print();
    }
  });
