/**
 * Created by GHostEater on 5/23/2016.
 */
angular.module("b")
  .controller('EditCaController',function(CourseResult,CourseResultEditLog,toastr,result,$uibModalInstance,CurrentUser,SystemLog){
    var vm = this;
    vm.result = result;
    vm.prevScore = vm.result.ca;
    vm.lecturer = CurrentUser.profile.lecturer;
    vm.ok = function(){
      if(vm.form.$dirty && vm.form.$valid){
        var request = {
          id: vm.result.id,
          ca: vm.result.ca
        };
        CourseResult.editCA(request).$promise
          .then(function(){
            var date = new Date();
            if(vm.lecturer){
              var data = {
                result: vm.result.id,
                type: "CA",
                prev_score: vm.prevScore,
                new_score: vm.result.ca,
                date: date,
                edited_by: vm.lecturer.id
              };
              CourseResultEditLog.save(data).$promise
                .then(function(){
                  SystemLog.add("Edited Result");
                  toastr.success('Edit Logged');
                  toastr.success("CA Changed");
                  $uibModalInstance.close();
                })
                .catch(function(){
                  toastr.error("Unable to Log CA Change");
                });
            }
            else{
              SystemLog.add("Edited Result");
              toastr.success('Edit Logged');
              toastr.success("CA Changed");
              $uibModalInstance.close();
            }
          })
          .catch(function(){
            toastr.error("Unable to Change CA");
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
