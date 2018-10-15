/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 08-Dec-17.
 */
angular.module('b')
  .controller('CourseReviewCtrl',function (CourseReview,CourseReg,CurrentUser,Session,Semester,lodash,$uibModal,Access,CourseAllocation) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.review = review;
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
      vm.lecturers = [];
      CourseReg.student({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.courses = lodash.filter(data,{session:{id:vm.session.id}});
          CourseAllocation.query({session:vm.session.id}).$promise
            .then(function(data){
              vm.alloc = data;
              angular.forEach(vm.courses,function (course) {
                vm.lect = lodash.filter(vm.alloc,{course:{id:course.course.id}});
                angular.forEach(vm.lect,function (lect) {
                  vm.lecturers.push(lect);
                });
              });
            });
        });
    }
    function review(course,lecturer){
      var options = {
        templateUrl: 'app/courseReview/courseReviewModal.html',
        controller: "CourseReviewModalCtrl",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          course: function(){
            return course;
          },
          lecturer: function(){
            return lecturer;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){});
    }
  });
