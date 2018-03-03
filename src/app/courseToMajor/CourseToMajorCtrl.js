/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 16-Jun-17.
 */
angular.module('b')
  .controller("CourseToMajorCtrl",function (CourseToMajor,College,CollegeOfficer,Dept,Major,Level,toastr,lodash,$uibModal,CurrentUser,Access) {
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.levels = Level.query();
    vm.d = Dept.query();
    vm.m = Major.query();
    vm.getDepts = getDepts;
    vm.getMajors = getMajors;
    vm.getMajorCourses = getMajorCourses;
    vm.add = add;
    vm.remove = remove;

    College.query().$promise
      .then(function (data) {
        vm.colleges = data;
        getCO();
      });
    function getCO() {
     if(vm.user.type === '5'){
       vm.collegeOfficer = vm.user.co;
       getDepts(vm.collegeOfficer.college);
     }
    }
    function getDepts(college){
      vm.depts = lodash.filter(vm.d,{college:{id:college.id}});
    }
    function getMajors(dept){
      vm.majors = lodash.filter(vm.m,{dept:{id:dept.id}});
    }
    function getMajorCourses(major){
      vm.majorCourses = CourseToMajor.query({major:major.id});
    }
    function add(major){
      var options = {
        templateUrl: 'app/courseToMajor/courseToMajorAdd.html',
        controller: "CourseToMajorAddCtrl",
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
          getMajorCourses(vm.major);
        });
    }
    function remove(major){
      var options = {
        templateUrl: 'app/courseToMajor/courseToMajorDelete.html',
        controller: "CourseToMajorDeleteCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          major: function(){
            return major;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getMajorCourses(vm.major);
        });
    }
  });
