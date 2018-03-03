/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 03-Mar-18.
 */
angular.module('b')
  .controller('LevelAdviserDeleteCtrl',function (adviser,$uibModalInstance,LevelAdviser,toastr) {
    var vm = this;
    vm.header = "Level Adviser";
    vm.ok = function () {
      LevelAdviser.delete({lecturer:adviser.lecturer.id}).$promise
        .then(function () {
          toastr.success("Level Adviser Deleted");
          $uibModalInstance.close();
        })
        .catch(function () {
          toastr.error("Error");
        });
    };
  });
