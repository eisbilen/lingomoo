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
  const response = await firebase.database().ref(databaseRef).limitToLast(limitToLastValue).once("value").then((snap) =>  {return snap});
  return await snapshotToArray(response)
}

async function getFirebaseData(databaseRef, key){
  const response = await firebase.database().ref(databaseRef + key).once("value").then((snap) =>  {return snap});
  return await snapshotToArray(response)
}

async function getTotalCount(databaseRef, key){
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

// This funtion populates the button click events for the
// Resets the cursor paramaters
// Sets the databse referance with the provided argument -key-
function button_click_populate(key, tag) {
  var dbRef = firebase
    .database()
    .ref("/questions/" + tag + "/" + key.toString() + "/")
    .orderByKey();

  console.log(key);
  reset_cursor_params(dbRef);
  populate_question_cards();
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
  var storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI
  var gsReference_answer = storage.refFromURL(
    "gs://lingomoo.appspot.com/images/" +
      answer_file_name.replace("question", "answer") + ".jpg"
  );

  gsReference_answer
    .getDownloadURL()
    .then(function (url) {
      element.attr("src", url);
    })
    .catch(function (error) {
      // Handle any errors
    });
  element.attr("class", "card-img answered");
}

// This function gets the question_answered image from firebase storage
// And assign return the url
function getAnswerImageURL(questionFileName) {
  const storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI
  const gsReference_answer = storage.refFromURL(
    "gs://lingomoo.appspot.com/images/" +
    questionFileName.replace("question", "answer")
  );

  gsReference_answer
    .getDownloadURL()
    .then(function (url) {
      console.log(url)
      return url;
    })
    .catch(function (error) {
      // Handle any errors
    });
}

// This function returns answered questions data object for the active user
returnAnsweredQuestionsDataObjectForUser = async function () {
  const ref = firebase.database().ref('users/' + uid + '/questions-answered/')
  try {
      let snapshot = await ref.once("value");
      return snapshot.val();
  }
  catch (errorObject) {
  }
}

// dataObject is 9 data item from firebase database which contains correct_answer, article_url, url, filename, qc
// This function calls createTaskCard to populate the cards
function queryDatabase(dataObject) {

  totalQuestionCount = 0
  countCorrectAnswer = 0
  countWrongAnswer = 0

  if (dataObject == null) {
    return;
  }

  answeredQuestionsDataObjectForUser = returnAnsweredQuestionsDataObjectForUser();
  answeredQuestionsDataObjectForUser.then((result) => {console.log(result)})
  

  $("#card-cont").empty();
  var keys = Object.keys(dataObject);

  var promises_question = [];
  var promises_answer = [];

  for (var i = 0; i < keys.length; i++) {
    var currentObject = dataObject[keys[i]];

    var filename = currentObject["file_name"];

    //console.log(currentObject.missing_word_q)
    //console.log(currentObject.correct_order_q)

    var filename_question = filename + ".jpg";
    filename_answer = filename.replace("question", "answer") + ".jpg";

    var storage = firebase.storage();
    // Create a reference from a Google Cloud Storage URI
    var gsReference_question = storage.refFromURL(
      "gs://lingomoo.appspot.com/images/" + filename_question
    );
    var gsReference_answer = storage.refFromURL(
      "gs://lingomoo.appspot.com/images/" + filename_answer
    );

    promises_answer.push(gsReference_answer.getDownloadURL());
    promises_question.push(gsReference_question.getDownloadURL());
     
    (function (fl, ca, au) {
      gsReference_question
        .getDownloadURL()
        .then(function (url) {
          createTaskCard(ca, au, url, fl);
          $("#check_answer" + (count - 1).toString()).tooltip("enable");
        })
        .catch(function (error) {
          // Handle any errors
        });
    })(
      filename_question,
      currentObject["correct_answer"],
      currentObject["article_url"],
      currentObject["questions_cat"]
    );

    gsReference_answer
      .getDownloadURL()
      .then(function (url) {
        addAnswer(url);
      })
      .catch(function (error) {
        // Handle any errors
      });
      console.log(totalQuestionCount)
  }

  //console.log(promises_answer)
  $("#previous-button").removeClass("disabled");
  $("#next-button").removeClass("disabled");
}

// This function gets the filter keywords and
// Calls createListElements for VERB to show them on screen
function getFilterData(dbref) {
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

//This function calls the cursor nect() method
//then calls queryDatabase function to shown them on screen
function getQuestionData(cursor) {
  cursor.next().then((data) => queryDatabase(data));
}

//this funton just finds the HTML card container for the questions
// getdata = 1 for worksheet.js if you want filter data shown on screen 
// getdata = 3 for study-worksheet.js if yo do not whant filter data swong on screen
let initListOfTasks = (getData, cursor) => {
  cardContainer = document.getElementById("card-cont");
  
  if (getData !== 3){
    var dbref = firebase.database().ref("/questions/VERB").orderByKey();
  }

  if (getData == 0 || getData == 1) {
    getFilterData(dbref);
  }
 
  $("#next-button").click((e) => {
    e.preventDefault();
    
    url_list = [];
    console.log("--------next--------");

    if ($("#next-button").hasClass("disabled")) {
      return false;
    }
    console.log(cursor.lastRecord);
    if (cursor.lastRecord == 0) {
      $("#next-button").addClass("disabled");
      getQuestionData(cursor);
    }

  });

  // handle previous page requests
  // calls cursor.previous and then use returned value 'data' to call queryDatabes(data)
  $("#previous-button").click((e) => {
    e.preventDefault();
    url_list = [];
    console.log("--------previous--------");
    console.log(cursor.firstIndex);

    if ($("#previous-button").hasClass("disabled")) {
      return false;
    }

    if (cursor.firstIndex !== 1) {
      $("#previous-button").addClass("disabled");
      cursor.previous().then((data) => queryDatabase(data));
    }

  });

  $("#next-button").click();
};

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


function updateTitleAndProcessBar() {
  UIDisplayProgressBar.progressBar = studyViewPagePBData.getProgressBarData();
  UIDisplayProgressBar.updateProgressBar();
  
  UIDisplayWorksheetTitle.worksheetTitle = studyViewPageWTData.getWorksheetTitleData();
  UIDisplayWorksheetTitle.updateWorksheetTitle();
  }
  
  
  function setHTMLStyleForTickCross(userAnsweredQuestionData) {
    let HTMLImageStyleTick = ""
    let HTMLImageStyleCross = ""
  
    if (userAnsweredQuestionData["correct_answer"] == userAnswerGLOBAL) {
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
  
    firebase
      .database()
      .ref("worksheets-statistics/" + key)
      .set(
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

  // This function creates the cards
// This function is called by queryDatabase function with data for every card
let createTaskCard = (correct_answer, article_url, url, fl) => {

  let card_flip = document.createElement("div");
  card_flip.className = "card questions";

  let card_body = document.createElement("div");
  card_body.className = "card-body";

  let card_front = document.createElement("div");
  card_front.className = "card-img-top";

  let cardImage_back = document.createElement("img");
  cardImage_back.className = "card-img-top";
  cardImage_back.src = "";
  cardImage_back.id = "card-back";

  let cardImage_front = document.createElement("img");
  cardImage_front.className = "card-img-top";
  cardImage_front.src = url;

  url_list.push(url);

  cardImage_front.id = fl;

  let correct_img = document.createElement("img");
  correct_img.className = "correct-img";
  correct_img.src = "assets/img/correct.png";

  let wrong_img = document.createElement("img");
  wrong_img.className = "wrong-img";
  wrong_img.src = "assets/img/wrong.png";

  let button_group = document.createElement("div");
  button_group.className = "btn btn-group";
  var attr_grp = document.createAttribute("role");
  attr_grp.value = "group";

  let button_A = document.createElement("button");
  button_A.setAttribute("role", "button");
  button_A.setAttribute("class", "btn btn-primary btn-sm");
  button_A.textContent = "A";

  let button_B = document.createElement("button");
  button_B.setAttribute("type", "button");
  button_B.setAttribute("class", "btn btn-primary btn-sm");
  button_B.textContent = "B";

  let button_C = document.createElement("button");
  button_C.setAttribute("type", "button");
  button_C.setAttribute("class", "btn btn-primary btn-sm");
  button_C.textContent = "C";

  let button_D = document.createElement("button");
  button_D.setAttribute("type", "button");
  button_D.setAttribute("class", "btn btn-primary btn-sm");
  button_D.textContent = "D";

  button_A.onclick = function () {
    console.log("ButtonA");
    userAnswerGLOBAL = 0;
  };

  button_B.onclick = function () {
    console.log("ButtonB");
    userAnswerGLOBAL = 1;
  };

  button_C.onclick = function () {
    console.log("ButtonC");
    userAnswerGLOBAL = 2;
  };

  button_D.onclick = function () {
    console.log("ButtonD");
    userAnswerGLOBAL = 3;
  };

  button_group.appendChild(button_A);
  button_group.appendChild(button_B);
  button_group.appendChild(button_C);
  button_group.appendChild(button_D);

  card_front.appendChild(button_group);

  let butt_link = document.createElement("a");
  butt_link.innerText = "";
  butt_link.className = "url btn btn-warning btn-sm bx bx-news";
  butt_link.id = "article_url" + count.toString();

  var attr1 = document.createAttribute("data-toggle");
  attr1.value = "tooltip";

  var attr2 = document.createAttribute("data-placement");
  attr2.value = "top";

  var attr3 = document.createAttribute("title");
  attr3.value = "Read the News Article";

  var attr4 = document.createAttribute("href");
  attr4.value = article_url;

  var attr5 = document.createAttribute("target");
  attr5.value = "_blank";

  butt_link.setAttributeNode(attr1);
  butt_link.setAttributeNode(attr2);
  butt_link.setAttributeNode(attr3);
  butt_link.setAttributeNode(attr4);
  butt_link.setAttributeNode(attr5);

  let butt = document.createElement("a");
  butt.innerText = "";
  butt.className = "btn btn-warning btn-sm bx bx-right-arrow-circle";
  butt.id = "check_answer" + count.toString();
  var attr1 = document.createAttribute("data-toggle");
  attr1.value = "tooltip";

  var attr2 = document.createAttribute("data-placement");
  attr2.value = "top";

  var attr3 = document.createAttribute("title");
  attr3.value = "Check the Answer";

  var attr4 = document.createAttribute("correct-answer");
  attr4.value = correct_answer;

  butt.setAttributeNode(attr1);
  butt.setAttributeNode(attr2);
  butt.setAttributeNode(attr3);
  butt.setAttributeNode(attr4);

  $("#check_answer" + (count - 1).toString()).tooltip("enable");
  $("#article_url" + (count - 1).toString()).tooltip("enable");

  count = count + 1;
  totalQuestionCount += 1;

  butt.onclick = function () {
    console.log($(this).attr("correct-answer"));
    console.log($(this).get(0).id);
    console.log(userAnswerGLOBAL);

    id_value = $(this).get(0).id;

    addUserQuestionAnswered(
      $(this).siblings(".card-img-top").attr("id"),
      $(this).attr("correct-answer"),
      userAnswerGLOBAL
    );

    if ($(this).attr("correct-answer") == userAnswerGLOBAL) {
      console.log("dogru");
      $(this).siblings(".correct-img").show();
      countCorrectAnswer += 1;
      displayWorksheetProgress();
    } else {
      console.log("yaanlisss");
      $(this).siblings(".wrong-img").show();
      countWrongAnswer += 1;
      displayWorksheetProgress();
    }

    $(this).siblings(".btn-group").remove();

    setAnswerImageToQuestion(
      $(this).siblings(".card-img-top").attr("id"),
      $(this).siblings(".card-img-top")
    );

    console.log(id_value);
    $("#" + id_value).tooltip("hide");
    $("#" + id_value).remove();
  };

  card_flip.appendChild(card_front);
  card_front.appendChild(cardImage_front);

  card_front.appendChild(butt);
  card_front.appendChild(butt_link);
  card_front.appendChild(correct_img);
  card_front.appendChild(wrong_img);


  cardContainer.appendChild(card_flip);

  for (let i = 0; i < dataFinal.length; i++) {
    if (dataFinal[i][0] + ".jpg" == fl) {
      console.log("cevaplanmis soru:" + fl);
      userAnswerGLOBAL = dataFinal[i][1]["user_answer"];

      if (dataFinal[i][1]["correct_answer"] == userAnswerGLOBAL) {
        console.log("dogru");
        countCorrectAnswer += 1;
        console.log(countCorrectAnswer);
        $("#check_answer" + (count - 1).toString())
          .siblings(".correct-img")
          .show();
      } else {
        console.log("yaanlisss");
        countWrongAnswer += 1;
        console.log(countWrongAnswer);
        $("#check_answer" + (count - 1).toString())
          .siblings(".wrong-img")
          .show();
      }

      displayWorksheetProgress();

      var intToletter = "";
      if (dataFinal[i][1]["user_answer"] == 0) {
        intToletter = "A";
      }
      if (dataFinal[i][1]["user_answer"] == 1) {
        intToletter = "B";
      }
      if (dataFinal[i][1]["user_answer"] == 2) {
        intToletter = "C";
      }
      if (dataFinal[i][1]["user_answer"] == 3) {
        intToletter = "D";
      }

      let data_info = document.createElement("div");
      data_info.className = "date-on-card";
      data_info.innerHTML =
        "Your Answer - " +
        intToletter +
        "<br>" +
        "Studied at " +
        dataFinal[i][1]["date"];
      card_front.appendChild(data_info);

      setAnswerImageToQuestion(
        $("#check_answer" + (count - 1).toString())
          .siblings(".card-img-top")
          .attr("id"),
        $("#check_answer" + (count - 1).toString()).siblings(".card-img-top")
      );


      $("#check_answer" + (count - 1).toString())
        .siblings(".btn-group")
        .remove();
      $("#check_answer" + (count - 1).toString()).remove();
    }
  }

};