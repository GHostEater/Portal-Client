/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 08-Dec-17.
 */
angular.module('b')
  .controller('CourseReviewModalCtrl',function (Session,toastr,lodash,course,lecturer,CourseAllocation,CourseReview,CurrentUser,$uibModalInstance,SystemLog) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.course = course;
    vm.lecturer = lecturer;
    vm.review = {};
    vm.tell = 0;
    Session.getCurrent().$promise
      .then(function(data){
        vm.session = data;
        getReview();
      });
    function getReview() {
      CourseReview.student({student:vm.user.student.id,session:vm.session.id}).$promise
        .then(function (data) {
          vm.review = lodash.find(data,{course:{id:vm.course.id},lecturer:{id:vm.lecturer.id}});
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
            q10: vm.review.q10,
            q11: vm.review.q11,
            q12: vm.review.q12,
            q13: vm.review.q13,
            q14: vm.review.q14,
            q15: vm.review.q15,
            q16: vm.review.q16,
            q17: vm.review.q17,
            q18: vm.review.q18,
            q19: vm.review.q19,
            q20: vm.review.q20,
            q21: vm.review.q21,
            q22: vm.review.q22,
            q23: vm.review.q23,
            q24: vm.review.q24,
            q25: vm.review.q25,
            q26: vm.review.q26,
            q27: vm.review.q27,
            q28: vm.review.q28,
            q29: vm.review.q29
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
          toastr.error("Errors in form.. You Missed a Question");
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
