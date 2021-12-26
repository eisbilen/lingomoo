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

///////////////// Insert Question Cards ///////////
const cardUiData = new UIData();
const questionWSSaveCardData = new QuestionWSSaveCardData();
cardUiData.setStrategy(questionWSSaveCardData)
////////////////////////////////////////////////

$(document).ready(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      uid = user.uid;
      cardUiData.getData('users/' + uid + '/worksheet/', '').then(result => {cardUiData.createCards(result)});
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
  
  const count = $("#ws-question-count").text();

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
  await writeWS($("input[name=worksheetname]").val(), wsDateTime, tag1, tag2, count)
  
  await sleep(500);
   
  window.location.href = "http://www.lingomoo.com/study.html";
  await sleep(500);
  $('#staticBackdrop').modal('hide');
  await sleep(500);
 
};
