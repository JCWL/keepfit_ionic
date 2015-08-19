angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('VenuesCtrl', function ($scope, $log, $ionicPopover, $ionicLoading, loadDataService) {
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
  $log.log("requset {/const/searchVenueType} with data : " + angular.toJson(param));
  loadDataService.types(param).success(function(data, status) {
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));

      $scope.types = data.content;
      $scope.queryCondition.typeName = data.content[0].name;
      $scope.queryCondition.typeId = data.content[0].id;
  });

  // 初始化位置的数据
  var param = {
    "lon":localStorage.longitude == undefined? '121.585696':localStorage.longitude,
    "lat":localStorage.latitude == undefined? '31.209962':localStorage.latitude
  };
  $log.log("requset {/const/searchAreaByLonLat} with data : " + angular.toJson(param));
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
    "lon":localStorage.longitude == undefined? '121.585696':localStorage.longitude,
    "lat":localStorage.latitude == undefined? '31.209962':localStorage.latitude,
    "distance":10000
  };

  $log.log("requset {/venue/search} with data : " + angular.toJson(locInfo));
  $ionicLoading.show({template: 'Loading...'});
  loadDataService.venueList(angular.toJson(locInfo)).success(function (data, status) {
      $scope.venues = data.content;
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));
      $ionicLoading.hide();
  });

  $scope.loadMore = function () {
    loadDataService.venueList(angular.toJson(locInfo)).success(function (data, status) {
      $scope.venues = $scope.venues.concat(data.content);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

})

.controller('VenueDetailCtrl', function ($log, $scope, $stateParams, $ionicLoading, loadDataService, settingsService) {

  var params = {
    "lon":localStorage.longitude == undefined? '121.585696':localStorage.longitude,
    "lat":localStorage.latitude == undefined? '31.209962':localStorage.latitude,
    "id":$stateParams.venueId
  };

  $log.log("requset {/venue/searchVenue} with data : " + angular.toJson(params));
  $ionicLoading.show({template: 'Loading...'});
  loadDataService.venue(params).success(function (data, status) {
      
      $log.log("response.status : " + status);
      $log.log("response : " + angular.toJson(data));

      $scope.venue = data.content[0];
      settingsService.set("venue", data.content[0]);
      $ionicLoading.hide();
  });
})


.controller('VenueScheduleCtrl', function ($log, $scope, $stateParams, $ionicLoading, settingsService) {

    var venue = settingsService.get("venue");
    var schedules = $scope.schedules = new Array();
    $log.log("settingsType : " + venue.settingsType);
    if(1===venue.settingsType){
      //TODO 默认排班
      var times;
      // 取出默认时间段
      for (var p in venue.st){
        times = venue.st[p];
      }
      var today = new Date();
      today.setDate(today.getDate()-1);
      for (var i = 0; i < 7; i++) {

          today.setDate(today.getDate()+1);
          _year = today.getFullYear();
          _month = today.getMonth()+1;
          _date = today.getDate();
          var schedule = new Object();
          schedule.date = _year + '-' + _month + '-' + _date;
          schedule.times = times;
          schedules.push(schedule);
      };
    }else if(2==venue.settingsType){
      //TODO 自定义排班
      // 开始遍历 
      for (var p in venue.st){
        var schedule = new Object();
        schedule.date = p;
        schedule.times = venue.st[p];
        schedules.push(schedule);
      }
    }else{
      return;
    }

    $scope.times = schedules[0].times;

    $scope.changeDate = function (schedule){
      console.log("schedule : " + angular.toJson(schedule) );
      $scope.times = schedule.times;
    }

    $scope.changeTime = function (time){
      console.log("time.id : " + time.id);
    }

})

.controller('VenueMapCtrl', function ($scope, $stateParams, settingsService) {
  
  var venue = settingsService.get("venue");
  $scope.lng = venue.lon;
  $scope.lat = venue.lat;
  $scope.zoom = 16;
})

// 下订单
.controller('PlaceOrderCtrl', function ($log, $scope, $stateParams, settingsService, loadDataService) {

  $scope.venue = settingsService.get("venue");

  function onBridgeReady(data){
    alert(angular.toJson(data));
   WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "appId":data.content[0].appId,     //公众号名称，由商户传入     
           "timeStamp": data.content[0].timeStamp,         //时间戳，自1970年以来的秒数     
           "nonceStr": data.content[0].nonceStr, //随机串     
           "package": data.content[0].package,     
           "signType": data.content[0].signType,         //微信签名方式：     
           "paySign": data.content[0].sign //微信签名 
       },
       function(res){     
           if(res.err_msg == "get_brand_wcpay_request：ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
       }
   ); 
}


  $scope.submitPay = function (){
    var params = {
      "token":localStorage.token,
      "id":300006,
      "price":0.1
    };
    alert(angular.toJson(params));

    loadDataService.getJsapiPayInfo(params).success(function (data, status) {
      $log.log("data : " + angular.toJson(data));
      alert(angular.toJson(data));
      wx.chooseWXPay({
        timestamp: data.content[0].timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.content[0].nonceStr, // 支付签名随机串，不长于 32 位
        package: data.content[0].package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: data.content[0].signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.content[0].sign, // 支付签名
        success: function (res) {
            // 支付成功后的回调函数
            alert("支付成功");
          }
        });

    });
      
  }
})

.controller('AccountCtrl', function ($scope, $state, $log, $ionicLoading, userService, loginService, loadDataService) {

  if(localStorage.openId == undefined || localStorage.openId == null){
    $scope.disable = true;
  }else{
    $scope.disable = false;
  }

  $scope.user = {
    username : (localStorage.username == null)?"未登入":localStorage.username,
    phoneNum : localStorage.phoneNum,
  };

  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";  
    if (r != null)  
         context = r[2];  
    reg = null;  
    r = null;  
    return context == null || context == "" || context == "undefined" ? "" : context;  
  }

  var access_code=GetQueryString('code');
  if (access_code!=null && access_code!=""){
    localStorage.accessCode = access_code;
    var param = {
        code:access_code
    };
    alert("param : " + angular.toJson(param));
    loadDataService.oauth2getAccessToken(param).success(function (data, status) {

          $ionicLoading.show({template: '努力登录中...'});
    
          alert("response : " + angular.toJson(data));
          localStorage.openId = data.content[0].openId;

          //登录我们自己的服务器
          var user = {
            phoneNum : 1234567890,
            authLogoUrl : "",
            clientType : 1,
            code : localStorage.accessCode,
            openId : localStorage.openId,
            smsCode : 1234
          };

          alert("requset with data : " + angular.toJson(user));
          loginService.login(angular.toJson(user)).success(function (response) {

              alert("response: " + angular.toJson(response));
              localStorage.token = response.content[0].token;
              $scope.user.username = localStorage.username = response.content[0].token;
              $scope.user.phoneNum = localStorage.phoneNum = response.content[0].token;
              $scope.disable = false;
              $ionicLoading.hide();
              $scope.$digest();
            }).error(function (response, status) {
                alert("登录失败");
                $ionicLoading.hide();
          });
          //登录我们自己的服务器结束

      });
  }

  $scope.isLogined = function () {
      alert("localStorage.openId : " + localStorage.openId);
    // if(localStorage.token == undefined || localStorage.token == null){
    if(localStorage.openId == undefined || localStorage.openId == null){
      var currenturl=window.location.href;
      alert("currenturl : "+currenturl);
      window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdf0798b126b0c235&redirect_uri="+encodeURIComponent(currenturl)+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    }
  };

  $scope.logout = function () {

    $ionicLoading.show({template: '正在退出...'});

    var token={
      token : localStorage.token
    }
    alert("requset with data : " + angular.toJson(token));
    loginService.logout(angular.toJson(token)).success(function (response) {
        $log.log("response : " + angular.toJson(response));
          localStorage.clear();
          $scope.user = {
            username : '未登录',
            phoneNum : ''
          };
          $scope.disable = true;
          $ionicLoading.hide();
          $state.go('tab.venues');
          $scope.$digest();
          
      }).error(function (response, status) {
          alert("退出登录失败！");
          $ionicLoading.hide();
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
.controller('OrderCtrl', function ($log, $scope, $stateParams) {
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
.controller('RegisterCtrl', function ($log, $scope, $stateParams, $state, $ionicLoading, loadDataService, userService, loginService) {
    
    // function GetQueryString(name) {  
    //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    //   var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    //   var context = "";  
    //   if (r != null)  
    //        context = r[2];  
    //   reg = null;  
    //   r = null;  
    //   return context == null || context == "" || context == "undefined" ? "" : context;  
    // }

    // var access_code=GetQueryString('code');
    // if (access_code==null || access_code==""){
    //   var currenturl=window.location.href+"/register";
    //   alert("currenturl : "+currenturl);
    //   window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdf0798b126b0c235&redirect_uri="+encodeURIComponent(currenturl)+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    // }else{
    //   localStorage.accessCode = access_code;
    //   var param = {
    //     code:access_code
    //   };
    //   $log.log("param : " + angular.toJson(param));
    //   loadDataService.oauth2getAccessToken(param).success(function (data, status) {
    
    //       $log.log("response.status : " + status);
    //       alert("response : " + angular.toJson(data));
    //       localStorage.openId = data.content[0].openId;
    //   });
    // }

    $scope.msg = {
      phoneNum : '' ,
      username : ''
    };

    $scope.msgOnBtn = '验证码';
    $scope.disable = false;

    $scope.login = function (){

        $ionicLoading.show({template: 'Loading...'});

        var user = {
          phoneNum : $scope.msg.phoneNum,
          authLogoUrl : "",
          clientType : 1,
          code : localStorage.accessCode,
          openId : localStorage.openId,
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
            $ionicLoading.hide();
          }).error(function (response, status) {
              alert("登录失败");
              $ionicLoading.hide();
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
