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

.factory('Venues', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('loadDataService',  ['$http',
    function($http) {
        var doRequest = function(username, path) {
            return $http({
                method: 'GET',
                url: path
            });
        }
        return {
            // 加载场馆列表数据
            venueList: function(username) {
                return doRequest(username, 'data/list.json');
            },
            // 加载场馆信息
            venue: function(venueId) {
                return doRequest(venueId, 'data/detail.json');
            },
            // 所有类型列表
            types: function(){
                return doRequest('', 'data/types.json')
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
            
            var promise = $http.post(rootConfig.pathConfig.basePath + 'comm/logout', token).success(function (response) {
                
                return response;
            }).error(function (response, status) {
                
                console.log("response:" + response + ",status:" + status);
                return status;
            });
            return promise;
        },

        sendSms: function (registInfo) {

          var promise = $http.post(rootConfig.pathConfig.basePath + '/comm/sendSms', registInfo).success(function (response) {
                
                return response;
            }).error(function (response, status) {
                
                console.log("response:" + response + ",status:" + status);
                return status;
            });
            return promise;

        }
    };
    return loginService;
});
