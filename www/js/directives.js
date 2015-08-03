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
      lat:"@"
    },
    link: function (scope, element, attrs) {
    //   var map;
    //   // 百度地图API功能
    //   map = new BMap.Map("allMap");
    //   map.addControl(new BMap.ZoomControl());
    //   // 创建地址解析器实例
    //    var myGeo = new BMap.Geocoder();
    //   // 将地址解析结果显示在地图上,并调整地图视野
    //   myGeo.getPoint(scope.address, function(point){
    //     if (point) {
    //       map.centerAndZoom(point, 16);
    //       map.addOverlay(new BMap.Marker(point));
    //     }
    //   }, "");

        var map = new BMap.Map("allMap");            // 创建Map实例
        // var point = new BMap.Point(scope.lng, scope.lat); // 创建点坐标
        // map.centerAndZoom(point,15); 
        var point = new BMap.Point(scope.lng, scope.lat); // 创建点坐标
        map.centerAndZoom(point,scope.zoom);                 // 初始化地图,设置中心点坐标和地图级别。
        map.addControl(new BMap.ZoomControl());      //添加地图缩放控件
        var marker = new BMap.Marker(point);  //创建标注
        map.addOverlay(marker);                 // 将标注添加到地图中
  }
}
});