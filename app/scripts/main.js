'use strict';

angular.module('bedrockServices', ['ngResource']).
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
});

angular.module('bedrock', ['bedrockServices']);

function BedrockOrderCtrl($scope, Courses, Downloads) {
    $scope.courseOptions = Courses.query();
    $scope.maxCourses = 10;
    $scope.minCourses = 1;
    
    var emptyCourse = {course: '', company: '', city: '', state: ''};
    $scope.courses = [];
    
    //Load an initial 6 empty courses
    for(var i=0;i<6;i++) {
        $scope.courses.push(jQuery.extend({}, emptyCourse));
    }
    
    $scope.addCourse = function() {
        $scope.courses.push(jQuery.extend({}, emptyCourse));
    };
    
    $scope.removeCourse = function(index) {
        $scope.courses.splice(index, 1);
    };
    
    $scope.totalCoursePrice = function() {
        var total = 0;
        for(var i=0;i<$scope.courses.length;i++) {
            total += $scope.courses[i].course.price || 0;
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

(function() {
    if(!Modernizr.inputtypes.date) {
        $('#date').datepicker();
    }
}());
