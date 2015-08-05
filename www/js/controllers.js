angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('VenuesCtrl', function($scope, $log, $ionicPopover, loadDataService) {
  // .fromTemplate() method
  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">{{title}}</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  $scope.caluDates = function () {
    var today = new Date();
    today.setDate(today.getDate()-1);

    var res = [];
    var _year='', _month = '', _date = '', _day = '';
    for (var i = 0; i < 7; i++) {
        today.setDate(today.getDate()+1);
        _year = today.getFullYear();
        _month = today.getMonth()+1;
        _date = today.getDate();
        _day = today.getDay();
        switch (_day)
        {
          case 0:
            _day = '日';
            break;
          case 1:
            _day = '一';
            break;
          case 2:
            _day = '二';
            break;
          case 3:
            _day = '三';
            break;
          case 4:
            _day = '四';
            break;
          case 5:
            _day = '五';
            break;
          case 6:
            _day = '六';
            break;
        }
        var s = _month + '月' + _date + '日 (周' + _day + ')';
        var ss = _year + '/' + _month + '/' + _date;
        var obj = {
          showDate : s,
          queryDate : ss
        }
        res.push(obj);
    };
    return res;
  }

  // 初始化日期数据
  $scope.dates = $scope.caluDates();
  $scope.times = [{
      showTime : '全天(06:00-22:00)',
      queryTime : '06:00-22:00'
    },{
      showTime : '上午(06:00-11:00)',
      queryTime : '06:00-11:00'
    },{
      showTime : '中午(11:00-14:00)',
      queryTime : '11:00-14:00'
    },{
      showTime : '下午(14:00-18:00)',
      queryTime : '14:00-18:00'
    },{
      showTime : '晚上(18:00-22:00)',
      queryTime : '18:00-22:00'
    }
  ];

  // 选中的查询条件，这是默认条件
  $scope.queryCondition = {
    showDate : $scope.dates[0].showDate,
    queryDate : $scope.dates[0].queryDate,
    showTime : $scope.times[0].showTime,
    queryTime : $scope.times[0].queryTime,
    typeName : '',
    typeId : '',
    position : '位置'
  }

  // 选择日期时间时绑定函数
  $scope.chooseDate = function(showDate, queryDate) {
      $scope.queryCondition.showDate = showDate;
      $scope.queryCondition.queryDate = queryDate;
      $log.log("xuanzele : ", $scope.queryCondition.showDate, $scope.queryCondition.queryDate);
  }

  $scope.chooseTime = function(showTime, queryTime) {
      $scope.queryCondition.showTime = showTime;
      $scope.queryCondition.queryTime = queryTime;
      $log.log("xuanzele : ", $scope.queryCondition.showTime, $scope.queryCondition.queryTime);
  }

  // 选择日期时间之后
  $scope.$on('popoverType.hidden', function() {
    $log.log("popoverType.hidden");
  });
  $scope.$on('popoverDatetime.removed', function() {
    $log.log("popoverDatetime.removed");
  });

  // 初始化位置的数据
  $scope.positions = ['青浦','徐汇','陆家嘴'];

  // 初始化运动类型数据
  loadDataService.types().success(function(data, status) {
      $scope.types = data;
      $scope.queryCondition.typeName = data[0].name;
      $scope.queryCondition.typeId = data[0].typeId;
  });

  // 选择种类时绑定函数
  $scope.chooseType = function(typeName, typeId) {
      $scope.queryCondition.typeName = typeName;
      $scope.queryCondition.typeId = typeId;
      $scope.popoverType.hide();
      $log.log("xuanzele : ", $scope.queryCondition.typeName, $scope.queryCondition.typeId);
  }

  // 初始化三个popover
  $ionicPopover.fromTemplateUrl('templates/popover-datetime.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popoverDatetime = popover;
  });

  $ionicPopover.fromTemplateUrl('templates/popover-type.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popoverType = popover;
  });

  $ionicPopover.fromTemplateUrl('templates/popover-position.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popoverPosition = popover;
  });

  $scope.showpopoverdatetime = function ($event) {
      $scope.popoverDatetime.show($event);
  }
  $scope.showpopovertype = function ($event) {
      $scope.popoverType.show($event);
  }
  $scope.showpopoverposition = function ($event) {
      $scope.popoverPosition.show($event);
  }

  // $scope.$on('$ionicView.enter', function(e) {
  // });
  loadDataService.venueList('ss').success(function (data, status) {
      $scope.venues = data;
  });
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

    $scope.msgOnBtn = '发送验证码';
    $scope.isDisabled = false;

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
        $log.log("into sendSms...");
        // $scope.msg.phoneNum = '';
        // $scope.msg.verifyCode = '';
        // $log.log('reset', $scope.msg.phoneNum , $scope.msg.verifyCode);
        var registInfo = {
          phoneNum : $scope.msg.phoneNum
        };

        $log.log("requset with data : " + angular.toJson(registInfo));
        loginService.sendSms(angular.toJson(registInfo)).success(function (response) {

          $log.log("response : " + response.status);
          $scope.msgOnBtn = '正在发送验证码...';
          $scope.isDisabled = true;

          }).error(function (response, status) {
              
        });

    }
})

// 个人信息详情
.controller('PersonDetailCtrl', function($log, $scope, $stateParams, $state,loadDataService,userService) {
    
});
