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
});
