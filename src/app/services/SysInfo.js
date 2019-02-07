/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 30-Jan-19.
 */
angular.module("b")
  .factory("SysInfo", function ($resource,Host) {
    return $resource(Host.host+"/sysinfo/:id/",{id:'@id'});
  });
