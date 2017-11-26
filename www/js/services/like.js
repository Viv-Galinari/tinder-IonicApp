'use strict';

app.factory('Like', function($firebaseArray) {

    var ref = firebase.database().ref();

    var Like = {
		// This function returns only users that have been liked    	
        allLikesByUser: function(uid) {
            return $firebaseArray(ref.child('likes').child(uid));
        },

		// function for user 1 that likes user 2
        addLike: function(uid1, uid2) {
            return ref.child('likes').child(uid1).child(uid2).set(true);
        }
    };

    return Like;

});