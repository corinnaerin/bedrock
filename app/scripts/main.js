'use strict';

angular.module('bedrockServices', ['ngResource', 'ui']).
    factory('Courses', function($resource){
        return $resource('courses.json', {}, {
            query: {method:'GET', isArray:true}
        });
    }).
    factory('Downloads', function($resource){
        return $resource('downloads.json', {}, {
            query: {method:'GET', isArray:true}
        });
    })
    .filter('price', function() {
        return function(input) {
            return typeof input == "number" ? '$' + input : '$0';
        }
    })
    .value('ui.config', {
       select2: {
          allowClear: true,
          placeholder: 'Choose'
       }
    })
    .directive('requiredIfCourse', function() {
        return {
            require: 'ngModel',
            link: function($scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    if (viewValue.length > 0 || !$scope.course.course) {
                        ctrl.$setValidity('required', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('required', false);
                        return undefined;
                    }
                });
            }
        }
    })
    .directive('requiredIfDownloads', function() {
        return {
            require: 'ngModel',
            link: function($scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    if (viewValue.length > 0 || $scope.totalDownloads() === 0) {
                        ctrl.$setValidity('required', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('required', false);
                        return undefined;
                    }
                });
            }
        }
    });

angular.module('bedrock', ['bedrockServices']);

function BedrockOrderCtrl($scope, Courses, Downloads) {
    $scope.courseOptions = Courses.query();
    $scope.maxCourses = 50;
    $scope.minCourses = 1;
    
    var emptyCourse = {course: '', company: '', city: '', state: ''};
    $scope.courses = [];
    
    $scope.addCourse = function() {
        $scope.courses.push(jQuery.extend({}, emptyCourse));
    };
    
    //Load an initial 6 empty courses
    for(var i=0;i<6;i++) {
        $scope.addCourse();
    }
    
    $scope.removeCourse = function(index) {
        $scope.courses.splice(index, 1);
    };
    
    $scope.totalCourses = function() {
        var total = 0;
        for(var i=0;i<$scope.courses.length;i++) {
            if ($scope.courses[i].course) {
                total++;
            }
        }
        return total;
    }
    
    $scope.totalCoursePrice = function() {
        var total = 0;
        for(var i=0;i<$scope.courses.length;i++) {
            total += $scope.courses[i].course ? $scope.courses[i].course.price : 0;
        }
        return total;
    };
    
    $scope.downloads = Downloads.query();
    
    $scope.totalDownloads = function() {
        var total = 0;
        for(var i=0;i<$scope.downloads.length;i++) {
            if ($scope.downloads[i].include) {
                total++;
            }
        }
        return total;
    };
    
     $scope.totalDownloadPrice = function() {
        var total = 0;
        for(var i=0;i<$scope.downloads.length;i++) {
            total += $scope.downloads[i].include ? $scope.downloads[i].price : 0;
        }
        return total;
    };
}