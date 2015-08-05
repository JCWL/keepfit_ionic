angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('VenuesCtrl', function ($log, $scope, loadDataService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var locInfo = {
    "lon":121.585696,
    "lat":31.209962,
    "distance":10000
  };

  loadDataService.venueList(angular.toJson(locInfo)).success(function (data, status) {
      $scope.venues = data.content;
      $log.log("status : " + status);
  });
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };
})

.controller('VenueDetailCtrl', function ($log, $scope, $stateParams, loadDataService) {
  loadDataService.venue($stateParams.venueId).success(function (data, status) {
      $scope.venue = data;
  });
  // $scope.chat = Chats.get();
})

.controller('VenueMapCtrl', function ($scope, $stateParams) {
  // $scope.venue = Chats.get($stateParams.venueId);
  console.log("into VenueMapCtrl...");
  
  $scope.lng = 121.594061;
  $scope.lat = 31.207879;
  $scope.zoom = 16;
})

// 下订单
.controller('PlaceOrderCtrl', function ($log, $scope, $stateParams) {
  $log.log($stateParams);
})


.controller('AccountCtrl', function ($scope,$state, $log, userService, loginService) {
  $log.log("AccountCtrl start");

  $scope.user = {
    username : (userService.get('username')=='')?"未登入":userService.get('username'),
    phoneNum : userService.get('phoneNum'),
  };

  $scope.isLogined = function () {
    if ($scope.user.username === '未登入') {
      $state.go('tab.register');
    };
  };
  $scope.logout = function () {
    localStorage.clear();
    $scope.user = {
      username : '',
      phoneNum : ''
    };

    var token={
      token : localStorage.token
    }
    $log.log("requset with data : " + angular.toJson(token));
    loginService.logout(angular.toJson(token)).success(function (response) {

      $log.log("response : " + response.status + response.msgs.fail);

      }).error(function (response, status) {
          
    });
  }

})
// 订单
.controller('OrderCtrl', function($scope, $stateParams) {
  // $scope.venue = Chats.get($stateParams.venueId);
})
// 优惠券
.controller('CouponCtrl', function($scope, $stateParams) {
  // $scope.venue = Chats.get($stateParams.venueId);
})
// 信息反馈
.controller('FeedbackCtrl', function($scope, $stateParams) {
    $scope.submitFeedback = function () {
        $scope.title = 'qqq';
        $scope.comments = 'www';
    }
})
// 注册用户
.controller('RegisterCtrl', function ($log, $scope, $stateParams, $state, loadDataService, userService, loginService) {
    $scope.msg = {
      phoneNum : '' ,
      username : ''
    };

    $scope.msgOnBtn = '验证码';
    $scope.disable = false;

    $scope.login = function (){
        $log.log('login', $scope.msg.phoneNum ,$scope.msg.verifyCode);
        loadDataService.register($scope.msg.phoneNum).success(function (data, status){
          localStorage.username = $scope.msg.verifyCode;
          localStorage.phoneNum = $scope.msg.phoneNum;
          userService.set('username', $scope.msg.verifyCode);
          userService.set('phoneNum', $scope.msg.phoneNum);
          $state.go('tab.account');
        });

        var user = {
          phoneNum : $scope.msg.phoneNum,
          authLogoUrl : "",
          clientType : 1,
          openId : "abcd1234",
          smsCode : $scope.msg.verifyCode
        };

        $log.log("requset with data : " + angular.toJson(user));
        loginService.login(angular.toJson(user)).success(function (response) {

          $log.log("response : " + response.status + response.msgs.fail);

          localStorage.token = "token_1234567890";

          }).error(function (response, status) {
              
        });
    };
    $scope.sendSms = function () {

        if($scope.msg.phoneNum == "" || $scope.msg.phoneNum == null){
          alert("请输入手机号码");
          return;
        }

        $scope.msgOnBtn = '重发';
        $scope.disable = true;

        $scope.countdown = 10;
        var myTime = setInterval(function() {
          $scope.countdown--;
          $scope.$digest(); // 通知视图模型的变化
        }, 1000);
        // 倒计时50-0秒，但算上0的话就是51s
        setTimeout(function() {
          // Do SomeThing
          $scope.msgOnBtn = '验证码';
          $scope.countdown = null;
          $scope.disable = false;
          $scope.$digest(); // 通知视图模型的变化

          clearInterval(myTime);
          // $scope.countdown.$destroy();
          
        }, 11000);

        var registInfo = {
          phoneNum : $scope.msg.phoneNum
        };

        $log.log("request with data : " + angular.toJson(registInfo));
        loginService.sendSms(angular.toJson(registInfo)).success(function (response) {

          if(response.status == 200)
            $log.log("发送验证码成功");

          }).error(function (response, status) {
              $log.log("发送验证码失败");
        });
    }
})

// 个人信息详情
.controller('PersonDetailCtrl', function($log, $scope, $stateParams, $state,loadDataService,userService) {
    
});
