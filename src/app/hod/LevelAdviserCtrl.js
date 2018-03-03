/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 03-Mar-18.
 */
angular.module('b')
  .controller('LevelAdviserCtrl',function (Access,$uibModal,LevelAdviser,CurrentUser,lodash) {
    Access.lecturer();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.add = add;
    vm.remove = remove;
    function get_level_advisers() {
      LevelAdviser.query().$promise
      .then(function (data) {
        vm.levelAdvisers = lodash.filter(data,{major:{dept:{id:vm.user.hod.dept.id}}});
      });
    }get_level_advisers();

    function add(){
      var options = {
        templateUrl: 'app/hod/level_adviser_add.html',
        controller: "LevelAdviserAddCtrl",
        controllerAs: 'vm',
        size: 'lg'
      };
      $uibModal.open(options).result
        .then(function(){
          get_level_advisers();
        });
    }
    function remove(adviser){
      var options = {
        templateUrl: 'app/hod/delete.html',
        controller: "LevelAdviserDeleteCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          adviser: function(){
            return adviser;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          get_level_advisers();
        });
    }
  });
