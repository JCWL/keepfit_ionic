angular.module('starter.services', [])

.service('settingsService', function () {
    var _variables = {};
    return {
        get: function (varname) {
            return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
        },
        set: function (varname, value) {
            _variables[varname] = value;
        }
    };
})

.service('userService', function() {
  var _user = {};
  return {
    get: function(varname) {
      return (typeof _user[varname] !== 'undefined') ? _user[varname] : false;
    },
    set: function(varname, value) {
      _user[varname] = value;
    }
  };
})

.factory('loadDataService',  ['$http',
    function($http) {
        var doRequest = function(data, path) {
            return $http({
                method: 'POST',
                url: path,
                headers: {
                   'Content-Type': "application/json"
                 },
                data: data,
            });
        }
        return {
            //微信签名
            wechatConfig: function(url){
                return doRequest(url, rootConfig.pathConfig.basePath + '/wechat/createJsapiSignature');
            },
            oauth2getAccessToken: function(code) {
                return doRequest(code, rootConfig.pathConfig.basePath + '/wechat/oauth2getAccessToken');
            },
            getJsapiPayInfo: function(params) {
                return doRequest(params, rootConfig.pathConfig.basePath + '/order/getJsapiPayInfo');
            },
            // 加载场馆列表数据
            venueList: function(locInfo) {
                return doRequest(locInfo, rootConfig.pathConfig.basePath + '/venue/search');
            },
            // 加载场馆信息
            venue: function(params) {
                return doRequest(params, rootConfig.pathConfig.basePath + '/venue/searchVenue');
            },
            // 所有场馆类型列表
            types: function(param){
                return doRequest(param, rootConfig.pathConfig.basePath  + '/const/searchVenueType');
            },
            // 地区列表
            areas: function(param){
                return doRequest(param, rootConfig.pathConfig.basePath  + '/const/searchAreaByLonLat');
            },
            // 注册用户
            register: function(phoneNum) {
              return doRequest(phoneNum, '')
            },
            // 获取订单
            getorders: function(argument) {

            },
            // 获取优惠券
            getcoupons: function (argument) {
              // body...
            },
            // 提交反馈信息
            postFeedback: function (argument) {
              // body...
            }
        };
    }
])
.factory('loginService', function ($http) {
    var loginService = {
        login: function (user) {
            
            var promise = $http.post(rootConfig.pathConfig.basePath + '/comm/login', user).success(function (response) {
                
                return response;
            }).error(function (response, status) {
                
                console.log("response:" + response + ",status:" + status);
                return status;
            });
            return promise;
        },

        logout: function (token) {
            
            var promise = $http.post(rootConfig.pathConfig.basePath + '/comm/logout', token).success(function (response) {
                
                return response;
            }).error(function (response, status) {
                
                console.log("response:" + response + ",status:" + status);
                return status;
            });
            return promise;
        },

        sendSms: function (registInfo) {

          var promise = $http.post(rootConfig.pathConfig.basePath + '/comm/sendSms', registInfo).success(function (response) {
                console.log("response.status : " + response.status);
                return response;
            }).error(function (response, status) {
                
                console.log("response:" + response + ", status:" + status);
                return status;
            });
            return promise;

        }
    };
    return loginService;
});
