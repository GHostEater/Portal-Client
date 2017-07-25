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
    SystemLog.getAll()
      .then(function(data){
        vm.logs = data;
      });
  });
