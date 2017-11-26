'use strict';

app.factory('Match', function($firebaseArray, $ionicPopup) {

    var ref = firebase.database().ref();

    var Match = {

    	// Pass userID on a function containing all matches by user 
        allMatchesByUser: function(uid) {
            return $firebaseArray(ref.child('matches').child(uid));
        },


        // Function to check if user 1 liked user 2 and if it's a match
        // We call this function when user 1 likes user 2
        checkMatch: function(uid1, uid2) {
            var check = ref.child('likes').child(uid2).child(uid1);
            check.on('value', function(snap) {
            	// if snap value is not empty and they are both true, then we have new matches
                if (snap.val() != null) {
                    ref.child('matches').child(uid1).child(uid2).set(true);
                    ref.child('matches').child(uid2).child(uid1).set(true);

                    // Ionic popup to notify a match
                    $ionicPopup.alert({
                        title: 'Matched',
                        template: 'Yay, it is a match!'
					});
				}
			})
		},

		// Function to remover matches if users decided to do so
		// First, remove match node in the database between two users
		// Second, under service/like.js remove userId2 from userId1 and vice-versa
		removeMatch: function(uid1, uid2) {
			ref.child('matches').child(uid1).child(uid2).remove();
			ref.child('matches').child(uid2).child(uid1).remove();
		}

	};

	return Match;

});