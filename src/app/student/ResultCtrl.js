/**
 * Created by GHostEater on 09-May-16.
 */
angular.module("b")
  .controller("ResultCtrl",function(CurrentUser,Student,CourseResult,CourseResultGPA,Level,Session,lodash){
    var vm = this;
    vm.res = [];
    vm.user = CurrentUser.profile;
    Student.get({userId:vm.user.id}).$promise
      .then(function (data) {
        vm.student = data;
        getResult();
      });
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
          angular.forEach(vm.gp,function (gp) {
            vm.result = lodash.filter(vm.results,{session:gp.session,course:{semester:gp.semester}});
            var data = {
              result: vm.result,
              gp: gp
            };
            vm.res.push(data);
          });
        });
    }
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        vm.sess = vm.session.id;
      });
    vm.sessions = Session.query();
    vm.changeSession = function(id){
      vm.session = lodash.find(vm.sessions,{id:id});
    };
  });
