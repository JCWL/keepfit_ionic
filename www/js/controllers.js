angular.module('starter.controllers', ["ngSanitize"])

.controller('DashCtrl', function ($scope) {})

.controller('VenuesCtrl', function ($scope, $log, $ionicPopover, $state, $stateParams, $ionicLoading, loadDataService) {
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
    typeName : null,
    typeId : null,
    areaName : null,
    areaId : null
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
      var obj = {"name":"全部类型","status":1};
      data.content.unshift(obj);
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
      $log.log("response : " + angular.toJson(data));
      var obj = {"areaName":"附近","cityId":"310100"};
      data.content[0].areas.unshift(obj);
      $scope.positions = data.content[0].areas;
      $scope.displayCity = data.content[0].cityName;
      $scope.queryCondition.areaName = data.content[0].areas[0].areaName;
      $scope.queryCondition.areaId = data.content[0].areas[0].areaId;
  });

  // 初始化城市的数据
  var param = {};
  $log.log("request {/const/searchCity} with data : " + angular.toJson(param));
  loadDataService.cities(param).success(function(data,status) {
      $log.log("response.status :" + status);
      $log.log("response :" + angular.toJson(data));

      $scope.cities = data.content;
      $scope.queryCondition.cityName  = data.content[0].name;
      $scope.queryCondition.cityId = data.content[0].id;
  });

  // 选择种类时绑定函数
  $scope.chooseType = function(typeName, typeId) {
      $scope.queryCondition.typeName = typeName;
      $scope.queryCondition.typeId = typeId;
      $scope.popoverType.hide();
      $log.log("choosen type : ", $scope.queryCondition.typeName, $scope.queryCondition.typeId);
      $scope.currentPage = 0;
      $scope.noMoreItemsAvailable = false;
      $scope.venues = [];
      $scope.loadMore();
  }

  // 选择种类时绑定函数
  $scope.choosePosition= function(areaName, areaId) {
      $scope.queryCondition.areaName = areaName;
      $scope.queryCondition.areaId = areaId;
      $scope.popoverPosition.hide();
      $log.log("choosen area : ", $scope.queryCondition.areaName, $scope.queryCondition.areaId);
      $scope.currentPage = 0;
      $scope.noMoreItemsAvailable = false;
      $scope.venues = [];
      $scope.loadMore();
  }

  //切换位置时绑定函数
  $scope.chooseCity= function(cityName, cityId){
      $scope.queryCondition.cityName = cityName;
      $scope.queryCondition.cityId = cityId;
      $scope.popoverCity.hide();
      $scope.displayCity = cityName;
      $log.log("choose city :", $scope.queryCondition.cityName, $scope.queryCondition.cityId);

      // 切换城市的数据
      var param = {
        "cityId" : $scope.queryCondition.cityId
      };
      $log.log("requset {/const/searchByCity} with data : " + angular.toJson(param));
      loadDataService.searchByCity(param).success(function(data,status){
          $log.log("response.data :" + angular.toJson(data));
          var obj = {"areaName":"附近","cityId":"310100"};
          data.content.unshift(obj);
          $scope.positions = data.content;
          $scope.queryCondition.areaName = data.content[0].areaName;
          $scope.queryCondition.areaId = data.content[0].areaId;
      });

      $scope.currentPage = 0;
      $scope.noMoreItemsAvailable = false;
      $scope.venues = [];
      $scope.loadMore();
}


  // 初始化4个popover
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
  $ionicPopover.fromTemplateUrl('templates/popover-city.html',{
    scope: $scope
  }).then(function(popover){
    $scope.popoverCity = popover;
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
  $scope.showpopovercity = function($event){
      $scope.popoverCity.show($event);
  }
  
  $scope.currentPage = 0;
  $scope.noMoreItemsAvailable = false;
  $scope.venues = [];

  $scope.loadMore = function () {
    $ionicLoading.show({template: 'Loading...'});
    
    var locInfo = {
      "lon":localStorage.longitude == undefined? '121.585696':localStorage.longitude,
      "lat":localStorage.latitude == undefined? '31.209962':localStorage.latitude,
      "distance":500000,
      "pageSize":3,
      "venueType": $scope.queryCondition.typeId,
      "areaId":$scope.queryCondition.areaId,
      "currentPage": $scope.currentPage,
      "cityId": $scope.queryCondition.cityId
    };
    $log.log("requset {/venue/search} with data : " + angular.toJson(locInfo));
    loadDataService.venueList(angular.toJson(locInfo)).success(function (data, status) {
      $log.log("response.data : " + angular.toJson(data));
      $scope.venues = $scope.venues.concat(data.content);
      $scope.contentLength = data.content.length;
      $ionicLoading.hide();
      $scope.currentPage++;
    });
    $log.log("$scope.contentLength : " + $scope.contentLength);
    if($scope.contentLength < 3){
      $scope.noMoreItemsAvailable = true;
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  
  $scope.loadMore();
  
})
.controller('VenueDetailCtrl', function ($log, $rootScope, $scope, $stateParams, $ionicSlideBoxDelegate, $ionicLoading, loadDataService, settingsService) {

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
      //$scope.venueId = data.content[0].id;
      $scope.courses = data.content[0].courses;
      settingsService.set("venue", data.content[0]);
      $ionicSlideBoxDelegate.update();
      $ionicLoading.hide();
      // $scope.$digest();
  });
  function caluDates() {
    var today = new Date();
      today.setDate(today.getDate()-1);
      $log.log("today :" + today);
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
          var date = _month + '月' + _date + '日 (周' + _day + ')';
          var ss = _year + '/' + _month + '/' + _date;
          var week = _day;
          var day = _date; 
          var obj = {
            week,
            day,
            date
          }
          res.push(obj);
      };
      return res;
    }
    $scope.dayTest = caluDates();
  // var venue = settingsService.get("venue");
  // var param = {
  //   "id" : venue.id
  // } ;
  // $log.log("venueId : " + angular.toJson(param)); 
  // $log.log("requset {/venue/searchVenueVip} with data : " + angular.toJson(param));
  // $ionicLoading.show({template: 'Loading...'});
  // loadDataService.searchVenueVip(param).success(function (data, status) {
  //     $log.log("response.status : " + status);
  //     $log.log("vip response :" + angular.toJson(data));
  //     $scope.venuevips = data.content;
  //     //$scope.venueVips = $scope.venueVips.concat(data.content);
  //     //$log.log("lcw :" + angular.toJson($scope.venueVips));
  //     //$rootScope.vipPhoto = data.content[0].smallIcon;
  //     //$rootScope.vipName = data.content[0].name;
  //     $ionicLoading.hide();
  // });

})
.controller('CourseDetailCtrl',function ($log, $rootScope, $ionicPopover, $state, $scope, $stateParams, $ionicSlideBoxDelegate, $ionicLoading, loadDataService, settingsService){
  var venue = settingsService.get("venue");
  var param = {
      "id" : $stateParams.courseId
  };
  $log.log("courseId : " + angular.toJson(param)); 
  $log.log("requset {/course/searchById} with data : " + angular.toJson(param));
  loadDataService.searchVenueCourse(param).success(function (data, status) {
    $log.log("response.status : " + status);
    $log.log("course response :" + angular.toJson(data));
    $scope.course = data.content[0];
    $scope.venue = data.content[0].venue;
    settingsService.set("course", data.content[0]);
    $ionicLoading.hide();
  });

  var venue = settingsService.get("venue");
  var param = {
    "id" : venue.id
  } ;
  $log.log("venueId : " + angular.toJson(param)); 
  $log.log("requset {/venue/searchVenueVip} with data : " + angular.toJson(param));
  $ionicLoading.show({template: 'Loading...'});
  loadDataService.searchVenueVip(param).success(function (data, status) {
      $log.log("response.status : " + status);
      $log.log("vip response :" + angular.toJson(data));
      if (data.content.length != 0) {
        $scope.venuevips = data.content;
        $rootScope.vipPhoto = data.content[0].smallIcon;
        // $rootScope.vipPhoto111 = new Array[5];
        // $scope.vipPhoto111[0] = data.content[0];
      };
      
      //$scope.venueVips = $scope.venueVips.concat(data.content);
      //$log.log("lcw :" + angular.toJson($scope.venueVips));
      //$rootScope.vipPhoto = data.content[0].smallIcon;
      //$rootScope.vipName = data.content[0].name;
      $ionicLoading.hide();
  });
  //
  $ionicPopover.fromTemplateUrl('templates/vip-list.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popoverViplist= popover;
  });

  $scope.showpopoverViplist = function ($event) {
      $scope.popoverViplist.show($event);
  }

  $scope.chooseVip = function(vip) {
    $rootScope.vipPhoto = vip.smallIcon;
    $rootScope.vipName = vip.name;
    $scope.popoverViplist.hide();
    //$state.go("tab.course-detail");
  }
})
// .controller('VipListCtrl',function ($log, $rootScope, $state, $scope, $stateParams, $ionicSlideBoxDelegate, $ionicLoading, loadDataService, settingsService) {

//   var venue = settingsService.get("venue");
//   var param = {
//     "id" : venue.id
//   } ;
//   $log.log("venueId : " + angular.toJson(param)); 
//   $log.log("requset {/venue/searchVenueVip} with data : " + angular.toJson(param));
//   $ionicLoading.show({template: 'Loading...'});
//   loadDataService.searchVenueVip(param).success(function (data, status) {
//       $log.log("response.status : " + status);
//       $log.log("vip response :" + angular.toJson(data));
//       $scope.venuevips = data.content;
//       //$scope.venueVips = $scope.venueVips.concat(data.content);
//       //$log.log("lcw :" + angular.toJson($scope.venueVips));
//       $ionicLoading.hide();
//   });

  
// })


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
.controller('PlaceOrderCtrl', function ($log, $scope, $stateParams, $state, $ionicLoading, settingsService, loadDataService) {

  var venue = settingsService.get("venue");
  var param = {
      "id" : $stateParams.courseId
  };
  $log.log("courseId : " + angular.toJson(param)); 
  $log.log("requset {/course/searchById} with data : " + angular.toJson(param));
  loadDataService.searchVenueCourse(param).success(function (data, status) {
    $log.log("response.status : " + status);
    $log.log("course response :" + angular.toJson(data));
    $scope.course = data.content[0];
    $scope.venue = data.content[0].venue;
    $ionicLoading.hide();
  });
  // var access_code=GetQueryString('code');
  // if (access_code!=null && access_code!=""){
  //   localStorage.accessCode = access_code;
  //   var param = {
  //       code:access_code
  //   };
  //   alert("param : " + angular.toJson(param));
  //   loadDataService.oauth2getAccessToken(param).success(function (data, status) {

  //     alert("excute oauth2getAccessToken : " + angular.toJson(data));
  //         // $ionicLoading.show({template: '努力登录中...'});
  //         // alert("response : " + angular.toJson(data));

  //     localStorage.openId = data.content[0].openId;
  //     //alert("openId: "+ localStorage.openId);  
  //     // $scope.user.username = localStorage.username = data.content[0].nickname;
  //     // $scope.user.phoneNum = localStorage.phoneNum = (data.content[0].city+"."+data.content[0].province);
  //     // $scope.user.photo = localStorage.photo = data.content[0].headImgUrl;
  //     $scope.disable = false;
  //     $scope.$digest();

  //     }).error(function(status){
  //       alert("微信认证失败");
  //     });
  // }else{
  //     var currenturl=window.location.href;
  //     window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdf0798b126b0c235&redirect_uri="+encodeURIComponent(currenturl)+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";  
  // }

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
  function onBridgeReady(result){
    // alert("进入onBridgeReady函数，开始支付\n"+angular.toJson(result));
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId" : result.content[0].appId,                  //公众号名称，由商户传入  
            // "appId" : 'wxdf0798b126b0c235',
            "timeStamp":result.content[0].timeStamp,          //时间戳，自 1970 年以来的秒数  
            "nonceStr" : result.content[0].nonceStr,         //随机串  
            "package" : result.content[0].package,      //商品包信息
            "signType" : result.content[0].signType,        //微信签名方式:  
            "paySign" : result.content[0].sign  
           },
          function(res){
             //alert(res.err_msg);  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返
            switch(res.err_msg) {
              case 'get_brand_wcpay_request:cancel':
                alert('用户取消支付！');
                break;
              case 'get_brand_wcpay_request:fail':
                alert('支付失败！（'+res.err_desc+'）');
                break;
              case 'get_brand_wcpay_request:ok':
                alert('支付成功！');
                insertOrder();
                $state.go('tab.orders');
                break;
              default:
                alert(JSON.stringify(res));
                break;
            } 

           }
         );
       }
  $scope.venue = settingsService.get("venue");
  $scope.submitPay = function (){
    $ionicLoading.show({template: '微信安全支付中...'});
    var params = {
      "token":localStorage.token,
      "id":300006,
      "price":$scope.venue.price
    };   
    loadDataService.getJsapiPayInfo(params).success(function (data, status) {
      $ionicLoading.hide();
      var param = localStorage.token;
        alert("token :" + angular.toJson(param));
      if(param == null || param ==""){
        alert("请先登录");
        $state.go('tab.register');
      }else{
        //alert("查询电话号码");
        loadDataService.getPhoneNumByToken(param).success(function (data, status) {
          alert("phoneNum  : " + angular.toJson(data));
          $scope.phoneNum = data.content[0];
        })
      }
     
      if(data.status === 403){
        alert("token 已经过期 请重新登录");
        $state.go('tab.register');
      }else{
        
        if (typeof WeixinJSBridge == undefined){
          if(document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        }else{
          alert("微信支付！")
          onBridgeReady(data);
          alert("插入订单！")
        }
      }
    });
  }

  var venue = settingsService.get("venue");
  var course = settingsService.get("course");
  function insertOrder() {
    var params = {
      "token" : localStorage.token,
      "toUid" : course.id,
      "orderType" : 3,
      "actualPrice" : course.price
    }
    alert("params: " + angular.toJson(params));
    loadDataService.insertorder(params).success(function(data, status){
        alert("response.status : " + status);
        if(response.status === 200){
              alert("status  is 200  turn into orsers:" + status);
              $state.go('tab.orders');
            }else{
              alert(response.msgs.fail);
            }
        $ionicLoading.hide();
    })
  }
})

.controller('AccountCtrl', function ($scope, $state, $log, $ionicLoading, userService, loginService, loadDataService) {

  if(localStorage.token == undefined || localStorage.token == null){
    $scope.disable = true;
  }else{
    $scope.disable = false;
  }

  $scope.user = {
    username : (localStorage.username == null)?"未登入":localStorage.username,
    phoneNum : localStorage.phoneNum,
    photo : (localStorage.photo == null)?"img/ionic.png":localStorage.photo
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

      alert("excute oauth2getAccessToken : " + angular.toJson(data));

          // $ionicLoading.show({template: '努力登录中...'});
    
          // alert("response : " + angular.toJson(data));
      localStorage.openId = data.content[0].openId;
      $scope.user.username = localStorage.username = data.content[0].nickname;
      $scope.user.phoneNum = localStorage.phoneNum = (data.content[0].city+"."+data.content[0].province);
      $scope.user.photo = localStorage.photo = data.content[0].headImgUrl;
      $scope.disable = false;
      $scope.$digest();

          //登录我们自己的服务器
          // var user = {
          //   phoneNum : 1234567890,
          //   authLogoUrl : "",
          //   clientType : 1,
          //   code : localStorage.accessCode,
          //   openId : localStorage.openId,
          //   smsCode : 1234
          // };

          // // alert("requset with data : " + angular.toJson(user));
          // loginService.login(angular.toJson(user)).success(function (response) {

          //     // alert("response: " + angular.toJson(response));
          //     localStorage.token = response.content[0].token;
          //     $scope.user.username = localStorage.username = response.content[0].token;
          //     $scope.user.phoneNum = localStorage.phoneNum = response.content[0].token;
          //     $scope.disable = false;
          //     $ionicLoading.hide();
          //     $scope.$digest();
          //   }).error(function (response, status) {
          //       alert("登录失败");
          //       $ionicLoading.hide();
          // });
          //登录我们自己的服务器结束

      }).error(function(status){
        alert("微信认证失败");
      });
  }

  $scope.isLogined = function () {
      // alert("localStorage.openId : " + localStorage.openId);
    // if(localStorage.token == undefined || localStorage.token == null){
    // if(localStorage.openId == undefined || localStorage.openId == null){
    //   var currenturl=window.location.href;
    //   // alert("currenturl : "+currenturl);
    //   window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdf0798b126b0c235&redirect_uri="+encodeURIComponent(currenturl)+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    // }
  };

  $scope.logout = function () {

    $ionicLoading.show({template: '正在退出...'});

    var token={
      token : localStorage.token
    }
    // alert("requset with data : " + angular.toJson(token));
    loginService.logout(angular.toJson(token)).success(function (response) {
        $log.log("response : " + angular.toJson(response));
          localStorage.clear();
          $scope.user = {
            username : '未登录',
            phoneNum : '',
            photo: 'img/ionic.png'
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

  $scope.goLogin = function(){
    if(localStorage.openId == undefined || localStorage.openId == null){
       alert("没有通过微信验证！！");
    }else{
      $state.go('tab.register');
    }
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
.controller('OrderCtrl', function ($log, $scope, $stateParams, loginService, loadDataService) {
  // $scope.venue = Chats.get($stateParams.venueId);
  var param = {
      "token" : localStorage.token
    }
  loadDataService.getorders(param).success(function(data, status){
        alert("response.status : " + status);
        alert("getorders response :" + angular.toJson(data));
        $scope.orders = data.content;
        $scope.venue = data.content.venue;
        $scope.course = data.content.course;
        //$scope.orders = $scope.orders.concat(data.content[0]);
        $ionicLoading.hide();
    })
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

        alert("lcwww : " + angular.toJson(user));
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
