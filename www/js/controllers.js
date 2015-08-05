angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('VenuesCtrl', function($scope, loadDataService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  loadDataService.venueList('ss').success(function (data, status) {
      $scope.venues = data;
  });
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };
})

.controller('VenueDetailCtrl', function($scope, $stateParams, loadDataService) {
  loadDataService.venue($stateParams.venueId).success(function (data, status) {
      $scope.venue = data;
  });
  // $scope.chat = Chats.get();
})

.controller('VenueMapCtrl', function($scope, $stateParams) {
  // $scope.venue = Chats.get($stateParams.venueId);
  console.log("into VenueMapCtrl...");
  
  $scope.lng = 121.594061;
  $scope.lat = 31.207879;
  $scope.zoom = 16;
})

// 下订单
.controller('PlaceOrderCtrl', function($log, $scope, $stateParams) {
  $log.log($stateParams);
})

.controller('AccountCtrl', function($scope,$state, $log, userService) {
  $log.log("AccountCtrl start");
  $scope.user = {
    username : (userService.get('username')=='')?"未登入":userService.get('username'),
    phoneNum : userService.get('phoneNum')
  };
  $scope.isLogined = function () {
    if ($scope.user.username === '未登入') {
      $state.go('tab.register');
    };
  };
  $scope.clear = function () {
    localStorage.clear();
    $scope.user = {
      username : '',
      phoneNum : ''
    };
  }
  $log.log("AccountCtrl end");
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
.controller('RegisterCtrl', function($log, $scope, $stateParams, $state,loadDataService,userService) {
    $scope.msg = {
      phoneNum : '' ,
      username : ''
    };

    $scope.register = function (){
        $log.log('register', $scope.msg.phoneNum ,$scope.msg.username);
        loadDataService.register($scope.msg.phoneNum).success(function (data, status){
          localStorage.username = $scope.msg.username;
          localStorage.phoneNum = $scope.msg.phoneNum;
          userService.set('username', $scope.msg.username);
          userService.set('phoneNum', $scope.msg.phoneNum);
          $state.go('tab.account');
        });
    };
    $scope.reset = function () {
        $scope.msg.phoneNum = '';
        $scope.msg.username = '';
        $log.log('reset', $scope.msg.phoneNum , $scope.msg.username);
    }
})

// 个人信息详情
.controller('PersonDetailCtrl', function($log, $scope, $stateParams, $state,loadDataService,userService) {
    
});
