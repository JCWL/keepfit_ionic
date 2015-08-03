// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform, $rootScope, $state, $stateParams, userService) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  userService.set('phoneNum', localStorage.phoneNum == undefined? '':localStorage.phoneNum);
  userService.set('username', localStorage.username == undefined? '':localStorage.username);

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
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
    cache: false,
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