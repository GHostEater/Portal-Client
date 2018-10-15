/**
 * Created by GHostEater on 26-Sep-17.
 */
angular.module('b')
  .factory('Payment',function ($resource,Host) {
    return $resource(Host.host+"/payment/:id/",{id:'@id',application:'@application',transaction:'@transaction'},{
      save:{
        url: Host.host+"/payment/new/",
        method: "post"
      },
      application:{
        url: Host.host+"/payment/application/",
        method: 'get',
        isArray: true
      },
      student:{
        url: Host.host+"/payment/student/",
        method: 'get',
        isArray: true
      },
      get_status:{
        url: Host.host+"/remita-status/",
        method: 'get'
      },
      order:{
        url: Host.host+"/payment/order/:order/",
        method: 'get'
      },
      transaction:{
        url: Host.host+"/payment/transaction/:transaction/",
        method: 'get'
      },
      hasher:{
        url: Host.host+"/hasher/",
        method: 'post'
      },
      generate_rrr:{
        url: Host.host+"/generate-rrr/",
        method: 'post'
      },
      cashier_pay:{
        url: Host.host+"/xpress-pay-cashier/",
        method: 'post'
      },
      getPaid:{
        url: Host.host+"/student-paid-list/",
        method: 'get'
      },
      getUnPaid:{
        url: Host.host+"/student-unpaid-list/",
        method: 'get'
      },
      getPaidAdmission:{
        url: Host.host+"/admission-paid-list/",
        method: 'get'
      },
      getUnPaidAdmission:{
        url: Host.host+"/admission-unpaid-list/",
        method: 'get'
      }
    });
  });
