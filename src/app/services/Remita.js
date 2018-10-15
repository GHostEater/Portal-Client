/**
 * Created by GHostEater on 25-Sep-17.
 */
angular.module('b')
  .factory('Remita',function (Host) {

    var gen_rrr = "https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit";
    var post = "https://login.remita.net/remita/ecomm/init.reg";
    var pay = "https://login.remita.net/remita/ecomm/finalize.reg";
    var status = "https://loginremita.net/remita/ecomm/";
    var rrr_response = Host.host+"/remita-rrrgen-response/";
    var final_response = Host.host+"/remita-final-response/";

    return{
      gen_rrr: gen_rrr,
      post: post,
      pay: pay,
      status: status,
      rrr_response: rrr_response,
      final_response: final_response
    };
  });
