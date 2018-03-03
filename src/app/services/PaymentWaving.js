angular.module('b')
  .factory('PaymentWaving',function ($resource,Host) {
    return $resource(Host.host+'/payment-waving/:id/',{id:'@id'},{
      student:{
        method: 'get',
        isArray: true,
        url: Host.host+'/payment-waving/student/'
      },
      save:{
        url: Host.host+'/payment-waving/new/',
        method: 'post'
      }
    });
  });
