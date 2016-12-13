var app = angular.module('forefrontContactsApp');
app
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});