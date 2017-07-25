/**
 * Created by GHostEater on 29-May-17.
 */
angular.module('b')
  .controller("GraduatingListCtrl",function(CurrentUser,Lecturer,Hod,LevelAdviser,Dept,College,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window) {
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
          angular.forEach(vm.user.levelAdviser.level,function (level) {
            vm.levels.push(lodash.find(vm.lvls,{id:Number(level)}));
          });
        }
        else{
          vm.levels = data;
        }
        if(vm.user.examOfficer){
          vm.levels = data;
        }
      });
    if(vm.user.type === '6'){
      Lecturer.get({userId:CurrentUser.profile.id}).$promise
      .then(function(data) {
        vm.lecturer = data;
        vm.dept = {id:vm.lecturer.deptId,name:vm.lecturer.dept};
      });
    }
    function getStudents(){
      CourseResultGPA.dept({dept:vm.dept.id,session:vm.session.id}).$promise
        .then(function (data) {
          vm.gps = data;
          vm.students = lodash.filter(vm.gps,{status:1,student:{major:vm.major.name,level:vm.level.level}});
        });
       Hod.query().$promise
        .then(function (data) {
          vm.hod = lodash.find(data,{dept:vm.dept.name});
        });
    }
    vm.print = function(){
      $window.print();
    };
  });
