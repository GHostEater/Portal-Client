/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 08-Dec-17.
 */
angular.module('b')
  .controller('CourseReviewCtrl',function (CourseReview,CourseReg,CurrentUser,Session,Semester,lodash,$uibModal,Access) {
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
      CourseReg.student({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.courses = lodash.filter(data,{course:{semester:Number(vm.semester.semester)},session:{id:vm.session.id}});
        });
    }
    function review(course){
      var options = {
        templateUrl: 'app/courseReview/courseReviewModal.html',
        controller: "CourseReviewModalCtrl",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          course: function(){
            return course;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){});
    }
  });
