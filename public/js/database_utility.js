var uid;

function findWSname(text) {
  var myRe = "___(.+?)!!";
  return text.match(myRe)[1];
}

function findWStag1(text) {
  var myRe = "_!!(.+?)::";
  return text.match(myRe)[1];
}

function findWStag2(text) {
  var myRe = "::(.+?)_";
  return text.match(myRe)[1];
}

function findWSdate(text) {
  var myRe = "(.+?)__";
  return text.match(myRe)[1];
}

function findWScreator(text) {
  var myRe = "__(.+?)___";
  return text.match(myRe)[1];
}

function findWSquestioncount(text) {
  var myRe = "!!(.+?)_!!";
  return text.match(myRe)[1];
}

function changeWSCreatePOS(ref) {
  dbref = firebase.database().ref(ref).orderByKey();
  cursor = new Cursor(dbref, 9); 
  reset_cursor_parameters(dbref, cursor) 
  UIDisplayPagination.paginationCursor = cursor;
  cardUiData.getDataWithPagination(cursor,'next').then(result => {cardUiData.createCards(result)});
  getTotalCount(ref, "").then((result) => {
    UIDisplayPagination.paginationTotalCount = Object.keys(result).length;
    UIDisplayPagination.insertPagination();
    UIDisplayPagination.updatePaginationButtons();
  })

}

function changeCreateListElements(ref,POS) {

  console.log("data-loading-in-changeCreateListElements()")
  console.log(ref)
  $("#pre-list").html("");
  ref.once("value").then((snap) => {
    const keys = [];
    const data = [];
    console.log(snap)
    
    // store data in array so it's ordered
    snap.forEach((ss) => {
      data.push(ss.val());
      keys.push(ss.key);
      createListElements(ss.key, POS) 
    });
  });
  //$("html, body").animate({scrollTop: $("#browse-PoS").offset().top - 20,},500);
}

// this is a general utility function that gets a firebase snapshot and returns objects with key and value pairs
async function snapshotToArray(snapshot) {
  let returnObj = {};
  await snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnObj[item.key] = item;
  });
  return returnObj;
};

// this is a general utility function that uses 'databaseRef' and 'limitToLastValue' for firebase database query
// and returns the result of query as objects with key value pairs 
async function getFirebaseDataWithLimitToLast(databaseRef, limitToLastValue){

  console.log("data-loading-in-getFirebaseDataWithLimitToLast")
  console.log(databaseRef)

  const response = await firebase.database().ref(databaseRef).limitToLast(limitToLastValue).once("value").then((snap) =>  {return snap});
  return await snapshotToArray(response)
}

async function getFirebaseData(databaseRef, key){

  console.log("data-loading-in-getFirebaseData()")
  console.log(databaseRef + key)

  const response = await firebase.database().ref(databaseRef + key).once("value").then((snap) =>  {return snap});
  return await snapshotToArray(response)
}

async function getTotalCount(databaseRef, key){

  console.log("data-loading-in-getTotalCount()")
  console.log(databaseRef + key)

  const response = await firebase.database().ref(databaseRef + key).once("value").then((snap) =>  {return snap});
  return await snapshotToArray(response)
}

async function getFirebaseDataWithPagination(cursor, button){
  let response
  if (button=='next') {response = await cursor.next().then((data) => {return data;});}
  if (button=='previous') {response = await cursor.previous().then((data) => {return data;});}
  return await response.snap
  //return await snapshotToArray(response.snap)
}

async function getCreatorNameByKey(key) {

  console.log("data-loading-in-getCreatorNameByKey")
  console.log('users'+ key)

  const response = await firebase.database().ref("users/" + key).once("value").then((snap) =>  {return snap.val()});
  console.log(response)
  return response
}

// This funtion populates the button click events for the
// Resets the cursor paramaters
// Sets the databse referance with the provided argument -key-
function button_click_populate(key, tag) {
  let ref = "/questions/" + tag + "/" + key.toString() + "/"
  changeWSCreatePOS(ref)
}

// This function runs the queryDatabse funtion which populates the HTML of question cards
function populate_question_cards() {
  cursor.next().then((data) => queryDatabase(data));
}

// Resets the cursor parameters
// Gets the dbRef as database referance
function reset_cursor_params(dbRef) {
  cursor.baseRef = dbRef;
  cursor.firstIndex = 0;
  cursor.lastIndex = 0;
  cursor.lastRecord = 0;
  cursor.pageIndex = 0;
  cursor.lastKey = null;
  cursor.firstKey = null;
}

function reset_cursor_parameters(dbRef, cursor) {
  cursor.baseRef = dbRef;
  cursor.firstIndex = 0;
  cursor.lastIndex = 0;
  cursor.lastRecord = 0;
  cursor.pageIndex = 0;
  cursor.lastKey = null;
  cursor.firstKey = null;
}

function createListElements(key, tag) {
  let button_list = document.createElement("button");
  button_list.setAttribute("type", "button");
  button_list.setAttribute("class", "btn btn-primary btn-sm m-2");
  button_list.textContent = key;

  button_list.onclick = function () {
    button_click_populate(key, tag);
  };
  document.getElementById("pre-list").appendChild(button_list);
}

function addAnswer(url) {
  $("#card-cont")
    .children(".card")
    .last()
    .children(".card-img-top")
    .children("#card-back")
    .attr("src", url);
}

// This function gets the question_answered image from firebase storage
// And assign it to the element which is the image of question
function setAnswerImageToQuestion(answer_file_name, element) {
  let storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI
  let gsReference_answer = storage.refFromURL("gs://lingomoo.appspot.com/images/" + answer_file_name.replace("question", "answer") + ".jpg");
  gsReference_answer.getDownloadURL().then(function (url) {element.attr("src", url);}).catch(function (error) {});
  element.attr("class", "card-img answered");
}
// This function gets the question_answered image from firebase storage
// And assign return the url
function getAnswerImageURL(questionFileName) {
  const storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI
  const gsReference_answer = storage.refFromURL("gs://lingomoo.appspot.com/images/" + questionFileName.replace("question", "answer"));
  gsReference_answer.getDownloadURL().then(function (url) {return url;}).catch(function (error) {});
}

// This function returns answered questions data object for the active user
returnAnsweredQuestionsDataObjectForUser = async function () {

  console.log("data-loading-in-returnAnsweredQuestionsDataObjectForUser()")
  console.log('users/' + uid + '/questions-answered/')

  const ref = firebase.database().ref('users/' + uid + '/questions-answered/')
  try {
      let snapshot = await ref.once("value");
      return snapshot.val();
  }
  catch (errorObject) {
  }
}

// This function gets the filter keywords and
// Calls createListElements for VERB to show them on screen
function getFilterData(dbref) {

  console.log("data-loading-in-getFilterData())")
  console.log(dbref)

  dbref.once("value").then((snap) => {
    const keys = [];
    const data = [];
    // store data in array so it's ordered
    snap.forEach((ss) => {
      data.push(ss.val());
      keys.push(ss.key);
      createListElements(ss.key, "VERB");
    });
  });
}

function timeSince(date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }
  return interval + ' ' + intervalType + ' ago';
};

function abcdTo1234(answerInNumber) {
  if (answerInNumber == 0) {return "A"}
  if (answerInNumber == 1) {return "B"}
  if (answerInNumber == 2) {return "C"}
  if (answerInNumber == 3) {return "D"}
}

function updateTitleAndProcessBar() {
  UIDisplayProgressBar.progressBar = studyViewPagePBData.getProgressBarData();
  UIDisplayProgressBar.updateProgressBar();
  
  UIDisplayWorksheetTitle.worksheetTitle = studyViewPageWTData.getWorksheetTitleData();
  UIDisplayWorksheetTitle.updateWorksheetTitle();
  }
   
function setHTMLStyleForTickCross(userAnsweredQuestionData) {
    let HTMLImageStyleTick = ""
    let HTMLImageStyleCross = ""
  
    console.log(userAnsweredQuestionData)
    console.log(userAnswerGLOBAL)
    if (userAnsweredQuestionData["correct_answer"] == userAnsweredQuestionData["user_answer"]) {
      console.log("Dogru Cevap");
      countCorrectAnswer += 1;
      HTMLImageStyleTick = "display: inline;"
  
      UIDisplayProgressBar.updateProgressBar();
    } 
    else {
      console.log("Yanlis Cevap");
      countWrongAnswer += 1;
      HTMLImageStyleCross = "display: inline;"
  
      UIDisplayProgressBar.updateProgressBar();
    }
    return [HTMLImageStyleTick, HTMLImageStyleCross]
}
  
function getAnsweredQuestionData(questionFileName, userID) {

  console.log("data-loading-in-rgetAnsweredQuestionData()")
  console.log('users/' + userID + '/questions-answered/' + questionFileName.replace(".jpg", ""))

  return firebase.database().ref('users/' + userID + '/questions-answered/' + questionFileName.replace(".jpg", "")).once("value").then((snap) => {return snap.val()})
}
  
function displayWorksheetProgress() {
    if (totalQuestionCount !== 0) {
      Cper = (countCorrectAnswer / totalQuestionCount_cursor) * 100;
    } else {
      Cper = 0;
    }
  
    if (countWrongAnswer !== 0) {
      Wper = (countWrongAnswer / totalQuestionCount_cursor) * 100;
    } else {
      Wper = 0;
    }
  
    $("#Pcorrect").attr("style", "width: " + Cper + "%");
    $("#Pwrong").attr("style", "width: " + Wper + "%");
  
    $("#Pcorrect").html(Math.round((countCorrectAnswer / totalQuestionCount) * 100) + "%");
    $("#Pwrong").html(Math.round((countWrongAnswer / totalQuestionCount) * 100) + "%");
  
    $("#progress_label").html(
      "<i class='bx bx-trending-up' ></i>" +
        " " +
        (countCorrectAnswer + countWrongAnswer) +
        " of " +
        totalQuestionCount_cursor +
        " is completed"
    );
}
  
function increaseWorksheetViewCount(key) {

  console.log("data-loading-in-increaseWorksheetViewCount()")
  console.log("worksheets-statistics/" + key)

    firebase
      .database()
      .ref("worksheets-statistics/" + key)
      .once("value")
      .then((snap) => {
        snap.forEach((data) => {
          viewNumber = parseInt(data.val());
          writeViewCountToFirebase(key, viewNumber);
        });
      });
}
  
function writeViewCountToFirebase(key, viewNumber) {
  
    firebase.database().ref("worksheets-statistics/" + key).set(
        {
          view: viewNumber + 1,
        },
        function (error) {
          if (error) {
          } else {
            $("#ws_view").html(
              "<i class='bx bx-show'></i>" + " " + (viewNumber + 1) + " views "
            );
          }
        }
      );
}
