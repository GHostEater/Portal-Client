/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('HomeCtrl', function (CurrentUser,Session,LevelAdviser,RoomAllocation,lodash,Access,Student) {
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        if(vm.user.type === '7'){
          RoomAllocation.student({student:vm.user.student.id}).$promise
          .then(function (data) {
            vm.allocation = lodash.find(data,{session:{id:vm.session.id}});
          });
          vm.student = Student.get({user:vm.user.id});
        }
      });
    vm.sessionActions = function () {
      LevelAdviser.query().$promise
        .then(function (data) {
          vm.levelAdvisers = data;
          angular.forEach(vm.levelAdvisers,function (lvlAdv) {
            var data = {
              lecturer: lvlAdv.lecturer.id,
              level: []
            };
            angular.forEach(lvlAdv.level,function (lvl) {
              if(lvl.id === 1){
                data.level.push(2);
              }
              else if(lvl.id === 2){
                data.level.push(3);
              }
              else if(lvl.id === 3){
                data.level.push(4);
              }
              else if(lvl.id === 4){
                data.level.push(1);
              }
            });
            LevelAdviser.patch(data);
          });
        });
      Session.actions().$promise
        .then(function () {
          vm.session = Session.getCurrent();
        });
    };
  });
