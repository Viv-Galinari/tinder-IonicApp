'use strict';

app.controller('SettingCtrl', function(Auth, $ionicPopup) {
	
//three different variables
	var sett = this;

//store user's preferences (age and gender) into local storage so it's there when login again
//if 'window.localStorage' already has a value, it keeps it, otherwise change to default 25
	sett.maxAge = window.localStorage.getItem('maxAge') || 25; 
	
	sett.men = JSON.parse(window.localStorage.getItem('men'));
	sett.men = sett.men === null? true : sett.men;

	sett.women = JSON.parse(window.localStorage.getItem('women'));
	sett.women = sett.women === null? true : sett.women;

//functions for variables above. Each time user change settings, it will store it in local storage 
	sett.changeMaxAge = function() {
		window.localStorage.setItem('maxAge', sett.maxAge);
	};

	sett.selectMen = function() {
		window.localStorage.setItem('men', sett.men);
	};

	sett.selectWomen = function() {
		window.localStorage.setItem('women', sett.women);
	};

//Ionic popup to confirm user has logged out
	sett.logout = function() {
		$ionicPopup.confirm({
			title: 'Logout',
			template: 'Do you want to logout?'
		})
		.then(function(res) { //then function with 'responde'
			if (res) { //if they say 'yes' then we know response has a value
				Auth.logout(); //and log out
			}
		});
		
	};

});