/**
 * Created by sangmin on 5/17/15.
 */
var botApp = angular.module('botApp', ['ui.router']);

botApp
    .run(function($rootScope, $urlRouter, $state, $stateParams){

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

//    $rootScope.on('$stateChangeStart', function(evt, nxt, params) {
//        console.log($state.current);
//        if (typeof next.authenticate === 'undefined') {
//            $state.go('home')
//        }
//    });
        $rootScope.$on('$locationChangeSuccess', function(evt){

        })
    })
    .config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider
            .otherwise('/');

        $stateProvider
            .state('home',{
                url: '/',
                templateUrl: "/partials/home/index.html"
            })
            .state('app', {
                url: '/app',
                template: "<p> You're logged in!</p>"
            });
        //$locationProvider.html5mode(true);
});

botApp.controller('testController', function($scope, $window){
    console.log('session',$window.sessionStore);
})

/*
 .run(function ($rootScope, $location, Auth, Skim, Draft) {
 // Redirect to login if route requires auth and you're not logged in
 $rootScope.$on('$stateChangeStart', function (event, next, params) {
 if (typeof next.authenticate !== 'undefined') {
 Auth.isLoggedInAsync(function(loggedIn) {
 if (next.authenticate.authorized) {
 if (next.authenticate.authorized === 'skim') {
 // look up skim's author using params.id
 // make sure it is equal to Auth.getCurrentUser()._id
 Skim.get(params.id)
 .success(function(skim) {
 if (Auth.getCurrentUser()._id !== skim.author) {
 alert("You aren't authorized to access this route.");
 $location.path('/login');
 }
 });
 }
 else if (next.authenticate.authorized === 'draft') {
 Draft.get(params.draftId)
 .success(function(draft) {
 console.log('in success');
 if (Auth.getCurrentUser()._id !== draft.author) {
 alert("You aren't authorized to access this route.");
 $location.path('/login');
 }
 })
 .error(function() {
 console.log('error');
 });
 }
 }
 if (next.authenticate.loggedIn && !loggedIn) {
 alert('Must be logged in to access this route.');
 $location.path('/login');
 }
 if (next.authenticate.admin && !Auth.isAdmin()) {
 alert('Must be an admin to access this route.');
 $location.path('/login');
 }
 });
 }
 });
 */