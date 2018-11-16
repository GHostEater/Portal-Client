angular.module('b')
  .factory('PaymentType',function ($resource, Host) {
    return $resource(Host.host+'/payment-type/:id/',{id:'@id',dept:'@dept'},{
      student:{
        url: Host.host+'/payment-type/student/',
        method: "get",
        isArray: true
      },
      admission:{
        url: Host.host+'/payment-type/admission/',
        method: "get",
        isArray: true
      },
      tuition:{
        url: Host.host+'/tuition-fee/',
        method: "get",
        isArray: true
      },
      tuition_student:{
        url: Host.host+'/tuition-fee/single/',
        method: "get"
      }
    });
  });
