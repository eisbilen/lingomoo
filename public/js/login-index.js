var uid;

function loginWithGoogle() {
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

function createAccount(email, password){
    $("#error-message").text("");
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        $("#error-message").text(errorMessage);
        if (errorMessage==null)
        {
            logIn(email, password);
        }
        $("#create-account").prop("disabled", false);
        // add spinner to button
        $("#create-account").html(
          'Create my account'
        );
      });
}

function logIn(email, password){
    $("#error-message").text("");
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        $("#error-message-login").text(errorMessage);
        if (errorMessage==null)
        {
            logIn(email, password);
        }
        $("#signInEmail").prop("disabled", false);
        // add spinner to button
        $("#signInEmail").html(
          'Log In'
        );
      });
}

$("#login-google").click(function () {
    console.log("logging in")
    loginWithGoogle();
});
$("#signup-google").click(function () {
    console.log("logging in")
    loginWithGoogle();
});

$("#create-account").click(function () {
    $(this).prop("disabled", true);
      // add spinner to button
      $(this).html(
        '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Create my account'
      );

    var email = $("#email").val();
    var password = $("#password").val();
    createAccount(email, password);
});

$("#signInEmail").click(function () {
    $(this).prop("disabled", true);
    // add spinner to button
    $(this).html(
      '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Log In'
    );

    var email = $("#email-login").val();
    var password = $("#password-login").val();
    logIn(email, password);
});
  
$("#already-have-account").click(function () {
    $("#signUpModal").modal("hide");
});

$(document).ready(function () {
    console.log("document loaded");
    console.log("logging in")
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("user already signed in")
            console.log(user)
            uid = user.uid;
            window.location.href = "http://www.lingomoo.com/study.html";
        } else {
            console.log("user signed out")
        }
    });
});