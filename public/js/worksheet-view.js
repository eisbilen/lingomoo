var dataObject = [];
var dataObject2 = [];
var dataFinal = [];

var url_list = [];
var img_list = [];

var ws_question_list = [];
let cardContainer;
var filename_answer = " ";
var count = 0;
userAnswerGLOBAL = 0;

var tag1 = ""
var tag2 = ""

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//var dbref= firebase.database().ref('users/' + uid + '/worksheet/').orderByKey()
//const cursor = new Cursor(dbref, 9);

let createTaskCard = (correct_answer, article_url, url, fl) => {
  let card_flip = document.createElement("div");
  card_flip.className = "card";

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

  let butt_link = document.createElement("a");
  butt_link.innerText = "";
  butt_link.className = "url btn btn-warning btn-sm bx bxs-eraser";
  butt_link.id = "article_url" + count.toString();

  var attr1 = document.createAttribute("data-toggle");
  attr1.value = "tooltip";

  var attr2 = document.createAttribute("data-placement");
  attr2.value = "top";

  var attr3 = document.createAttribute("title");
  attr3.value = "Remove This Question From Your Worksheet";

  var attr4 = document.createAttribute("worksheet-url");
  attr4.value = url;

  butt_link.setAttributeNode(attr1);
  butt_link.setAttributeNode(attr2);
  butt_link.setAttributeNode(attr3);
  butt_link.setAttributeNode(attr4);

  butt_link.onclick = function () {
    let qc = Number($("#ws-question-count").text());
    if (qc <= 1) {
      $("#min-alert")
        .fadeTo(2000, 50)
        .slideUp(50, function () {
          $("#min-alert").slideUp(50);
        });
      console.log("min 1 soru olmali");
    } else {
      removeQuestionFromWS(
        $(this).parentsUntil($("div.card-columns")),
        url,
        fl,
        correct_answer,
        parseInt($("#ws-question-count").html(), 10)
      );

      $(this).tooltip("hide");
      //$(this).parentsUntil( $( "div.card-columns" )).remove();
    }
  };

  $("#article_url" + (count - 1).toString()).tooltip("enable");

  count = count + 1;

  card_flip.appendChild(card_front);
  card_front.appendChild(cardImage_front);

  card_front.appendChild(butt_link);
  card_front.appendChild(correct_img);
  card_front.appendChild(wrong_img);
  cardContainer.appendChild(card_flip);
};

$(document).ready(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("user already signed in");
      console.log(user);
      uid = user.uid;
      console.log(uid);
      getUserfromDatabase(
        user.uid,
        user.displayName,
        user.email,
        user.photoURL
      );

      var dbref = firebase
        .database()
        .ref("users/" + uid + "/worksheet")
        .orderByKey();
      console.log(uid);
      const cursor = new Cursor(dbref, 24);

      initListOfTasks(0);
      getQuestionData(cursor);
    } else {
      console.log("user signed out");
    }
  });

  $(document).on("keydown", "form", function(event) { 
    return event.key != "Enter";
});


  $(".dropdown-menu a").click(function () {
    console.log($(this).text());
    console.log($("#inlineRadio1").is(":checked"));

    if ($("#inlineRadio1").is(":checked")) {
      $("#input1TXT").val($(this).text());
    }

    if ($("#inlineRadio2").is(":checked")) {
      $("#input2TXT").val($(this).text());
    }

    if ($("#inlineRadio3").is(":checked")) {
      $("#input3TXT").val($(this).text());
    }
  });

  $('input[type=radio][name="inlineRadioOptions"]').change(function () {
    console.log($(this));

    $("#input1").addClass("d-none");
    $("#input2").addClass("d-none");
    $("#input3").addClass("d-none");

    if ($(this).val() == "Part of Speech") {
      $("#input1").removeClass("d-none");
    }

    if ($(this).val() == "Verb Tenses") {
      $("#input2").removeClass("d-none");
    }

    if ($(this).val() == "Vocabulary") {
      $("#input3").removeClass("d-none");
    }
  });
});

document.getElementById("WSSaveButton").onclick = async (e)=> {

//$("#WSSaveButton").click((e) = async () => {
  e.preventDefault();
  $("#invalidWS").addClass("d-none");
  $("#invalidTag").addClass("d-none");

  if ($("#WSname").val() == "") 
  {
    $("#invalidWS").removeClass("d-none");
    return
  }

  if ($("#inlineRadio1").is(":checked") && $("#input1TXT").val() == "" ) {
    $("#invalidTag").removeClass("d-none");
    return
  } else if ($("#inlineRadio1").is(":checked") && $("#input1TXT").val() !== "") {
    tag1 = "Part of Speech"
    tag2 = $("#input1TXT").val()
  }

  if ($("#inlineRadio2").is(":checked") && $("#input2TXT").val() == "" ) {
    $("#invalidTag").removeClass("d-none");
    return
  } else if ($("#inlineRadio2").is(":checked") && $("#input2TXT").val() !== "") {
    tag1 = "Verb Tenses"
    tag2 = $("#input2TXT").val()
  }

  if ($("#inlineRadio3").is(":checked") && $("#input3TXT").val() == "" ) {
    $("#invalidTag").removeClass("d-none");
    return
  }  else if ($("#inlineRadio3").is(":checked") && $("#input3TXT").val() !== "") {
    tag1 = "Vocabulary"
    tag2 = $("#input3TXT").val()
  }

  var today = new Date();
  let wsDateTime =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds() +
    "";

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
  await writeWS($("input[name=worksheetname]").val(), wsDateTime, tag1, tag2)
  
  await sleep(500);
   
  window.location.href = "http://www.lingomoo.com/study.html";
  await sleep(500);
  $('#staticBackdrop').modal('hide');
  await sleep(500);
 
};
