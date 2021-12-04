var dataObject = [];
var dataObject2 = [];
var dataFinal = [];
var url_list = [];
var img_list = [];

let cardContainer;
var filename_answer = " ";
var count = 0;
correct_answer_GLOBAL = 0;
var WStotal = 0;
var WScorrect = 0;
var WSwrong = 0;


var dbref = firebase.database().ref("/questions_cat/VERB").orderByKey();
const cursor = new Cursor(dbref, 9);

value =  {};

const WorkSheetCard = {
  key: "",
  name: "",
  dateCreated: "",
  creator: "",
  questionCount: "",
  container: "",
  tagPrimary: "",
  tagSecondary: "",
  url: "",
  
  get card() {
    return `<div class="col-6 mb-3">
      <div class="card ws p-3 mb-1">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-row align-items-center">
            <div class="icon">
              <img class="card-img-top rounded" src="/img/user-circle-solid.svg" style="height: 40px; width: 40px;"></div>
            <a href="${this.url}" role="button" class="stretched-link" id="data-ref" data-ref="${this.key}"></a>
            <div class="mx-2 c-details"><h6 class="mb-0" id="WScreator">${this.creator}</h6></div>
          </div>
          <div>
            <span class="text1 text-muted mb-2" id="WSdate">${this.dateCreated}</span>
          </div>
        </div>
        <div class="mt-5">
          <h3 class="heading" id="WSname">${this.name}</h3>
          <div class="d-flex align-items-center">
            <div class="mr-auto mt-2">
              <span class="text1 text-muted pull-right">${this.questionCount} questions YAPTIM<span class="text2"></span></span>
            </div>
            <div>
              <a class="bx bx-purchase-tag-alt"></a>
            </div>
            <span class="text2 text-muted pull-right">${this.tagPrimary} - ${this.tagSecondary}</span>
          </div>
        </div>
      </div>
    </div>`
  },

  set card(value) {
    this.containerId = value.containerId;
    this.key = value.key;
    this.name = value.name;
    this.dateCreated = value.dateCreated;
    this.creator = value.creator;
    this.questionCount = value.questionCount;
    this.tagPrimary = value.tagPrimary;
    this.tagSecondary = value.tagSecondary;
    this.url = "study-worksheet.html?worksheetName="
                + encodeURIComponent(
                      this.key
                    + "&wsName="
                    + this.name
                    + "&wsTag1="
                    + this.tagPrimary
                    + "&wsTag2="
                    + this.tagSecondary
                )
  },


  insertCard() {
    cardContainerHTML = document.getElementById(this.containerId);
    cardContainerHTML.insertAdjacentHTML('beforeend', this.card);
  }

};



$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

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
    correct_answer_GLOBAL = 0;
  };

  button_B.onclick = function () {
    console.log("ButtonB");
    correct_answer_GLOBAL = 1;
  };

  button_C.onclick = function () {
    console.log("ButtonC");
    correct_answer_GLOBAL = 2;
  };

  button_D.onclick = function () {
    console.log("ButtonD");
    correct_answer_GLOBAL = 3;
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
  WStotal += 1;

  butt.onclick = function () {
    console.log($(this).attr("correct-answer"));
    console.log($(this).get(0).id);
    console.log(correct_answer_GLOBAL);

    id_value = $(this).get(0).id;

    add_question_answered(
      $(this).siblings(".card-img-top").attr("id"),
      $(this).attr("correct-answer"),
      correct_answer_GLOBAL
    );

    if ($(this).attr("correct-answer") == correct_answer_GLOBAL) {
      console.log("dogru");
      $(this).siblings(".correct-img").show();
      WScorrect += 1;
      writeProgressData();
    } else {
      console.log("yaanlisss");
      $(this).siblings(".wrong-img").show();
      WSwrong += 1;
      writeProgressData();
    }

    $(this).siblings(".btn-group").remove();

    getAnswer(
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

  console.log(cardContainer);
  cardContainer.appendChild(card_flip);

  for (let i = 0; i < dataFinal.length; i++) {
    if (dataFinal[i][0] + ".jpg" == fl) {
      console.log("cevaplanmis soru:" + fl);
      correct_answer_GLOBAL = dataFinal[i][1]["user_answer"];

      if (dataFinal[i][1]["correct_answer"] == correct_answer_GLOBAL) {
        console.log("dogru");
        WScorrect += 1;
        console.log(WScorrect);
        $("#check_answer" + (count - 1).toString())
          .siblings(".correct-img")
          .show();
      } else {
        console.log("yaanlisss");
        WSwrong += 1;
        console.log(WSwrong);
        $("#check_answer" + (count - 1).toString())
          .siblings(".wrong-img")
          .show();
      }

      writeProgressData();

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

      getAnswer(
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

function writeProgressData() {
  if (WStotal !== 0) {
    Cper = (WScorrect / WStotal) * 100;
  } else {
    Cper = 0;
  }

  if (WSwrong !== 0) {
    Wper = (WSwrong / WStotal) * 100;
  } else {
    Wper = 0;
  }

  $("#Pcorrect").attr("style", "width: " + Cper + "%");
  $("#Pwrong").attr("style", "width: " + Wper + "%");

  $("#Pcorrect").html(Math.round((WScorrect / WStotal) * 100) + "%");
  $("#Pwrong").html(Math.round((WSwrong / WStotal) * 100) + "%");

  $("#progress_label").html(
    "<i class='bx bx-trending-up' ></i>" +
      " " +
      (WScorrect + WSwrong) +
      " of " +
      WStotal +
      " is completed"
  );
}


var viewNumber = 0;

function increaseWsView(key) {
  firebase
    .database()
    .ref("worksheets-statistics/" + key)
    .once("value")
    .then((snap) => {
      snap.forEach((data) => {
        console.log("inside the statistics");
        console.log(data.val());
        console.log(data.key);
        viewNumber = parseInt(data.val());
        writeIncreasedViewNumber(key, viewNumber);
      });
    });
}

function writeIncreasedViewNumber(key, viewNumber) {
  console.log("inside writte the statistics");
  console.log(viewNumber);

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

function snapshotToArray(snapshot) {
  var returnArr = {};

  snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr[item.key] = item;
  });
  return returnArr;
};

async function getFirebaseData(endpoint){
  endpoint.once("value").then((snap) =>  {
      return snapshotToArray(snapshots)
  });
}



function WorksheetCardData() {

  this.getData = databaseRef => {
    datadata = []

    console.log(databaseRef)
      var data = "";
      let WSuserid = "";
      let dataMain = new Array;
      const respose = await getFirebaseData(databaseRef)
      console.log(respose);


        snap = []
        snap.forEach((ss) => {
          wscardcount += 1;
          WSuserid = findWScreator(ss.key);
          var db = firebase.database().ref("/users" + "/" + WSuserid).limitToFirst(1);
          console.log(WSuserid);
    
          db.once("value").then((snap) => {
            console.log(snapshotToArray(snap))
            
          console.log(snap.forEach((tt) => {
              console.log(tt.val());
              console.log(tt.key);
              data = tt.val();
    
              cardData = {}
              cardData['key'] = ss.key;
              cardData['name'] = findWSname(ss.key);
              cardData['dateCreated'] = timeSince(findWSdate(ss.key));
              cardData['creator'] = data;
              cardData['questionCount'] = findWSquestioncount(ss.key);
              cardData['containerId'] = 'into';
              cardData['tagPrimary'] = findWStag1(ss.key);
              cardData['tagSecondary'] = findWStag2(ss.key);
              dataMain.push(cardData)
              //return dataMain
            }))
            console.log(dataMain)
           
    
          });
    
        });


      return datadata;
  }

  

}

function UIData() {
  this.dataType = ""

  this.setStrategy = (dataType) => {
    this.dataType = dataType
  }

  this.getData = databaseRef => {
    return this.dataType.getData(databaseRef)
  }
}

const uiData = new UIData()
const worksheetCardData = new WorksheetCardData()
const databaseRef = firebase.database().ref("/worksheets").limitToLast(8);
databaseRef.then()

uiData.setStrategy(worksheetCardData)
console.log(uiData.getData(databaseRef))
ddd = [{data:1},{data:2},{data:3}]
ddd.push({data: 6})
console.log(ddd)

uiData.getData(databaseRef).forEach(data => {
  for (let key in data) {
      console.log(`${key}: ${data[key]}`);
  }
});



uiData.getData(databaseRef).forEach( cardData => {
  console.log(cardData)
  WorkSheetCard.card = cardData;
  WorkSheetCard.insertCard();

})

function getWSdata() {
  var data = "";
  let WSuserid = "";
  var dbref = firebase.database().ref("/worksheets").limitToLast(8);

  dbref.once("value").then((snap) => {
    // store data in array so it's ordered

    wscardcount = 0;
    snap.forEach((ss) => {
      wscardcount += 1;

      WSuserid = findWScreator(ss.key);
      var db = firebase
        .database()
        .ref("/users" + "/" + WSuserid)
        .limitToFirst(1);
      console.log(WSuserid);

      db.once("value").then((snap) => {
        snap.forEach((tt) => {
          console.log(tt.val());
          console.log(tt.key);
          data = tt.val();

          cardData =  {}
          cardData['key'] = ss.key;
          cardData['name'] = findWSname(ss.key);
          cardData['dateCreated'] = timeSince(findWSdate(ss.key));
          cardData['creator'] = data;
          cardData['questionCount'] = findWSquestioncount(ss.key);
          cardData['containerId'] = 'into';
          cardData['tagPrimary'] = findWStag1(ss.key);
          cardData['tagSecondary'] = findWStag2(ss.key);

          WorkSheetCard.card = cardData;
          WorkSheetCard.insertCard();

        });
      });
    });


  });
}




$("#modalAddToLibrary").on("show.bs.modal", function (e) {
  $(this).find("#modal-wsname").text($("#study_label").text());
  console.log($("#modal-wsname"));
});


//getWSdata()
