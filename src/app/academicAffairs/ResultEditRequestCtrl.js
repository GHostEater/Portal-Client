/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('ResultEditRequestCtrl',function (CourseResultEditRequest,CurrentUser,$uibModal,Access) {
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    function getRequests() {
      vm.requests = CourseResultEditRequest.query();
    }getRequests();
    vm.process = process;
    vm.disable = disable;

    function process(id,status,handled_by){
      var options = {
        templateUrl: 'app/academicAffairs/processRequest.html',
        controller: "ProcessRequestCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          id: function(){
            return id;
          },
          status: function(){
            return status;
          },
          handled_by: function(){
            return handled_by;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
        getRequests();
        });
    }
    function disable(id){
      var options = {
        templateUrl: 'app/academicAffairs/disableEdit.html',
        controller: "DisableEditCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          id: function(){
            return id;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
        getRequests();
        });
    }
  });
