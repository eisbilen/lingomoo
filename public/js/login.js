var uid;
var dbref = firebase.database().ref("users/' + uid + '/worksheet").orderByKey();

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        console.log(photoURL);
        console.log(user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode)
        // ...
    });
}

function addQuestionToWS(url, file_name, correct_answer, count) {
    firebase.database().ref('users/' + uid + '/worksheet/' + file_name.replace(".jpg", "")).set({
        article_url: "",
        correct_answer: correct_answer,
        file_name: file_name.replace(".jpg", "")
    }, function (error) {
        if (error) {
            // The write failed...
            $("#danger-alert").fadeTo(2000, 50).slideUp(50, function () {
                $("#danger-alert").slideUp(50);
            });

        } else {
            $('#ws-question-count').html(parseInt($('#ws-question-count').html(), 10) + 1)
            $("#success-alert").fadeTo(2000, 50).slideUp(50, function () {
                $("#success-alert").slideUp(50);
            });
        }
    });
}

function removeSingleWSItem(file_name){
    firebase.database().ref('users/' + uid + '/worksheet/' + file_name.replace(".jpg", "")).remove().then(function () {
        console.log("Remove succeeded.")
        });
}

function removeQuestionFromWS(thisCard, url, file_name, correct_answer, count) {
    firebase.database().ref('users/' + uid + '/worksheet/' + file_name.replace(".jpg", "")).remove().then(function () {
        console.log("Remove succeeded.")

        $('#ws-question-count').html(parseInt($('#ws-question-count').html(), 10) - 1)
        $("#success-remove-alert").fadeTo(2000, 50).slideUp(50, function () {
            $("#success-remove-alert").slideUp(50);
        });

        thisCard.remove();

    })
        .catch(function (error) {
            console.log("Remove failed: " + error.message)

        });
}

function writeSingleWS(wsname, key, data, wsdatetime, tag1, tag2) {

    firebase.database().ref("worksheets_cat/" + tag1 + "/" + tag2 + "/" +  wsdatetime + "__" + uid +  "___" + wsname + "!!" + count + "!!" + "/" + key).set({
        article_url: data['article_url'],
        correct_answer: data['correct_answer'],
        file_name: data['file_name']
    }, function (error) {
        if (error) {
        } else {}
    });

    firebase.database().ref("worksheets/" +  wsdatetime + "__" + uid + "___" + wsname + "!!" + count + "!!" + "/" + key).set({
        article_url: data['article_url'],
        correct_answer: data['correct_answer'],
        file_name: data['file_name']
    }, function (error) {
        if (error) {
        } else {}
    });

}

async function writeWS(wsname, wsdatetime, tag1, tag2) {
firebase.database().ref('users/' + uid + '/worksheet').once("value", snapshot => {
    if (snapshot.exists()) {
        snapshot.forEach(ss => {
            writeSingleWS(wsname, ss.key, ss.val(), wsdatetime, tag1, tag2)
            removeSingleWSItem(ss.val()['file_name'])
        });
    } else {
        console.log("NO Worksheet Questions Exists!");
        return 0;
    }
});
}


async function writeToLibrary(key) {
    firebase.database().ref('worksheets/' + key).once("value", snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(ss => {
                writeSingleWS(wsname, ss.key, ss.val(), wsdatetime, tag1, tag2)
                removeSingleWSItem(ss.val()['file_name'])
            });
        } else {
            console.log("NO Worksheet Questions Exists!");
            return 0;
        }
    });
    }



function getQuestionsInWS() {

    firebase.database().ref('users/' + uid + '/worksheet').once("value", snapshot => {
        if (snapshot.exists()) {
            const keys = [];
            const data = []; // store data in array so it's ordered

            snapshot.forEach(ss => {
                data.push(ss.val());
                keys.push(ss.key);
            });

            console.log("Worksheet Questions Exists!");
            console.log(snapshot);
            console.log(data);
            console.log(data.length);
            console.log(keys);
            $('#ws-question-count').text(data.length);

            return data.length;

        } else {

            console.log("NO Worksheet Questions Exists!");
            return 0;

        }
    });
}

function getUserfromDatabase(uid, displayName, email, photoURL) {
    firebase.database().ref('users/' + uid + '/').once("value", snapshot => {
        if (snapshot.exists()) {

            console.log("User exists!");
            console.log(snapshot);

            if (photoURL) {
                document.getElementById("profile_image").src = photoURL
            }
            getQuestionsInWS(uid)

            //$("#your-profile").html(displayName);

        } else {
            firebase.database().ref('users/' + uid + '/').set({
                "displayName": displayName,
                "email": email,
            });
            
        }
    });
}

function add_question_answered(file_name, correct_answer, user_answer) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    var today = new Date();

    firebase.database().ref('users/' + uid + '/questions-answered/' + file_name.replace(".jpg", "")).set({
        "question": file_name,
        "correct_answer": correct_answer,
        "user_answer": user_answer,
        "date": today.toLocaleString('en-US', options)
    });
}

return_questions_answered = async function () {

    var ref = firebase.database().ref('users/' + uid + '/questions-answered/')

    try {
        var snapshot = await ref.once("value");
        return snapshot.val();
    }
    catch (errorObject) {
    }
}

$(document).ready(function () {
    console.log("document loaded");
    console.log("logging in")

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("user already signed in")
            console.log(user)
            uid = user.uid;
            console.log(uid)
            getUserfromDatabase(user.uid, user.displayName, user.email, user.photoURL)
        } else {
            console.log("user signed out")
        }
    });

    $("#adToLibrary").onclick = function () {}


});
