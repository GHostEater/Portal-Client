angular.module('b')
  .factory('PaymentToMajor', function ($resource,Host) {
    return $resource(Host.host+'/payment-to-major/:id/',{id:'@id'},{
      add:{
        url: Host.host+'/payment-to-major/new/',
        method: 'post'
      },
      student:{
        url: Host.host+'/payment-to-major/student/',
        method: 'get',
        isArray: true
      },
      studentUnEdited:{
        url: Host.host+'/payment-to-major/student-unedited/',
        method: 'get',
        isArray: true
      }
    });
  });
