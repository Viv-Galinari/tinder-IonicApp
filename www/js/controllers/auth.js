// Create a controller folder so our views can use our services
// Create a file under controller folder names auth.js

//after user login, redirect to homepage
'use strict';

app.controller('AuthCtrl', function(Auth, $state) {

    var auth = this;

    auth.login = function() {
        console.log('Login cliked');
        
        return Auth.login().then(function(user) {
            $state.go('app.home');//this redirect user to the homapage
        });
        
    };

    auth.logout = function() {
        Auth.logout();
    };
});


