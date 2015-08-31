// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function ($ionicPlatform, $rootScope, $state, $stateParams, userService, loadDataService) {
  //WeChat init;
  var param = {
    "url":window.location.href
  }
  console.log("request {/wechat/createJsapiSignature} with data: " + angular.toJson(param));
  loadDataService.wechatConfig(param).success(function (data,status){
      console.log("response : " + angular.toJson(data));
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxdf0798b126b0c235', // 必填，公众号的唯一标识
        timestamp: data.content[0].timestamp, // 必填，生成签名的时间戳
        nonceStr: data.content[0].noncestr, // 必填，生成签名的随机串
        signature: data.content[0].signature,// 必填，签名，见附录1
        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

  }).error(function (data, status){
    console.log("signature faild");
  });

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  userService.set('phoneNum', localStorage.phoneNum == undefined? '':localStorage.phoneNum);
  userService.set('username', localStorage.username == undefined? '':localStorage.username);

  // $ionicPlatform.ready(function() {
  //   // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
  //   // for form inputs)
  //   if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
  //     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  //     cordova.plugins.Keyboard.disableScroll(true);

  //   }
  //   if (window.StatusBar) {
  //     // org.apache.cordova.statusbar required
  //     StatusBar.styleLightContent();
  //   }
  // });

  wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
     //通过微信获取地理位置
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {

          // localStorage.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          // localStorage.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed; // 速度，以米/每秒计
          // var accuracy = res.accuracy; // 位置精度
          var location = gcj2bd(res.latitude, res.longitude);
          // alert(location);
          localStorage.latitude = location[0];
          localStorage.longitude = location[1];
      }
    });
  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position("bottom");

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  // .state('tab.dash', {
  //   url: '/dash',
  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/tab-dash.html',
  //       controller: 'DashCtrl'
  //     }
  //   }
  // })

  .state('tab.venues', {
      url: '/venues',
      views: {
        'tab-venues': {
          templateUrl: 'templates/tab-venues.html',
          controller: 'VenuesCtrl'
        }
      }
    })
    .state('tab.venue-detail', {
      url: '/venues/:venueId',
      views: {
        'tab-venues': {
          templateUrl: 'templates/venue-detail.html',
          controller: 'VenueDetailCtrl'
        }
      }
    })
    .state('tab.course-detail', {
      url: '/venues/:venueId',
      views: {
        'tab-venues': {
          templateUrl: 'templates/course-detail.html',
          controller: 'VenueDetailCtrl'
        }
      }
    })
    .state('tab.schedule', {
      url: '/venues/:venueId/schedule',
      views: {
        'tab-venues': {
          templateUrl: 'templates/tab-schedule.html',
          controller: 'VenueScheduleCtrl'
        }
      }
    })
    .state('tab.map', {
      url: '/venues/:venueId/map',
      views: {
        'tab-venues': {
          templateUrl: 'templates/tab-map.html',
          controller: 'VenueMapCtrl'
        }
      }
    })
    .state('tab.placeOrder', {
      url: '/venues/:venueId/placeorder',
      views: {
        'tab-venues': {
          templateUrl: 'templates/tab-order.html',
          controller: 'PlaceOrderCtrl'
        }
      }
    })
  .state('tab.account', {
    url: '/account',
    // cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.orders', {
    url: '/account/orders',
    views: {
      'tab-account': {
        templateUrl: 'templates/account-orders.html',
        controller: 'OrderCtrl'
      }
    }
  })
  .state('tab.coupons', {
    url: '/account/coupons',
    views: {
      'tab-account': {
        templateUrl: 'templates/account-coupons.html',
        controller: 'CouponCtrl'
      }
    }
  })
  .state('tab.feedback', {
    url: '/account/feedback',
    views: {
      'tab-account': {
        templateUrl: 'templates/account-feedback.html',
        controller: 'FeedbackCtrl'
      }
    }
  })
  .state('tab.register', {
    url: '/account/register',
    // reload: true,
    views: {
      'tab-account': {
        templateUrl: 'templates/account-register.html',
        controller: 'RegisterCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/venues');

});

function gcj2bd(lat, lon) {
  var pi = 3.14159265358979324;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

  var x = lon, y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  var bd_lon = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lat, bd_lon];
}

var rootConfig = {
    "debug": true,
    "pathConfig": {
        // "basePath": "http://120.26.115.196:8080/jc"
        "basePath": "/jc"
    },
    "currentVersion": "1.0"
};
