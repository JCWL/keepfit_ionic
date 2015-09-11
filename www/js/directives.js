angular.module('starter.directives', [])

.directive("appMap", function () {
  return {
    restrict: "E",
    replace: true,
    template: "<div id='allMap'></div>",
    scope: {
      // center: "=",		// Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
      // markers: "=",	   // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
      // width: "@",		 // Map width in pixels.
      // height: "@",		// Map height in pixels.
      zoom: "@",		  // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
      // zoomControl: "@",   // Whether to show a zoom control on the map.
      // scaleControl: "@",   // Whether to show scale control on the map.
      lng:"@",
      lat:"@",
    },
    link: function (scope, element, attrs) {

        // var map = new BMap.Map("allMap");            // 创建Map实例
        // var point = new BMap.Point(scope.lng, scope.lat); // 创建点坐标
        // map.centerAndZoom(point,scope.zoom);                 // 初始化地图,设置中心点坐标和地图级别。
        // map.addControl(new BMap.ZoomControl());      //添加地图缩放控件
        // var marker = new BMap.Marker(point);  //创建标注
        // map.addOverlay(marker);                 // 将标注添加到地图中
        var map = new BMap.Map("allMap");
        map.centerAndZoom(new BMap.Point(scope.lng,scope.lat), scope.zoom);

        var p1 = new BMap.Point(localStorage.longitude,localStorage.latitude);
        var p2 = new BMap.Point(scope.lng,scope.lat);

        var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
        driving.search(p1, p2);
        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        // var p1 = new BMap.Point(116.301934,39.977552);
        // var p2 = new BMap.Point(116.508328,39.919141);

        // var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
        // driving.search(p1, p2);
  }
}
})

    .directive( 'hideTabs', function($rootScope){
        return{
            restrict:'AE',
            link:function(scope, element, attributes){
                scope.$watch(attributes.hideTabs, function(value){
                $rootScope.hideTabs = value;
                });
                scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
            }            
        };
    })
.directive( 'ngTabs', function() {
        return {
            scope: true,
            restrict: 'EAC',
            controller: function( $scope ) {
                $scope.tabs = {
                    index: 0,
                    count: 0
                };

                this.headIndex = 0;
                this.bodyIndex = 0;

                this.getTabHeadIndex = function() {
                    return $scope.tabs.count = ++this.headIndex;
                };

                this.getTabBodyIndex = function() {
                    return ++this.bodyIndex;
                };
            }
        };
    })


    .directive( 'ngTabHead', function() {
        return {
            scope: false,
            restrict: 'EAC',
            require: '^ngTabs',
            link: function( scope, element, attributes, controller ) {
                var index = controller.getTabHeadIndex();
                var value = attributes.ngTabHead;
                var active = /[-*\/%^=!<>&|]/.test( value ) ? scope.$eval( value ) : !!value;

                scope.tabs.index = scope.tabs.index || ( active ? index : null );

                element.bind( 'click', function() {
                    scope.tabs.index = index;
                    scope.$$phase || scope.$apply();
                });

                scope.$watch( 'tabs.index', function() {
                    element.toggleClass( 'active', scope.tabs.index === index );
                });
            }
        };
    })


    .directive( 'ngTabBody', function() {
        return {
            scope: false,
            restrict: 'EAC',
            require: '^ngTabs',
            link: function( scope, element, attributes, controller ) {
                var index = controller.getTabBodyIndex();

                scope.$watch( 'tabs.index', function() {
                    element.toggleClass( attributes.ngTabBody + ' ng-show', scope.tabs.index === index );
                });
            }
        };
    });
