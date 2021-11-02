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

// Resets the Curs0r parameters
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
function getAnswer(answer_file_name, element) {
  var storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI
  var gsReference_answer = storage.refFromURL(
    "gs://lingomoo.appspot.com/images/" +
      answer_file_name.replace("question", "answer")
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

// dataObject is 9 data item from firebase database which contains correct_answer, article_url, url, filename, qc
// This function calls createTaskCard to populate the cards
function queryDatabase(dataObject) {

  WStotal = 0
  WScorrect = 0
  WSwrong = 0

  if (dataObject == null) {
    return;
  }
  data = return_questions_answered();

  var dataObject2 = [];
  data.then(function (result) {
    dataObject2.push(result);
    console.log(dataObject2);
    dataFinal = Object.keys(dataObject2[0]).map((key) => [
      key,
      dataObject2[0][key],
    ]);
  });

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
      console.log(WStotal)
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
// getdata = 1 if you want filter data shown on screen 
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
