angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

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
    areaName : '',
    areaId : ''
  }

  // 选择日期时间时绑定函数
  // $scope.chooseDate = function(showDate, queryDate) {
  //     $scope.queryCondition.showDate = showDate;
  //     $scope.queryCondition.queryDate = queryDate;
  //     $log.log("xuanzele : ", $scope.queryCondition.showDate, $scope.queryCondition.queryDate);
  // }

  // $scope.chooseTime = function(showTime, queryTime) {
  //     $scope.queryCondition.showTime = showTime;
  //     $scope.queryCondition.queryTime = queryTime;
  //     $log.log("xuanzele : ", $scope.queryCondition.showTime, $scope.queryCondition.queryTime);
  // }

  // 选择日期时间之后
  // $scope.$on('popoverType.hidden', function() {
  //   $log.log("popoverType.hidden");
  // });
  // $scope.$on('popoverDatetime.removed', function() {
  //   $log.log("popoverDatetime.removed");
  // });
  
  // 初始化运动类型数据
  var param = {};
  $log.log("requset with data : " + angular.toJson(param));
  loadDataService.types(param).success(function(data, status) {
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));

      $scope.types = data.content;
      $scope.queryCondition.typeName = data.content[0].name;
      $scope.queryCondition.typeId = data.content[0].id;
  });

  // 初始化位置的数据
  var param = {
    "lon":121.584814,
    "lat":31.19264
  };
  $log.log("requset with data : " + angular.toJson(param));
  loadDataService.areas(param).success(function(data, status) {
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));

      $scope.positions = data.content;
      $scope.queryCondition.areaName = data.content[0].areaName;
      $scope.queryCondition.areaId = data.content[0].areaId;
  });

  // 选择种类时绑定函数
  $scope.chooseType = function(typeName, typeId) {
      $scope.queryCondition.typeName = typeName;
      $scope.queryCondition.typeId = typeId;
      $scope.popoverType.hide();
      $log.log("choosen type : ", $scope.queryCondition.typeName, $scope.queryCondition.typeId);
  }

  // 选择种类时绑定函数
  $scope.choosePosition= function(areaName, areaId) {
      $scope.queryCondition.areaName = areaName;
      $scope.queryCondition.areaId = areaId;
      $scope.popoverPosition.hide();
      $log.log("choosen area : ", $scope.queryCondition.areaName, $scope.queryCondition.areaId);
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
  // loadDataService.venueList('ss').success(function (data, status) {
  //     $scope.venues = data;
  // });
  
  var locInfo = {
    "lon":121.585696,
    "lat":31.209962,
    "distance":10000
  };

  $log.log("requset with data : " + angular.toJson(locInfo));
  loadDataService.venueList(angular.toJson(locInfo)).success(function (data, status) {
      $scope.venues = data.content;
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));
  });
})

.controller('VenueDetailCtrl', function ($log, $scope, $stateParams, loadDataService, settingsService) {

  var params = {
    "lon":121.585696,
    "lat":31.209962,
    "id":$stateParams.venueId
  };

  $log.log("requset with data : " + angular.toJson(params));
  loadDataService.venue(params).success(function (data, status) {
      
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));

      $scope.venue = data.content[0];
      settingsService.set("venue", data.content[0]);

  });
})

.controller('VenueMapCtrl', function ($scope, $stateParams, settingsService) {
  
  var venue = settingsService.get("venue");
  $scope.lng = venue.lon;
  $scope.lat = venue.lat;
  $scope.zoom = 16;
})

// 下订单
.controller('PlaceOrderCtrl', function ($log, $scope, $stateParams, settingsService) {
  $scope.venue = settingsService.get("venue");

})


.controller('AccountCtrl', function ($scope, $state, $log, userService, loginService) {

  if(localStorage.token == 'undefine' || localStorage.token == null){
    $scope.disable = true;
  }else{
    $scope.disable = false;
  }

  $scope.user = {
    username : (localStorage.username == null)?"未登入":localStorage.username,
    phoneNum : localStorage.phoneNum,
  };

  $scope.isLogined = function () {
    if(localStorage.token == 'undefine' || localStorage.token == null){
      $state.go('tab.register');
    }
  };

  $scope.logout = function () {

    var token={
      token : localStorage.token
    }
    $log.log("requset with data : " + angular.toJson(token));
    loginService.logout(angular.toJson(token)).success(function (response) {
        $log.log("response : " + angular.toJson(response));

        if(response.status === 200){
          localStorage.clear();
          $scope.user = {
            username : '',
            phoneNum : ''
          };
          $state.go('tab.venues');
        }else{
          alert("退出登录失败！");
        }
      }).error(function (response, status) {
          alert("退出登录失败！");
    });
  }

  $scope.goOrders = function() {
    //  进入订单列表
    if(localStorage.token == 'undefine' || localStorage.token == null){
      alert("请先登录");
    }else{
      $state.go('tab.orders');
    }
    
  }

  $scope.goCoupons = function() {
    //  进入优惠券列表
    if(localStorage.token == 'undefine' || localStorage.token == null){
      alert("请先登录");
    }else{
      $state.go('tab.coupons');
    }
    
  }

  $scope.goFeedback = function() {
    //  进入意见反馈
    if(localStorage.token == 'undefine' || localStorage.token == null){
      alert("请先登录");
    }else{
      $state.go('tab.feedback');
    }

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
        $scope.fb_title = 'qqq';
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

        var user = {
          phoneNum : $scope.msg.phoneNum,
          authLogoUrl : "",
          clientType : 1,
          openId : "abcd1234",
          smsCode : $scope.msg.verifyCode
        };

        $log.log("requset with data : " + angular.toJson(user));
        loginService.login(angular.toJson(user)).success(function (response) {

            $log.log("response: " + angular.toJson(response));

            if(response.status === 200){
              localStorage.token = response.content[0].token;
              localStorage.username = $scope.msg.verifyCode;
              localStorage.phoneNum = $scope.msg.phoneNum;
              // userService.set('username', $scope.msg.verifyCode);
              // userService.set('phoneNum', $scope.msg.phoneNum);
              $state.go('tab.account');
            }else{
              alert(response.msgs.fail);
            }
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

          if(response.status === 200)
            $log.log("发送验证码成功");

          }).error(function (response, status) {
              $log.log("发送验证码失败");
        });
    }
})

// 个人信息详情
.controller('PersonDetailCtrl', function($log, $scope, $stateParams, $state,loadDataService,userService) {
    
});
