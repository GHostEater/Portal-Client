/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 08-Dec-17.
 */
angular.module('b')
  .controller('CourseReviewModalCtrl',function (Session,toastr,lodash,course,CourseAllocation,CourseReview,CurrentUser,$uibModalInstance,SystemLog) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.course = course;
    vm.review = {};
    vm.tell = 0;
    Session.getCurrent().$promise
      .then(function(data){
        vm.session = data;
        getLecturer();
        getReview();
      });
    function getLecturer() {
      CourseAllocation.query({session:vm.session.id}).$promise
        .then(function(data){
          vm.alloc = lodash.find(data,{course:{id:vm.course.id}});
          vm.lecturer = vm.alloc.lecturer;
        });
    }
    function getReview() {
      CourseReview.student({student:vm.user.student.id,session:vm.session.id}).$promise
        .then(function (data) {
          vm.review = lodash.find(data,{course:{id:vm.course.id}});
          if(vm.review){vm.tell = 1;}
        });
    }
    vm.ok = function() {
      if(vm.tell === 0){
        if(vm.form.$valid){
          var data = {
            student: vm.user.student.id,
            lecturer: vm.lecturer.id,
            course: vm.course.id,
            session: vm.session.id,
            q1: vm.review.q1,
            q2: vm.review.q2,
            q3: vm.review.q3,
            q4: vm.review.q4,
            q5: vm.review.q5,
            q6: vm.review.q6,
            q7: vm.review.q7,
            q8: vm.review.q8,
            q9: vm.review.q9,
            q10: vm.review.q10
          };
          CourseReview.save(data).$promise
            .then(function(){
              SystemLog.add("Course Lecturer Evaluated");
              toastr.success("Course Lecturer Evaluated Successfully");
              $uibModalInstance.close();
            })
            .catch(function(){
              toastr.error("Error");
            });
        }
        else{
          toastr.error("Errors in form");
        }
      }
      else if(vm.tell === 1){
        CourseReview.patch(vm.review).$promise
          .then(function(){
            toastr.success("Course Lecturer Evaluation Edited Successfully");
            $uibModalInstance.close();
          })
          .catch(function(){
            toastr.error("Error");
          });
      }
    };
  });
