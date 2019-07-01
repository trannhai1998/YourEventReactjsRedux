const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id ) => {
    return {
            type : type,
            eventDate : event.date,
            hostedBy : event.hostedBy,
            title : event.title,
            photoURL : event.hostPhotoURL,
            timestamp : admin.firestore.FieldValue.serverTimestamp(),
            hostUid : event.hostUid,
            eventId: id
    }
}

exports.createActivity = functions.firestore
    .document('events/{eventId}')
    .onCreate(event => {
        let newEvent = event.data();
        const activity = newActivity('newEvent',newEvent,event.id);
        return admin.firestore().collection('activity')
            .add(activity)
            .then((docRef) => {
                return console.log('Activity created with ID :' , docRef.id);
            })
            .catch((error) => {
                return console.log('Error adding activity', error);
            })
    });


exports.cancelActivity = functions.firestore
    .document('events/{eventId}')
    .onUpdate((event, context) => {
    let updatedEvent = event.after.data();
    let previousEventData = event.before.data();
    if (!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled) return false

    const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId);
    
    return  admin.firestore().collection('activity')
        .add(activity)
        .then((docRef) => {
            console.log(docRef);
            return console.log('Activity created with ID :' , docRef.id);
        })
        .catch((error) => {
            return console.log('Error adding activity', error);
        })
})

exports.userFollowing = functions.firestore
    .document('users/{followerUid}/following/{followingUid}')
    .onCreate((event, context) => {
        console.log('v1');
        const followerUid = context.params.followerUid;
        const followingUid = context.params.followingUid;
        const followerDoc = admin
            .firestore()
            .collection('npusers')
            .doc(followerUid)

        return followerDoc.get().then(doc => {
            let userData = doc.data();
            console.log({userData});
            let follower = {
                displayName : userData.displayName,
                photoURL : userData.photoURL || '/assets/user.png',
                city : userData.city || 'Unknown city'
            };
            return admin 
                .firestore()
                .collection('users')
                .doc(followingUid)
                .collection('followers')
                .doc(followerUid)
                .set(follower)
        })
    })

    exports.unfollowUser = functions.firestore
    .document('users/{followerUid}/following/{followingUid}')
    .onDelete((event, context) => {
        return admin
           .firestore()
           .collection('users')
           .doc(context.params.followingUid)
           .collection('followers')
           .doc(context.params.followerUid)
           .delete()
           .then(() => {
               return console.log('doc deleted')
           })
           .catch((error)=> {
               return console.log(error)
           })
    })
    

