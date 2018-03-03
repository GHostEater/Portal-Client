/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 03-Mar-18.
 */
angular.module('b')
  .controller('LevelAdviserAddCtrl',function (CurrentUser,lodash,$uibModalInstance,LevelAdviser,Lecturer,Major,Level,toastr) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.l100 = false;
    vm.l200 = false;
    vm.l300 = false;
    vm.l400 = false;
    Major.query().$promise
      .then(function (data) {
        vm.majors = lodash.filter(data,{dept:{id:vm.user.hod.dept.id}});
      });
    Lecturer.query().$promise
      .then(function (data) {
        vm.lecturers = lodash.filter(data,{dept:{id:vm.user.hod.dept.id}});
      });
    vm.levels = Level.query();

    vm.ok = function () {
      if(vm.form.$valid){
        var data = {
          lecturer: vm.lecturer.id,
          major: vm.major.id,
          level: []
        };
        if(vm.l100 === true){
          vm.level = lodash.find(vm.levels,{level:'100'});
          data.level.push(vm.level.id);
        }
        if(vm.l200 === true){
          vm.level = lodash.find(vm.levels,{level:'200'});
          data.level.push(vm.level.id);
        }
        if(vm.l300 === true){
          vm.level = lodash.find(vm.levels,{level:'300'});
          data.level.push(vm.level.id);
        }
        if(vm.l400 === true){
          vm.level = lodash.find(vm.levels,{level:'400'});
          data.level.push(vm.level.id);
        }
        LevelAdviser.save(data).$promise
          .then(function () {
            toastr.success("Level Adviser Added");
            $uibModalInstance.close();
          })
          .catch(function () {
            toastr.error("Error");
          });
      }
      else{
        toastr.error("Errors in form");
      }
    };
  });
