/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 16-Dec-18.
 */
angular.module("b")
  .factory("ExtraUnit", function ($resource,Host) {
    return $resource(Host.host+"/extra-unit-request/:id/",{id:'@id'},{
      patch:{
        method: 'patch'
      },
      save:{
        method: 'post',
        url: Host.host+"/extra-unit-request/new/"
      }
    });
  });
