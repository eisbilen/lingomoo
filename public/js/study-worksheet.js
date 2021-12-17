///////////// Define Global Const ///////////////
let userAnswerGLOBAL = 0;
let totalQuestionCount = 0;
let countCorrectAnswer = 0;
let countWrongAnswer = 0;
let cardData = {}
//////////////////////////////////////////////////

///////////// Get the URL Parameters /////////////
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const fields = params["worksheetName"].split("&");
const key = fields["0"];
const WSname = fields["1"].split("=")[1];
const tag1 = fields["2"].split("=")[1];
const tag2 = fields["3"].split("=")[1];

const dbref = firebase.database().ref("/worksheets/" + key).orderByKey();
const cursor = new Cursor(dbref, 6);

//////////////////////////////////////////////////

///////////// UI DISPLAY ITEMS /////////////
const UIDisplayWorksheetTitle = {
  worksheetName: "",
  countAnsweredQuestion: 0,
  totalQuestionCount: 0,
  worksheetTag1: "",
  worksheetTag2: "",
  HTMLContainerIDWorksheetTitle: 'worksheet-title',
  
  updateWorksheetTitle: function () {
    document.getElementById(this.HTMLContainerIDWorksheetTitle).innerHTML = this.worksheetTitle;
  },

  get worksheetTitle() {
    return `<div class="container d-flex align-items-center mt-5">
              <h3 id="study_label" class="mr-auto text-left lingoo-statistics font-weight-light"><i class="bx bx-id-card"></i> ${this.worksheetName}</h3>
              <h4 id="progress_label" class="mr-auto  text-center align-middle lingoo-statistics font-weight-light"><i class="bx bx-trending-up"></i> ${this.countAnsweredQuestion} of ${this.totalQuestionCount} is completed</h4>
              <h3 id="tags_label" class="text-rigth align-middle lingoo-statistics font-weight-light"><i class="bx bx-purchase-tag-alt"></i> ${this.worksheetTag1} - ${this.worksheetTag2}</h3>
            </div>`;
  },

  set worksheetTitle(value) {
    this.worksheetName = value.worksheetName
    this.countAnsweredQuestion = value.countAnsweredQuestion;
    this.totalQuestionCount = value.totalQuestionCount;
    this.worksheetTag1 = value.worksheetTag1;
    this.worksheetTag2 = value.worksheetTag2;
    this.HTMLContainerIDWorksheetTitle = value.HTMLContainerIDWorksheetTitle;
  },

  insertWorksheetTitle() {
    cardContainerHTML = document.getElementById(this.HTMLContainerIDWorksheetTitle);
    cardContainerHTML.insertAdjacentHTML("beforeend", this.worksheetTitle);
  },
}
const UIDisplayProgressBar = {
  percentageCorrectAnswer: 0,
  percentageWrongAnswer: 0,
  countCorrectAnswer: 0,
  countWrongAnswer: 0,
  totalQuestionCount: 0,
  HTMLContainerIDProgressbar: 'progress-bar',
  
  updateProgressBar: function () {
    document.getElementById(this.HTMLContainerIDProgressbar).innerHTML = this.progressBar;
  },

  get progressBar() {
    return `<div>
              <div class="progress mb-5" style="max-width: 100%">
                <div id="correct-answer" class="progress-bar bg-success progress-bar-stripped" style="width: ${this.percentageCorrectAnswer}%">${this.percentageCorrectAnswer}% (${this.countCorrectAnswer})</div>
                <div id="wrong-answer" class="progress-bar bg-danger progress-bar-stripped" style="width: ${this.percentageWrongAnswer}%">${this.percentageWrongAnswer}% (${this.countWrongAnswer})</div>
              </div>
            </div>`;
  },

  set progressBar(value) {
    this.percentageCorrectAnswer = value.percentageCorrectAnswer;
    this.percentageWrongAnswer = value.percentageWrongAnswer;
    this.countCorrectAnswer = value.countCorrectAnswer;
    this.countWrongAnswer = value.countWrongAnswer;
    this.totalQuestionCount = value.totalQuestionCount;
    this.HTMLContainerIDProgressbar = value.HTMLContainerIDProgressbar;
  },

  insertProgressBar() {
    cardContainerHTML = document.getElementById(this.HTMLContainerIDProgressbar);
    cardContainerHTML.insertAdjacentHTML("beforeend", this.progressBar);
  },
}
const UIDisplayQuestionCard = {
  questionIndex: 0,
  questionCorrectAnswer: "",
  questionUserAnswer: "",
  questionArticleUrl: "",
  questionImageUrl: "",
  questionFileName: "",
  HTMLContainerIDQuestionCardsTopLevel: "",
  HTMLImageClassQuestionCard: "",
  HTMLImageStyleTick: "",
  HTMLImageStyleCross: "",
  HTMLButtonGroupStyleQuestionOptions: "",
  HTMLButtonStyleCheckQuestionAnswer: "",
  
  buttonAOptionFunc: () => {console.log("ButtonA");
                            userAnswerGLOBAL = 0;},
  buttonBOptionFunc: () => {console.log("ButtonB");
                            userAnswerGLOBAL = 1;},
  buttonCOptionFunc: () => {console.log("ButtonC");
                            userAnswerGLOBAL = 2;}, 
  buttonDOptionFunc: () => {console.log("ButtonD");
                            userAnswerGLOBAL = 3;},

  buttonCheckAnswerFunc: function () {
                            correctAnswer = $(this).attr("correct-answer")
                            questionFileName = $(this).siblings(".card-img-top").attr("id")
                            questionCardElement = $(this).siblings(".card-img-top")
                            optionButtonGroupElement = $(this).siblings(".btn-group")
                            correctImageElement = $(this).siblings(".correct-img")
                            wrongImageElement = $(this).siblings(".wrong-img")
                            checkButtonElement = $(this)
                            checkButtonElement.tooltip("hide");
                            checkButtonElement.remove();
                            optionButtonGroupElement.remove();

                            if (userAnswerGLOBAL == correctAnswer) {
                              correctImageElement.show();
                              countCorrectAnswer += 1;
                            } 
                            else {
                              wrongImageElement.show();
                              countWrongAnswer += 1;
                            }

                            addUserQuestionAnswered(
                              questionFileName,
                              correctAnswer,
                              userAnswerGLOBAL);

                            setAnswerImageToQuestion(
                              questionFileName,
                              questionCardElement);

                            updateTitleAndProcessBar();
                          },

  get card() {
    return `<div class="card">
              <div class="card-img-top">
                <div class="btn btn-group" style="${this.HTMLButtonGroupStyleQuestionOptions}">
                  <button id="button-A${this.questionIndex}" type="button" class="btn btn-primary btn-sm">A</button>
                  <button id="button-B${this.questionIndex}" type="button" class="btn btn-primary btn-sm">B</button>
                  <button id="button-C${this.questionIndex}" type="button" class="btn btn-primary btn-sm">C</button>
                  <button id="button-D${this.questionIndex}" type="button" class="btn btn-primary btn-sm">D</button>
                </div>
                <img id="${this.questionFileName}" class="${this.HTMLImageClassQuestionCard}" src="${this.questionImageUrl}">
                <a id="check-answer${this.questionIndex}" style="${this.HTMLButtonStyleCheckQuestionAnswer}" class="btn btn-warning btn-sm bx bx-right-arrow-circle" data-toggle="tooltip" data-placement="top" title="" correct-answer="${this.questionCorrectAnswer}" data-original-title="Check the Answer"></a>
                <a class="url btn btn-warning btn-sm bx bx-news" id="" data-toggle="tooltip" data-placement="top" title="" href="${this.questionFileName}" target="_blank" data-original-title="Read the News Article"></a>
                <img class="correct-img" style="${this.HTMLImageStyleTick}" src="assets/img/correct.png">
                <img class="wrong-img" style="${this.HTMLImageStyleCross}" src="assets/img/wrong.png">
              </div>
            </div>`;
  },

  set card(value) {
    this.questionCorrectAnswer = value.questionCorrectAnswer;
    this.questionArticleUrl = value.questionArticleUrl;
    this.questionImageUrl = value.questionImageUrl;
    this.questionFileName = value.questionFileName;
    this.questionIndex = value.questionIndex;
    this.HTMLImageStyleTick = value.HTMLImageStyleTick;
    this.HTMLImageStyleCross = value.HTMLImageStyleCross;
    this.HTMLButtonGroupStyleQuestionOptions = value.HTMLButtonGroupStyleQuestionOptions;
    this.HTMLButtonStyleCheckQuestionAnswer = value.HTMLButtonStyleCheckQuestionAnswer;
    this.HTMLImageClassQuestionCard = value.HTMLImageClassQuestionCard;
    this.HTMLContainerIDQuestionCardsTopLevel = value.HTMLContainerIDQuestionCardsTopLevel;
  },

  insertCard() {
    cardContainerHTML = document.getElementById(this.HTMLContainerIDQuestionCardsTopLevel);
    cardContainerHTML.insertAdjacentHTML("beforeend", this.card);

    document.getElementById("button-A" + this.questionIndex.toString()).addEventListener('click', this.buttonAOptionFunc);
    document.getElementById("button-B" + this.questionIndex.toString()).addEventListener('click', this.buttonBOptionFunc);
    document.getElementById("button-C" + this.questionIndex.toString()).addEventListener('click', this.buttonCOptionFunc);
    document.getElementById("button-D" + this.questionIndex.toString()).addEventListener('click', this.buttonDOptionFunc);
    document.getElementById("check-answer" + this.questionIndex.toString()).addEventListener('click', this.buttonCheckAnswerFunc);
  },

}
const UIDisplayPagination = {
  HTMLButtonClassPreviousButton: "btn btn-primary",
  HTMLButtonClassNextButton: "btn btn-primary",
  HTMLContainerIDPagination: "pagination",
  paginationCursor: Cursor,
  paginationDatabaseRef: "",
  paginationPageSize: 30,
  paginationTotalCount: 0,

  updatePaginationButtons: function () {

    console.log("First Index  : " + this.paginationCursor.firstIndex)
    console.log("Last Index   : " + this.paginationCursor.lastIndex)
    console.log("Page Index   : " + this.paginationCursor.firstIndex)
    console.log("Last Record  : " + this.paginationCursor.lastRecord)
    console.log("Total Data Length  : " + this.paginationTotalCount)

    if (this.paginationCursor.firstIndex == 1) {
      $("#previous-button").addClass("disabled");
    } else {
      $("#previous-button").removeClass("disabled");
    }

    if (this.paginationCursor.lastRecord == 1) {
      $("#next-button").addClass("disabled");
    } else {
      $("#next-button").removeClass("disabled");
    }

    if (this.paginationCursor.lastIndex == this.paginationTotalCount) {
      $("#next-button").addClass("disabled");
    }

  },
  //paginationMove: function (move) {studyViewPageUiData.getDataWithPagination(cursor,move).then(result => {studyViewPageUiData.createQuestionCards(result)});},
  nextButtonFunc: (event) => {
    event.preventDefault();
    studyViewPageUiData.getDataWithPagination(cursor,'next').then(result => {
      studyViewPageUiData.createQuestionCards(result)
      UIDisplayPagination.updatePaginationButtons();
    });
  },

  previousButtonFunc: (event) => {
    event.preventDefault();
    if (UIDisplayPagination.paginationCursor.firstIndex !== 1) {
      studyViewPageUiData.getDataWithPagination(cursor,'previous').then(result => {
        studyViewPageUiData.createQuestionCards(result)
        UIDisplayPagination.updatePaginationButtons();
      });
    }  
  },

  get pagination() {
    return `<div class="row">
              <div class="col-6 text-center">
                <a id="previous-button" class="${this.HTMLButtonClassPreviousButton}" href="#" role="button">Previous</a>
              </div>
              <div class="col-6 text-center">
                <a id="next-button" class="${this.HTMLButtonClassNextButton}" href="#" role="button">Next</a>
              </div>
            </div>`;
  },

  set pagination(value) {
    this.HTMLButtonClassPreviousButton = value.HTMLButtonClassPreviousButton;
    this.HTMLButtonClassNextButton = value.HTMLButtonClassNextButton;
    this.HTMLContainerIDPagination = value.HTMLContainerIDPagination;
    this.paginationCursor = value.paginationCursor;
    this.paginationDatabaseRef = value.paginationDatabaseRef;
    this.paginationPageSize = value.paginationPageSize;
  },

  insertPagination() {
    cardContainerHTML = document.getElementById(this.HTMLContainerIDPagination);
    cardContainerHTML.insertAdjacentHTML("beforeend", this.pagination); 

    document.getElementById("previous-button").addEventListener('click', this.previousButtonFunc);
    document.getElementById("next-button").addEventListener('click', this.nextButtonFunc);
  },
}
//////////////////////////////////////////////////

/////////////////// DATA ITEMS ///////////////////
// this object represent the QUESTION cards for WEB UI
function QuestionCardData() {
  
  this.paginationCursor = function () {}

  this.getQuestionCount = async function (databaseRef, key) {
    return await getQuestionCount(databaseRef, key)
  }

  this.getData = function (databaseRef, key)  {
    return getFirebaseData(databaseRef, key)
  }
  
  this.getDataWithPagination = function (cursor, button)  {
    return getFirebaseDataWithPagination(cursor, button)
  }
  
  this.arrangeData = async function (data) {
    const arrangedData = []
    let questionIndex = 0

    for (let key in data) {
      const cardData = {}
      cardData['questionIndex'] = questionIndex
      cardData['questionCorrectAnswer'] = data[key]['correct_answer']
      cardData['questionUserAnswer'] = ""
      cardData['questionArticleUrl'] = data[key]['article_url']
      cardData['questionFileName'] = data[key]['file_name']
      cardData['HTMLContainerIDQuestionCardsTopLevel'] = "question-cards"
      cardData['HTMLImageStyleCross'] = ""
      cardData['HTMLImageStyleTick'] = ""
      cardData['HTMLButtonGroupStyleQuestionOptions'] = ""
      cardData['HTMLButtonStyleCheckQuestionAnswer'] = ""
      cardData['HTMLImageClassQuestionCard'] = "card-img-top"
      arrangedData.push(cardData)
      questionIndex += 1
    }
    totalQuestionCount = questionIndex;
    return arrangedData
  }
  
  this.createQuestionCards = async function (result) {
    const storage = firebase.storage();
    const user = firebase.auth().currentUser
    const arrangedData = this.arrangeData(result)
    document.getElementById('question-cards').innerHTML = "";
    arrangedData.then((result) => {result.forEach(async function (cardData, index) {
      const userAnswer = await getAnsweredQuestionData(cardData['questionFileName'], user.uid)
      
      if (userAnswer) {
        const imageDisplay = await setHTMLStyleForTickCross(userAnswer)
        cardData['HTMLImageStyleTick'] = imageDisplay[0]
        cardData['HTMLImageStyleCross'] = imageDisplay[1]

        const gsReferenceAnswerImage = storage.refFromURL("gs://lingomoo.appspot.com/images/" + cardData['questionFileName'].replace("question", "answer") + '.jpg');
        cardData['questionImageUrl'] = await gsReferenceAnswerImage.getDownloadURL()
        cardData['HTMLImageClassQuestionCard'] = "card-img answered"
        cardData['HTMLButtonGroupStyleQuestionOptions'] = "display:none;"
        cardData['HTMLButtonStyleCheckQuestionAnswer'] = "display:none;"
      } 
      else {
        const gsReferenceQuestionImage = storage.refFromURL("gs://lingomoo.appspot.com/images/" + cardData['questionFileName']+'.jpg');
        cardData['questionImageUrl'] = await gsReferenceQuestionImage.getDownloadURL();
      }

      UIDisplayQuestionCard.card = cardData;
      UIDisplayQuestionCard.insertCard();
      updateTitleAndProcessBar();
      })
    })
  }
}

// this object represent the PROGRESS BAR for WEB UI
function ProgressBarData() {

  this.getProgressBarData = function ()  {
    return {percentageCorrectAnswer: Math.round((countCorrectAnswer/totalQuestionCount) * 100),
            percentageWrongAnswer:  Math.round((countWrongAnswer/totalQuestionCount) * 100),
            countCorrectAnswer : countCorrectAnswer,
            countWrongAnswer: countWrongAnswer,
            totalQuestionCount: totalQuestionCount,
            HTMLContainerIDProgressbar: 'progress-bar'
    }
  }
}
// this object represent the WORKSHET TITLE for WEB UI
function WorksheetTitleData() {

  this.getWorksheetTitleData = function ()  {
    return {
            worksheetName: WSname,
            worksheetTag1: tag1,
            worksheetTag2: tag2,
            countAnsweredQuestion: UIDisplayProgressBar.countWrongAnswer + UIDisplayProgressBar.countCorrectAnswer,
            totalQuestionCount: UIDisplayProgressBar.totalQuestionCount,
            HTMLContainerIDWorksheetTitle: 'worksheet-title'
    }
  }
}

function PaginationData() {

  this.getPaginationData = function ()  {
    return {
            HTMLButtonClassPreviousButton: HTMLButtonClassPreviousButton,
            HTMLButtonClassNextButton: HTMLButtonClassNextButton,
            HTMLContainerIDPagination: HTMLContainerIDPagination,
            paginationCursor: paginationCursor,
            paginationDatabaseRef: paginationDatabaseRef,
            paginationPageSize: paginationPageSize 
    }
  }
}

///////////// Insert Worksheet Title /////////////
const studyViewPageWTData = new UIData();
const studyViewPageWorksheetTitleData = new WorksheetTitleData();
 
studyViewPageWTData.setStrategy(studyViewPageWorksheetTitleData)
UIDisplayWorksheetTitle.worksheetTitle = studyViewPageWTData.getWorksheetTitleData();
UIDisplayWorksheetTitle.insertWorksheetTitle();
//////////////////////////////////////////////////

///////////////// Insert Progress Bar ///////////
const studyViewPagePBData = new UIData();
const studyViewPageProgressBarData = new ProgressBarData();

studyViewPagePBData.setStrategy(studyViewPageProgressBarData)
UIDisplayProgressBar.progressBar = {percentageCorrectAnswer: 0,
    percentageWrongAnswer: 0,
    countCorrectAnswer : 0,
    countWrongAnswer: 0,
    totalQuestionCount: 0,
    HTMLContainerIDProgressbar: 'progress-bar'
}
UIDisplayProgressBar.insertProgressBar();
////////////////////////////////////////////////

increaseWorksheetViewCount(key);
//cardContainer = document.getElementById("card-cont");

///////////////// Insert Question Cards ///////////
const studyViewPageUiData = new UIData();
const studyViewPageQuestionCardData = new QuestionCardData();
studyViewPageUiData.setStrategy(studyViewPageQuestionCardData)
//studyViewPageUiData.getDataWithPagination(cursor,'next').then(result => {studyViewPageUiData.createQuestionCards(result)});
studyViewPageUiData.getData("/worksheets/", key).then(result => {studyViewPageUiData.createQuestionCards(result)});

////////////////////////////////////////////////

///////////////// Insert Pagination ///////////
const studyViewPagePData = new UIData();
const studyViewPagePaginationData = new PaginationData();
studyViewPagePData.setStrategy(studyViewPagePaginationData)
UIDisplayPagination.pagination = {  HTMLButtonClassPreviousButton: "btn btn-primary",
                                    HTMLButtonClassNextButton: "btn btn-primary",
                                    HTMLContainerIDPagination: "pagination",
                                    paginationCursor: cursor,
                                    paginationDatabaseRef: dbref,
                                    paginationPageSize: 30,
                                    paginationTotalCount: 0,
                                  }
getQuestionCount("/worksheets/", key).then((result) => {UIDisplayPagination.paginationTotalCount = Object.keys(result).length})
UIDisplayPagination.insertPagination();
UIDisplayPagination.updatePaginationButtons();


//displayWorksheetProgress();

      //let intToletter = "";
      //if (result["user_answer"] == 0) {
      //  intToletter = "A";
     // }
     // if (result["user_answer"] == 1) {
     //   intToletter = "B";
     // }
     // if (result["user_answer"] == 2) {
     //   intToletter = "C";
     // }
     // if (result["user_answer"] == 3) {
      //  intToletter = "D";
     // }

      //let data_info = document.createElement("div");
      //data_info.className = "date-on-card";
      //data_info.innerHTML =
      //  "Your Answer - " +
      //  intToletter +
      //  "<br>" +
      //  "Studied at " +
      //  dataFinal[i][1]["date"];
      //card_front.appendChild(data_info);


