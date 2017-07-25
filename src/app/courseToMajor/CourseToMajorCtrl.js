/**
 * Created by GHostEater on 16-Jun-17.
 */
angular.module('b')
  .controller("CourseToMajorCtrl",function (CourseToMajor,College,CollegeOfficer,Dept,Major,Level,toastr,lodash,$uibModal,CurrentUser) {
    var vm = this;
    vm.user = CurrentUser.profile;
    College.query().$promise
      .then(function (data) {
        vm.colleges = data;
        getCO();
      });
    vm.levels = Level.query();
    vm.d = Dept.query();
    vm.m = Major.query();
    vm.getDepts = getDepts;
    vm.getMajors = getMajors;
    vm.getMajorCourses = getMajorCourses;
    vm.add = add;
    vm.remove = remove;
    function getCO() {
     if(vm.user.type === '5'){
      CollegeOfficer.get({userId:vm.user.id}).$promise
        .then(function (data) {
          vm.collegeOfficer = data;
          getDepts(vm.collegeOfficer.college);
        });
    }
    }

    function getDepts(college){
      vm.depts = lodash.filter(vm.d,{college:college});
    }
    function getMajors(dept){
      vm.majors = lodash.filter(vm.m,{dept:dept});
    }
    function getMajorCourses(id){
      vm.major = lodash.find(vm.m,{id:Number(id)});
      vm.majorCourses = CourseToMajor.query({majorId:id});
    }
    function add(majorId){
      var options = {
        templateUrl: 'app/courseToMajor/courseToMajorAdd.html',
        controller: "CourseToMajorAddCtrl",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          majorId: function(){
            return majorId;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getMajorCourses(vm.major.id);
        });
    }
    function remove(id){
      var options = {
        templateUrl: 'app/courseToMajor/courseToMajorDelete.html',
        controller: "CourseToMajorDeleteCtrl",
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
          getMajorCourses(vm.major.id);
        });
    }
  });
