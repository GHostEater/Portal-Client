/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('HostelCtrl',function (Hostel,Access) {
    Access.general();
    var vm = this;
    vm.hostels = Hostel.query();
  });
