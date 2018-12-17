/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */
angular.module("b")
  .factory("GradePoint", function ($resource,Host) {
    return $resource(Host.host+"/grade-point/:id/",{id:'@id'});
  });
