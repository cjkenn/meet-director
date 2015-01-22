(function () {
    'use strict';
    var APP = angular.module('MeetDirector.controllers'),
        PARTIALS_PATH = '/static/js/partials/',
        MAX_ROUNDS = 3,
        LBS_CONVERSION = 2.2;

    APP.controller('RunMeetCtrl', [
        '$scope',
        'meetService',
    function (
        $scope,
        meetService
    ) {
        $scope.meetState = meetService;
        $scope.flights = $scope.meetState.flights;
        $scope.lifters = $scope.meetState.lifters;

        $scope.init = function () {
            $scope.currentTab = 'squat';
            $scope.liftRound = 0;
            $scope.lifterRound = 0;
            $scope.flightRound = 0;

            $scope.currentFlight = $scope.flights[0];
            $scope.lifting = $scope.currentFlight.lifters[$scope.lifterRound];
            $scope.setCurrentLift();
        };

        $scope.goToNextLifter = function () {
            $scope.lifterRound = ($scope.lifterRound + 1) % $scope.currentFlight.lifters.length;
            $scope.lifting = $scope.currentFlight.lifters[$scope.lifterRound];
            $scope.setCurrentLift();
        };

        $scope.goToPrevLifter = function () {
            if ($scope.lifterRound === 0) {
                $scope.lifterRound = $scope.currentFlight.lifters.length - 1;
            } else {
                $scope.lifterRound = ($scope.lifterRound - 1) % $scope.currentFlight.lifters.length;
            }

            $scope.lifting = $scope.currentFlight.lifters[$scope.lifterRound];
            $scope.setCurrentLift();
        };

        $scope.switchTab = function (tab) {
            $scope.currentTab = tab;
            $scope.setCurrentLift();
        };

        $scope.setCurrentLift = function () {
           $scope.currentLift = {
                name: $scope.currentTab.charAt(0).toUpperCase() + $scope.currentTab.slice(1),
                liftInKg: $scope.lifting.attempts[$scope.currentTab][$scope.liftRound],
                liftInLb: Math.round($scope.lifting.attempts[$scope.currentTab][$scope.liftRound] * LBS_CONVERSION),
                completed: $scope.lifting.results[$scope.currentTab][$scope.liftRound] !== null
           };
        }

        $scope.recordLift = function (result) {
            // Record the attempt
            $scope.lifting.results[$scope.currentTab][$scope.liftRound] = result;

            // Move to next lifter
            $scope.lifterRound = ($scope.lifterRound + 1) % $scope.currentFlight.lifters.length;
            $scope.lifting = $scope.currentFlight.lifters[$scope.lifterRound];

            $scope.setCurrentLift();
        };

        $scope.nextRound = function () {
            $scope.liftRound = ($scope.liftRound + 1) % MAX_ROUNDS;
            $scope.setCurrentLift();
        };

        $scope.prevRound = function () {
            if ($scope.liftRound === 0) {
                $scope.liftRound = MAX_ROUNDS - 1;
            } else {
                $scope.liftRound = ($scope.liftRound - 1) % MAX_ROUNDS;
            }
            $scope.setCurrentLift();
        };

        $scope.undoLift = function () {
            $scope.lifting.results[$scope.currentTab][$scope.liftRound] = null;
            $scope.setCurrentLift();
        };

        $scope.init();
    }]);
})();

