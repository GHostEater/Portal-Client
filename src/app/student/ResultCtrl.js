/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-May-16.
 */
angular.module("b")
  .controller("ResultCtrl",function(CurrentUser,Student,CourseResult,CourseResultGPA,Level,lodash){
    var vm = this;
    vm.res = [];
    vm.user = CurrentUser.profile;
    vm.student = vm.user.student;
    getResult();
    function getResult() {
      CourseResult.student({student:vm.student.id}).$promise
        .then(function(data){
          vm.results = data;
          getGP();
        });
    }
    function getGP() {
      CourseResultGPA.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.gp = lodash.orderBy(data,['session','semester']);
          vm.gp = lodash.filter(vm.gp,{rel:true});
          angular.forEach(vm.gp,function (gp) {
            vm.result = lodash.filter(vm.results,{session:gp.session,course:{semester:gp.semester},rel:true});
            var data = {
              result: vm.result,
              gp: gp
            };
            vm.res.push(data);
          });
        });
    }
  });
