var dataObject = [];
var dataObject2 = [];
var dataFinal = [];
var url_list = [];
var img_list = [];

let cardContainer;
var filename_answer = " ";
var count = 0;
correct_answer_GLOBAL = 0;

var WStotal = 0
var WScorrect = 0
var WSwrong = 0

var dbref = firebase.database().ref("/questions_cat/VERB").orderByKey();
const cursor = new Cursor(dbref, 9);

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});


function findWSname(text) {
  var myRe = "___(.+?)!!";
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
  var myRe = "!!(.+?)!!";
  return text.match(myRe)[1];
}

// This function creates the cards
// This function is called by queryDatabase function with data for every card
let createTaskCard = (correct_answer, article_url, url, fl, qc) => {


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
  butt_link.innerText = qc;
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
  WStotal +=1

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
      WScorrect +=1;
      writeProgressData();

    } else {
      console.log("yaanlisss");
      $(this).siblings(".wrong-img").show();
      WSwrong +=1;
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

  console.log(cardContainer)
  cardContainer.appendChild(card_flip);

  for (let i = 0; i < dataFinal.length; i++) {
    if (dataFinal[i][0] + ".jpg" == fl) {
      console.log("cevaplanmis soru:" + fl);
      correct_answer_GLOBAL = dataFinal[i][1]["user_answer"];

      if (dataFinal[i][1]["correct_answer"] == correct_answer_GLOBAL) {
        console.log("dogru");
        WScorrect +=1;
        console.log(WScorrect);
        $("#check_answer" + (count - 1).toString())
          .siblings(".correct-img")
          .show();
      } else {
        console.log("yaanlisss");
        WSwrong +=1;
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
    Cper = (WScorrect/WStotal)*100
  }
  else {
    Cper = 0
  }

  if (WSwrong !== 0) {
    Wper = (WSwrong/WStotal)*100
  }
  else {
    Wper = 0
  }


$('#Pcorrect').attr('style','width: '+ Cper + '%');
$('#Pwrong').attr('style','width: '+ Wper + '%');

$("#Pcorrect").html(Math.round((WScorrect/WStotal)*100) + "%")
$("#Pwrong").html(Math.round((WSwrong/WStotal)*100) + "%")
}


let createWSCard = (WSname, WSdate, WScreator, key, QuestionCount) => {

  console.log(WScreator)
  let div_01 = document.createElement("div");
  div_01.className = "col-6 mb-3";
  
 
  let div_02 = document.createElement("div");
  div_02.className = "card ws p-3 mb-1";

  let div_03 = document.createElement("div");
  div_03.className = "d-flex justify-content-between";

  let div_04 = document.createElement("div");
  div_04.className = "d-flex flex-row align-items-center";

  let div_05 = document.createElement("div");
  div_05.className = "icon";

  let i_01 = document.createElement("img");
  i_01.className = "card-img-top rounded";
  
  i_01.src = "/img/user-circle-solid.svg" 
  i_01.style.height = '40px';
  i_01.style.width = '40px';

  let div_06 = document.createElement("div");
  //div_06.className = "badge";

  let div_006 = document.createElement("div");
  div_006.className = "mx-2 c-details";

  let h6_01 = document.createElement("h6");
  h6_01.className = "mb-0";
  h6_01.id = "WScreator";
  h6_01.innerHTML = WScreator;

  let span_01 = document.createElement("span");
  span_01.className = "text1 text-muted mb-2";
  span_01.id = "WSdate";
  span_01.innerHTML = WSdate;

  let div_07 = document.createElement("div");
  div_07.className = "mt-5";

  let h3_01 = document.createElement("h3");
  h3_01.className = "heading";
  h3_01.id = "WSname";
  h3_01.innerHTML = WSname

  let div_08 = document.createElement("div");
  div_08.className = "d-flex align-items-center";

  let div_09 = document.createElement("div");
  div_09.className = "progress";

  let div_10 = document.createElement("div");
  div_10.className = "progress-bar";

  var attr1 = document.createAttribute("role");
  attr1.value = "progressbar";

  var attr2 = document.createAttribute("style");
  attr2.value = "width: 50%";

  var attr3 = document.createAttribute("aria-valuenow");
  attr3.value = "10";

  var attr4 = document.createAttribute("aria-valuemin");
  attr4.value = "0";

  var attr5 = document.createAttribute("aria-valuemax");
  attr5.value = "100";

  div_10.setAttributeNode(attr1);
  div_10.setAttributeNode(attr2);
  div_10.setAttributeNode(attr3);
  div_10.setAttributeNode(attr4);
  div_10.setAttributeNode(attr5);

  let div_11 = document.createElement("div");
  div_11.className = "mr-auto mt-2";

  let div_12 = document.createElement("div");
  let a_add = document.createElement("a");
  a_add.className = 'bx bxs-add-to-queue';
  a_add.innerHTML = "Add to my library"


  let span_02 = document.createElement("span");
  span_02.className = "text1 text-muted pull-right";
  span_02.innerHTML = QuestionCount + " questions"

  let span_03 = document.createElement("span");
  span_03.className = "text2";
  span_03.innerHTML = ""

  let button_get = document.createElement("a");
  button_get.setAttribute("role", "button");
  button_get.setAttribute("class", "stretched-link");
  button_get.setAttribute("id", "data-ref");

  var attr_data = document.createAttribute("data-ref");
  attr_data.value = key;
  button_get.setAttributeNode(attr_data);

  into = document.querySelector('#into')

  into.appendChild(div_01);
  div_01.appendChild(div_02);
  
  div_02.appendChild(div_03);
  div_03.appendChild(div_04)
  
  div_04.appendChild(div_05)
  div_05.appendChild(i_01)
  div_11.appendChild(span_02)
  
  div_04.appendChild(button_get);
  
  div_02.appendChild(div_07);
  
  
  div_03.appendChild(div_06)
  div_006.appendChild(h6_01)
  div_04.appendChild(div_006)
  
  div_07.appendChild(h3_01);
  div_07.appendChild(div_08);

  div_12.appendChild(a_add);

  div_08.appendChild(div_11);
  div_08.appendChild(div_12);
  div_06.appendChild(span_01);
  span_02.appendChild(span_03);

  button_get.onclick = function () {

    WStotal = 0
    WScorrect = 0
    WSwrong = 0

    writeProgressData()

    console.log($(this).parent(".card").attr("data-ref"))
    $("#card-cont").empty();
    $("#study_label").html(WSname + ' by ' + WScreator)  
    
    var db_WS = firebase.database().ref("worksheets/" + $(this).attr("data-ref")).orderByKey();
    reset_cursor_params(db_WS);
    const cursor_ws = new Cursor(db_WS, 25);
    initListOfTasks(3, cursor_ws);

    $("html, body").animate(
      {scrollTop: $("#question-pane").offset().top - 20,},500
    );

  };


};

function getWSdata() {

  var data = "";
  let WSuserid = "";
  var dbref = firebase.database().ref("/worksheets").limitToLast(6);

  dbref.once("value").then((snap) => {
      // store data in array so it's ordered
      console.log("erdem1")
      snap.forEach((ss) => {
        console.log("erdem2")
          WSuserid = findWScreator(ss.key)
          var db = firebase.database().ref("/users" + "/" + WSuserid).limitToFirst(1);
          console.log(WSuserid)

          db.once("value").then((snap) => {
              snap.forEach((tt) => {
                  console.log(tt.val())
                  console.log(tt.key)
                  data = tt.val()    
                  createWSCard(findWSname(ss.key), timeSince(findWSdate(ss.key)), data, ss.key, findWSquestioncount(ss.key)) 
              });
          });
          
      });
  });
}

getWSdata();


