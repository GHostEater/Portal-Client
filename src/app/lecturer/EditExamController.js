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
      var grade = '';
      var gp = '';
      var status = '';
      var exam = vm.result.exam;
      var final = Number(vm.result.ca) + Number(exam);
      final = Math.round(final);
      if (final >= 100) {
        final = 100;
      }
      if (final >= 70 && final <= 100) {
        grade = 'A';
        gp = 4;
      }
      else if (final >= 60 && final <= 69) {
        grade = 'B';
        gp = 3;
      }
      else if (final >= 50 && final <= 59) {
        grade = 'C';
        gp = 2;
      }
      else if (final >= 45 && final < 50) {
        grade = 'D';
        gp = 1;
      }
      else if (final <= 44) {
        grade = 'F';
        gp = 0;
      }
      if (grade === 'F') {
        status = 0;
      }
      else {
        status = 1;
      }
      var data = {
        id: vm.result.id,
        ca: vm.result.ca,
        exam: exam,
        final: final,
        grade: grade,
        gp: gp,
        status: status
      };
      if(vm.form.$dirty && vm.form.$valid){
        CourseResult.patch(data).$promise
          .then(function(){
            var date = new Date();
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
