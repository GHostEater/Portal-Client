/**
 * Created by GHostEater on 5/25/2016.
 */
angular.module("b")
  .controller('EditExamController',function(CourseResult,CourseResultEditLog,toastr,result,$uibModalInstance,CurrentUser,SystemLog){
    var vm = this;
    vm.result = result;
    vm.prevScore = vm.result.exam;
    vm.lecturer = CurrentUser.profile.lecturer;
    vm.ok = function(){
      if(vm.form.$dirty && vm.form.$valid){
        var request = {
          id: vm.result.id,
          exam: vm.result.exam
        };
        CourseResult.editExam(request).$promise
          .then(function(){
            var date = new Date();
            if(vm.lecturer){
              var data = {
                result: vm.result.id,
                type: "Exam",
                prev_score: vm.prevScore,
                new_score: vm.result.exam,
                date: date,
                edited_by: vm.lecturer.id
              };
              CourseResultEditLog.save(data).$promise
                .then(function(){
                  SystemLog.add("Edited Result");
                  toastr.success('Edit Logged');
                  toastr.success("Exam Changed");
                  $uibModalInstance.close();
                });
            }
            else{
              SystemLog.add("Edited Result");
              toastr.success('Edit Logged');
              toastr.success("Exam Changed");
              $uibModalInstance.close();
            }
          })
          .catch(function(){
            toastr.error("Unable to Change Exam");
          });
      }
      else if(vm.form.$pristine && vm.form.$valid){
        toastr.info("No Changes");
        $uibModalInstance.close();
      }
      else if(vm.form.$invalid){
        toastr.error("Errors in form");
      }
    };
  });
