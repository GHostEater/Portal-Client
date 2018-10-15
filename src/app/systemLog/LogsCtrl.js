/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 15-May-17.
 */
angular.module('b')
  .controller("LogsCtrl", function (SystemLog) {
    var vm = this;
    vm.date = {
      min: new Date(new Date().setDate(new Date().getDate()-1)),
      max: new Date()
    };
    vm.getLogs = getLogs;
    function getLogs() {
      SystemLog.getAll(vm.date.min,vm.date.max)
      .then(function(data){
        vm.logs = data;
      });
    }getLogs();
  });
