var user_progress = [];
var database = firebase.database();


function login(pro) {

  if (pro=="google"){
    var provider = new firebase.auth.GoogleAuthProvider();
  }
  else
  {
    var provider = new firebase.auth.FacebookAuthProvider();
  }

  firebase.auth().signInWithRedirect(provider).then(function (result) {
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
    var providerData = user.providerData;
    getUserfromDatabase(uid,displayName,email,photoURL);

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
    // ...
  });
}

function getUserfromDatabase(uid, displayName, email,photoURL)
{
firebase.database().ref('users/' + uid + '/').once("value", snapshot => {
  if (snapshot.exists()) {
    user_progress.push(snapshot.val());
    console.log("User exists!");
    console.log(user_progress);

    writeUserProgress(user_progress[0].politics_level, user_progress[0].politics_lesson_no, "p", "f")
    writeUserProgress(user_progress[0].business_level, user_progress[0].business_lesson_no, "b", "f")
    writeUserProgress(user_progress[0].science_level, user_progress[0].science_lesson_no, "s", "f")
    writeUserProgress(user_progress[0].tech_level, user_progress[0].tech_lesson_no, "t", "f")
    writeUserProgress(user_progress[0].sport_level, user_progress[0].sport_lesson_no, "sp", "f")

    var level = (parseInt(user_progress[0].politics_level)+parseInt(user_progress[0].business_level)+parseInt(user_progress[0].science_level)+parseInt(user_progress[0].tech_level)+parseInt(user_progress[0].sport_level))-5
    $("#straw_bale_score").text(user_progress[0].straw_bale_points);
    $("#level").text(level);
    document.getElementById("profile_image").src = photoURL
    $("#your-profile").html(displayName);

    $("#login-google").remove();
    $("#login-facebook").remove();
    $("#menu-list").append("<a href='#' id='logout' class='list-group-item'>Log Out</a>");

  } else {
    firebase.database().ref('users/' + uid + '/').set({
      "displayName": displayName,
      "email": email,
      "politics_level": 1,
      "politics_lesson_no": 0,
      "business_level": 1,
      "business_lesson_no": 0,
      "sport_level": 1,
      "sport_lesson_no": 0,
      "tech_level": 1,
      "tech_lesson_no": 0,
      "science_level": 1,
      "science_lesson_no": 0,
      "straw_bale_points": 0
    });
    getUserfromDatabase(uid,displayName,email,photoURL);
  }

});}

function fillProgress(id, lesson_no, level, fill) {
  $svg = $("#" + id + "SVG");
  $level = $("#l_" + id + "SVG");

  $level.html("" + level);

  for (let i = 0; i <= 110; i++) {
    if (i <= (lesson_no)) {
      if (fill == "f") {
        $("#" + id + i.toString(), $svg).attr('fill', "#BFF9A4");
      }
      if (fill == "") {
        $("#" + id + i.toString(), $svg).attr('fill', "");
        $level.html("");
      }
    } else {
      if (fill == "f") {
        $("#" + id + i.toString(), $svg).attr('fill', "#e5e5e5");
      }
      if (fill == "") {
        $("#" + id + i.toString(), $svg).attr('fill', "");
        $level.html("");
      }
    }
  }
}

function writeUserProgress(level, lesson_no, pCode, fill) {
  fillProgress(pCode, lesson_no, level, fill)
}

function startLesson(type) {
  var myUrlWithParams = new URL("https://lingomoo.firebaseapp.com/test.html");

  console.log(user_progress[0])

  var key1 = type + "_lesson_no"
  var key2 = type + "_level"

  myUrlWithParams.searchParams.append("type", type);
  myUrlWithParams.searchParams.append("level", user_progress[0][key2]);
  myUrlWithParams.searchParams.append("lesson", user_progress[0][key1]);

  console.log(myUrlWithParams.href);
  window.location.href = myUrlWithParams;
}

$(document).ready(function () {
  console.log("document loaded");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("user already loged in")
      console.log(user)
      getUserfromDatabase(user.uid,user.displayName, user.email, user.photoURL)
    } else {
    }
  });

});

$(window).on("load", function () {
  console.log("window loaded");
});

window.onscroll = function () {
  myFunction()
};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

$(function () {
  $('[data-toggle="popover"]').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    content: '<div class="media"><a href="#" class="pull-left"><img src="images/avatar-tiny.jpg" class="media-object" alt="Sample Image"></a><div class="media-body"><h4 class="media-heading">Jhon Carter</h4><p>Excellent Bootstrap popover! I really love it.</p></div></div>'
  })
})

$(function () {
  $('[data-toggle="popover_straw-bale"]').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    content: '<div class="media"><a href="#" class="pull-left"><img src="images/avatar-tiny.jpg" class="media-object" alt="Sample Image"></a><div class="media-body"><h4 class="media-heading">Jhon Carter</h4><p>Excellent Bootstrap popover! I really love it.</p></div></div>'
  })
})

$(function () {
  $('[data-toggle="popover_lesson"]').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    content: '<div class="media"><a href="#" class="pull-left"><img src="images/avatar-tiny.jpg" class="media-object" alt="Sample Image"></a><div class="media-body"><h4 class="media-heading">Jhon Carter</h4><p>Excellent Bootstrap popover! I really love it.</p></div></div>'
  })
})

$(function () {
  $('[data-toggle="popover-login"]').popover({
    html: true,
    content: function () {
      return $('#popover-content').html();
    }
  });
});

$(document).delegate('#logout', 'click', function (e) {
  e.preventDefault();
  logout();
});
$(document).delegate('#login-google', 'click', function (e) {
  e.preventDefault();
  login("google");
});



function logout() {

  $("#your-profile").html("");
  $("#straw_bale_score").text("");
  $("#level").text("");

  $("#logout").remove();
  $("#menu-list").append("<a href='#' id='login-google' class='list-group-item'>Log In with Google</a>");

  writeUserProgress(user_progress[0].politics_level, user_progress[0].politics_lesson_no, "p", "")
  writeUserProgress(user_progress[0].business_level, user_progress[0].business_lesson_no, "b", "")
  writeUserProgress(user_progress[0].science_level, user_progress[0].science_lesson_no, "s", "")
  writeUserProgress(user_progress[0].tech_level, user_progress[0].tech_lesson_no, "t", "")
  writeUserProgress(user_progress[0].sport_level, user_progress[0].sport_lesson_no, "sp", "")

  user_progress.pop();

  firebase.auth().signOut().then(function () {
    document.getElementById("profile_image").src = "/img/user-circle-solid.svg"

  }, function (error) {
    // An error happened.
  });

}