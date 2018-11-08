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
        Session.query().$promise
          .then(function (data) {
            vm.sessions = lodash.orderBy(data,['session'],['desc']);
            getSemester();
          });
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
      var semester = '1';
      var session = {};
      if(vm.semester.semester === "2"){
        semester = '1';
        session = vm.session;
        vm.sess = vm.session;
      }
      else{
        semester = '2';
        session = vm.sessions[1];
        vm.sess = vm.sessions[1];
      }
      vm.lecturers = CourseReview.std({session:session.id,semester:semester,student:vm.user.student.id});
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
          },
          session: function(){
            return vm.sess;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){});
    }
  });
