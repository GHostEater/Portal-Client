angular.module('b')
  .factory('PaymentType',function ($resource, Host) {
    return $resource(Host.host+'/payment-type/:id/',{id:'@id'},{
      student:{
        url: Host.host+'/payment-type/student/',
        method: "get",
        isArray: true
      },
      admission:{
        url: Host.host+'/payment-type/admission/',
        method: "get",
        isArray: true
      }
    });
  });
