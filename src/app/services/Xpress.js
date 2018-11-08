/**
 * Created by GHostEater on 06-Dec-17.
 */
angular.module('b')
  .factory('Xpress',function (Host) {

    var pay = "https://payxpress.com/xp-gateway/v2";
    var response = Host.host+"/xpress-response/";

    var pay_cashier = "https://www.ecashier.com/PaymentReferenceService/api/payment/GeneratePRN";
    var response_cashier = Host.host+"/xpress-response-cashier/";

    return{
      pay: pay,
      response: response,
      pay_cashier: pay_cashier,
      response_cashier: response_cashier
    };
  });
