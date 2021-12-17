var uid;
//var dbref = firebase.database().ref("users/' + uid + '/worksheet").orderByKey();

// this is a strategy pattern function
// sets the strategies for dispaling data on browser
// setStrategy function sets the strategy for different UIData items
// getData functions get the un arranged data fron the firebase database
// arrangeData function gets the database objects and arrange them for  UIDisplay objects
function UIData() {
    this.dataType = ""
  
    this.setStrategy = (dataType) => {
      this.dataType = dataType
    }
  
    this.getDataWithLimitToLast = (databaseRef,limitToLastValue) => {
      return this.dataType.getDataWithLimitToLast(databaseRef, limitToLastValue)
    }

    this.getData = (databaseRef,key) => {
        return this.dataType.getData(databaseRef, key)
    }

    this.getQuestionCount = (databaseRef,key) => {
        return this.dataType.getQuestionCount(databaseRef, key)
    }

    this.getDataWithPagination = (cursor, button) => {
        console.log(button)
        return this.dataType.getDataWithPagination(cursor, button)
    }

    this.createQuestionCards = (result) => {
        return this.dataType.createQuestionCards(result)
    }

    this.getProgressBarData = () => {
        return this.dataType.getProgressBarData()
    }

    this.getWorksheetTitleData = () => {
        return this.dataType.getWorksheetTitleData()
    }

    this.getPaginationData = () => {
        return this.dataType.getPaginationData()
    }
  
    this.arrangeData = data => {
      return this.dataType.arrangeData(data)
    }
  }


// this function 
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

function logout() {
firebase.auth().signOut().then(function() {
    // Sign-out successful.#
    window.location.href = "http://www.lingomoo.com/index.html";
  }, function(error) {
    // An error happened.
  });
}

// adds selected question into the user worksheet folder
// invoked by the button on the worksheet.html - question card
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

// removes one single question frim the user whorksheet folder
// invoked by writeWS() function as it is needed to remove the question once it is stored as workssheet
function removeSingleWSItem(file_name){
    firebase.database().ref('users/' + uid + '/worksheet/' + file_name.replace(".jpg", "")).remove().then(function () {
        console.log("Remove succeeded.")
        });
}

function writeViewCountToFirebase(key, viewNumber) {
    console.log('inside writte the statistics')
    console.log(viewNumber)
  
    firebase.database().ref('worksheets-statistics/' + key).set({
        view: viewNumber + 1
    
    }, function (error) {
        if (error) {
        } else {
          $("#ws_view").html(( viewNumber + 1) + ' views ')  
        }
    });
  }

// removes one single selected question from the user worksheet folder
// removed the question card as well in the worksheet-view.html
// invoked in the worksheet-view.html with remove button on the question card
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

// adds one single question data into the worksheets and worksheets_cat folder
// worksheets_cat cathegorizes the wotksheets
// worksheets folder contains all ws items with no cathegorization
// invoked by writeWS() function
function writeSingleWS(wsname, key, data, wsdatetime, tag1, tag2) {

    firebase.database().ref("worksheets_cat/" + tag1 + "/" + tag2 + "/" +  wsdatetime + "__" + uid +  "___" + wsname + "!!" + count + "_!!" + tag1 + "::" + tag2 + "_" + "/" + key).set({
        article_url: data['article_url'],
        correct_answer: data['correct_answer'],
        file_name: data['file_name']
    }, function (error) {
        if (error) {
        } else {}
    });

    firebase.database().ref("worksheets/" +  wsdatetime + "__" + uid + "___" + wsname + "!!" + count + "_!!" + tag1 + "::" + tag2 + "_"+ "/" + key).set({
        article_url: data['article_url'],
        correct_answer: data['correct_answer'],
        file_name: data['file_name']
    }, function (error) {
        if (error) {
        } else {}
    });

    // creates an emty node with zero values in the statistices node for new worksheet
    writeViewCountToFirebase( (wsdatetime + "__" + uid + "___" + wsname + "!!" + count + "_!!" + tag1 + "::" + tag2 + "_") , 0) 
}

// adds one single question data into the users/uid/my-library folder
// invoked by writeToLibrary() function
function writeSingleToLibrary(key_main, key, data) {

    firebase.database().ref("users/" +  uid + "/my-library/" + key_main + "/" + key).set({
        article_url: data['article_url'],
        correct_answer: data['correct_answer'],
        file_name: data['file_name']
    }, function (error) {
        if (error) {
        } else {}
    });
}

// main function for storing Ws data in firebase
// loops all questions in users/id/worksheet node
// and stores them in worksheets and worksheets_cat nodes
// removes the questions in users/worksheet onces they are stored in worksheets node
// invoked by the 'save worksheet' button on the worksheet-view.html
async function writeWS(wsname, wsdatetime, tag1, tag2) {
firebase.database().ref('users/' + uid + '/worksheet').once("value", snapshot => {
    if (snapshot.exists()) {
        snapshot.forEach(ss => {
            writeSingleWS(wsname, ss.key, ss.val(), wsdatetime, tag1, tag2)
            removeSingleWSItem(ss.val()['file_name'])
        });
    } else {
        libraryFailAlert()
        return 0;
    }
});
}

function librarySuccessAlert(){
    $("#addLibrary-success")
    .fadeTo(3000, 50)
    .slideUp(50, function () {
      $("#addLibrary-success").slideUp(250);
    });
}

function libraryFailAlert(){
    $("#addLibrary-alert")
    .fadeTo(3000, 50)
    .slideUp(50, function () {
      $("#addLibrary-alert").slideUp(250);
    });
}

// main function for adding a WS item into user library
// looks worksheets/key to access the specific WS item
// then loops thoroug that WS item and copy all questions and the WS key into users/uis/my-library node
// invoked by the 'add to my library' button on study.html
async function writeToLibrary(key) {
    firebase.database().ref('worksheets/' + key).once("value", snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(ss => {
                writeSingleToLibrary(key, ss.key, ss.val())
            });
            librarySuccessAlert()
        } else {
            libraryFailAlert()
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

function addUserQuestionAnswered(file_name, correct_answer, user_answer) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    var today = new Date();

    firebase.database().ref('users/' + uid + '/questions-answered/' + file_name.replace(".jpg", "")).set({
        "question": file_name,
        "correct_answer": correct_answer,
        "user_answer": user_answer,
        "date": today.toLocaleString('en-US', options)
    });
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

    $('#librarySaveButton').click (function (e) {
        e.preventDefault(); 
        writeToLibrary($(this).attr("data-ref"))
        $('#modalAddToLibrary').modal('hide');
      });

      $('#logout').click (function (e) {
        e.preventDefault(); 
        logout()
      });

//  document.getElementById("data-ref").click(); 

});
