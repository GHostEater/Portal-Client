angular.module('b')
  .factory('PaymentType',function ($resource, Host) {
    return $resource(Host.host+'/payment-type/;id/',{id:'@id'});
  });
