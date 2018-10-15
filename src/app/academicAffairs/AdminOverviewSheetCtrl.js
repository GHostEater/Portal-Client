/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 5/24/2016.
 */
angular.module("b")
  .controller("AdminOverviewSheetCtrl",function(Access,CurrentUser,Hod,LevelAdviser,Dept,College,CourseToMajor,CourseReg,CourseWaving,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window){
    Access.general();
    var vm = this;
    vm.print = print;
    vm.getResults = getResults;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.level_advisers = LevelAdviser.query();
    vm.majors = Major.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.hods = Hod.query();
    vm.levels = Level.query();
    if(vm.user.type === '5'){
      vm.college = College.get({id:vm.user.co.college.id});
    }
    if(vm.user.type === '8'){
      vm.college = College.get({id:vm.user.dean.college.id});
    }

    function getResults() {
      vm.level_adviser = lodash.find(vm.level_advisers,{major:vm.major,level:[vm.level]});
      vm.hod = lodash.find(vm.hods,{dept:{id:vm.dept.id}});

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
