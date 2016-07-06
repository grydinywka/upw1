var app = angular.module('myApp', []);

app.controller('MainController',['$scope','$http',function($scope,$http) {
    $scope.title = "WEATHER";
    $scope.city = '';
    $scope.clock = '';
    $scope.today = true;
    //$scope.key = "e6f26944155298b1b11981038b156742";
    $scope.search = function(city) {
      var city = $scope.city;
            $http({
                method : "GET",
                url : "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast " +
                      "where woeid in (select woeid from geo.places(1) where text='" + city + "')&format=json&d=6"
            }).then(function mySucces(response) {
                $scope.weather = response.data;
            }, function myError(response) {
                $scope.weather = response.statusText;
            });
    }


   $scope.getTimeString = function(clock) {
        var d = new Date (new Date().toDateString() + ' ' + clock);
        var str = '';
        var hrs = d.getHours();

        var meridian = hrs < 12 ? ' am' : ' pm';
        hrs = hrs % 12;
        if (hrs == 0) { hrs = 12; }
        str += hrs;

        str += ':';
        var mins = d.getMinutes();
        str += (mins < 10 ? '0' : '') + mins;

        str += meridian; 
        return str;
    };

    $scope.formatDate = function(date) {
        var str = date.split(" ");
        
        return str[0] + " " + str[1];
    };

    $scope.formatTime = function(timeStr) {
      return $scope.getTimeString(timeStr);
    }

    // clear city and all the weather results
    $scope.clear = function() {
      $scope.city    = "";
      $scope.weather = "";
    }

    // toggle display
    $scope.toggle = function() {
      $scope.today = !$scope.today;
    }
}]);