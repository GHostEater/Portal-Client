/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('CourseToMajorAddCtrl', function (Course,Level,CourseToMajor,toastr,lodash,major,$uibModalInstance,SystemLog) {
    var vm = this;
    vm.courseSelect = 0;
    vm.selectCourse = selectCourse;
    vm.deSelectCourse = deSelectCourse;
    vm.courses = Course.query();
    vm.levels = Level.query();
    vm.major = major;

    function selectCourse(course){
      vm.course = course;
      vm.courseSelect = 1;
    }
    function deSelectCourse(){
      delete vm.course;
      vm.courseSelect = 0;
    }
    vm.ok = function() {
      var data = {
        course: vm.course.id,
        major: vm.major.id,
        level: vm.level.id
      };
      CourseToMajor.add(data).$promise
        .then(function(){
          SystemLog.add("Add Course To Major");
          toastr.success("Course Added Successfully");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Error");
        });
    };
  });
