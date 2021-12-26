///////////// UI DISPLAY ITEMS FOR STUDY-WORKSHEET.HTML /////////////
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
    HTMLButtonStyleUserAnswer: "",
    
    buttonAOptionFunc: function () {console.log($(this).parent().siblings(".user-answer"))
                                    $(this).parent().siblings(".user-answer").text('A')
                                    userAnswerGLOBAL = 0;},
    buttonBOptionFunc: function () {console.log("ButtonB");
                                    $(this).parent().siblings(".user-answer").text('B')
                                    userAnswerGLOBAL = 1;},
    buttonCOptionFunc: function () {console.log("ButtonC");
                                    $(this).parent().siblings(".user-answer").text('C')
                                    userAnswerGLOBAL = 2;}, 
    buttonDOptionFunc: function () {console.log("ButtonD");
                                    $(this).parent().siblings(".user-answer").text('D')
                                    userAnswerGLOBAL = 3;},
  
    buttonCheckAnswerFunc: function () {

                              userAnswerButtonElement =  $(this).siblings(".user-answer")

                              console.log(userAnswerButtonElement.innerText)
                              console.log(userAnswerButtonElement.innerHTML)
                              console.log(userAnswerButtonElement.text())
                              if (userAnswerButtonElement.text() == "?") {return}

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
                              userAnswerButtonElement.remove();
                              
                              if (userAnswerButtonElement.text() == abcdTo1234(correctAnswer) ) {
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
                  <a class="url btn btn-warning btn-sm bx bx-news" id="" data-toggle="tooltip" data-placement="top" title="" href="${this.questionArticleUrl}" target="_blank" data-original-title="Read the News Article"></a>
                  <img class="correct-img" style="${this.HTMLImageStyleTick}" src="assets/img/correct.png">
                  <img class="wrong-img" style="${this.HTMLImageStyleCross}" src="assets/img/wrong.png">
                  <button id="user-answer" style="${this.HTMLButtonStyleUserAnswer}" class="user-answer btn btn-secondary btn-sm" style="" disabled>?</button>

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
      this.HTMLButtonStyleUserAnswer = value.HTMLButtonStyleUserAnswer;
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
const UIDisplayQuestionWSCreationCard = {
  questionIndex: 0,
  questionCorrectAnswer: "",
  questionArticleUrl: "",
  questionImageUrl: "",
  questionFileName: "",
  HTMLContainerIDQuestionCardsTopLevel: "",
  HTMLImageClassQuestionCard: "",

  buttonAddQuestionToWorksheet: function () {
    let questionCount = Number($('#ws-question-count').text())
    let questionCorrectAnswer = $(this).attr("correct-answer")
    let questionArticleUrl = $(this).attr("article-url")
    let questionFileName = $(this).siblings(".card-img-top").attr("id")

    if (questionCount >= 24) {
      $("#max-alert").fadeTo(2000, 50).slideUp(50, function () {$("#max-alert").slideUp(50);});
    }
    else {
      addQuestionToWS(questionArticleUrl, questionFileName, questionCorrectAnswer, parseInt($('#ws-question-count').html(), 10))
    }
  },

  get card() {
    return `<div class="card">
              <div class="card-img-top">
                <img id="${this.questionFileName}" class="${this.HTMLImageClassQuestionCard}" src="${this.questionImageUrl}">
                <a class="url btn btn-warning btn-sm bx bx-book-add" id="add-question${this.questionIndex}" correct-answer="${this.questionCorrectAnswer}" article-url="${this.questionArticleUrl}" data-toggle="tooltip" data-placement="top" title="Add This Question Into Your Worksheet" target="_blank" data-original-title=""></a>
              </div>
            </div>`;
  },

  set card(value) {
    this.questionCorrectAnswer = value.questionCorrectAnswer;
    this.questionArticleUrl = value.questionArticleUrl;
    this.questionImageUrl = value.questionImageUrl;
    this.questionFileName = value.questionFileName;
    this.questionIndex = value.questionIndex;
    this.HTMLImageClassQuestionCard = value.HTMLImageClassQuestionCard;
    this.HTMLContainerIDQuestionCardsTopLevel = value.HTMLContainerIDQuestionCardsTopLevel;
  },

  insertCard() {
    cardContainerHTML = document.getElementById(this.HTMLContainerIDQuestionCardsTopLevel);
    cardContainerHTML.insertAdjacentHTML("beforeend", this.card);
    document.getElementById("add-question" + this.questionIndex.toString()).addEventListener('click', this.buttonAddQuestionToWorksheet);
  },

}

const UIDisplayQuestionWSSaveCard = {
  questionIndex: 0,
  questionCorrectAnswer: "",
  questionArticleUrl: "",
  questionImageUrl: "",
  questionFileName: "",
  HTMLContainerIDQuestionCardsTopLevel: "",
  HTMLImageClassQuestionCard: "",

  buttonRemoveQuestionFromWorksheet: function () {
    let questionCount = Number($('#ws-question-count').text())
    let questionCorrectAnswer = $(this).attr("correct-answer")
    let questionArticleUrl = $(this).attr("article-url")
    let questionFileName = $(this).siblings(".card-img-top").attr("id")

    if (questionCount <= 1) {$("#min-alert").fadeTo(2000, 50).slideUp(50, function () {$("#min-alert").slideUp(50);});
    } else {
      removeQuestionFromWS($(this).parentsUntil($("div.card-columns")), questionArticleUrl, questionFileName, questionCorrectAnswer, parseInt($("#ws-question-count").html(), 10));
    }
  },

  get card() {
    return `<div class="card">
              <div class="card-img-top">
                <img id="${this.questionFileName}" class="${this.HTMLImageClassQuestionCard}" src="${this.questionImageUrl}">
                <a class="url btn btn-warning btn-sm bx bxs-eraser" id="remove-question${this.questionIndex}" correct-answer="${this.questionCorrectAnswer}" article-url="${this.questionArticleUrl}" data-toggle="tooltip" data-placement="top" title="Remove This Question From Your Worksheet" target="_blank" data-original-title=""></a>
              </div>
            </div>`;
  },

  set card(value) {
    this.questionCorrectAnswer = value.questionCorrectAnswer;
    this.questionArticleUrl = value.questionArticleUrl;
    this.questionImageUrl = value.questionImageUrl;
    this.questionFileName = value.questionFileName;
    this.questionIndex = value.questionIndex;
    this.HTMLImageClassQuestionCard = value.HTMLImageClassQuestionCard;
    this.HTMLContainerIDQuestionCardsTopLevel = value.HTMLContainerIDQuestionCardsTopLevel;
  },

  insertCard() {
    cardContainerHTML = document.getElementById(this.HTMLContainerIDQuestionCardsTopLevel);
    cardContainerHTML.insertAdjacentHTML("beforeend", this.card);
    document.getElementById("remove-question" + this.questionIndex.toString()).addEventListener('click', this.buttonRemoveQuestionFromWorksheet);
  },

}

const UIDisplayPagination = {
    HTMLButtonClassPreviousButton: "btn btn-primary",
    HTMLButtonClassNextButton: "btn btn-primary",
    HTMLContainerIDPagination: "pagination",
    //HTMLContainerIDPaginationTitle: "pagination-title",
    paginationCursor: Cursor,
    paginationDatabaseRef: "",
    paginationPageSize: 1,
    paginationTotalCount: '',
    paginationPage: '',
  
    updatePaginationButtons: function () {

      console.log("First Index  : " + this.paginationCursor.firstIndex)
      console.log("Last Index   : " + this.paginationCursor.lastIndex)
      console.log("Page Index   : " + this.paginationCursor.firstIndex)
      console.log("Last Record  : " + this.paginationCursor.lastRecord)
      console.log("pagination size  : " + UIDisplayPagination.paginationPageSize)
      console.log("Total Data Length  : " + this.paginationTotalCount)

      this.paginationPage = parseInt(this.paginationCursor.lastIndex)/parseInt(UIDisplayPagination.paginationPageSize);

      if (this.paginationCursor.firstIndex == 1) {
        this.HTMLButtonClassPreviousButton = "btn btn-primary disabled";
      } else {
        this.HTMLButtonClassPreviousButton = "btn btn-primary";
      }
  
      if (this.paginationCursor.lastRecord == 1) {
        this.HTMLButtonClassNextButton = "btn btn-primary disabled";
      } else {
        this.HTMLButtonClassNextButton = "btn btn-primary";
      }
  
      if (this.paginationCursor.lastIndex == this.paginationTotalCount) {
        this.HTMLButtonClassNextButton = "btn btn-primary disabled";
      }

      if (this.paginationCursor.pageSize >= this.paginationTotalCount) {
        this.HTMLButtonClassNextButton = "btn btn-primary disabled";
      }
 
      document.getElementById(this.HTMLContainerIDPagination).innerHTML = this.pagination;
      document.getElementById("previous-button").addEventListener('click', this.previousButtonFunc);
      document.getElementById("next-button").addEventListener('click', this.nextButtonFunc);
    },

    nextButtonFunc: (event) => {
      event.preventDefault();
      cardUiData.getDataWithPagination(cursor,'next').then(result => {
        cardUiData.createCards(result)
        UIDisplayPagination.updatePaginationButtons();
      });
    },
  
    previousButtonFunc: (event) => {
      event.preventDefault();
      if (UIDisplayPagination.paginationCursor.firstIndex !== 1) {
        cardUiData.getDataWithPagination(cursor,'previous').then(result => {
          cardUiData.createCards(result)
          UIDisplayPagination.updatePaginationButtons();
        });
      }  
    },
  
    get pagination() {
      return `<div class="row">
                <div class="col-1 text-center">
                  <a id="previous-button" class="${this.HTMLButtonClassPreviousButton} btn-sm" href="#" role="button">Previous</a>
                </div>
                <div class="col-1 text-center">
                  <a id="next-button" class="${this.HTMLButtonClassNextButton} btn-sm" href="#" role="button">Next</a>
                </div>
                <div class="col-10 text-muted text-right">
                  <span>Page ${this.paginationPage},  ${this.paginationCursor.firstIndex}-${this.paginationCursor.lastIndex} of ${this.paginationTotalCount} worksheets</span>
                </div>  
              </div>`;
    },
  
    set pagination(value) {
      this.HTMLButtonClassPreviousButton = value.HTMLButtonClassPreviousButton;
      this.HTMLButtonClassNextButton = value.HTMLButtonClassNextButton;
      this.HTMLContainerIDPagination = value.HTMLContainerIDPagination;
      this.paginationCursor = value.paginationCursor;
      this.paginationDatabaseRef = value.paginationDatabaseRef;
      this.paginationPageSize = this.paginationCursor.pageSize;
      this.paginationPage = parseInt(this.paginationCursor.lastIndex)/parseInt(this.paginationPageSize)
    },
  
    insertPagination() {
      cardContainerHTML = document.getElementById(this.HTMLContainerIDPagination);
      cardContainerHTML.insertAdjacentHTML("beforeend", this.pagination); 
  
      document.getElementById("previous-button").addEventListener('click', this.previousButtonFunc);
      document.getElementById("next-button").addEventListener('click', this.nextButtonFunc);
    },
}
/////////////////////////////////////////////////////////////////////

///////////////////// UI DISPLAY ITEMS FOR STUDY.HTML ///////////////
// this object represent the worksheet cards for WEB UI
// set card(value) helps to define the values for card
// get card() returns HTML literal with values populated in
const UIDisplayWorkSheetCard = {
  key: "",
  name: "",
  dateCreated: "",
  creatorName: "",
  creatorPhotoURL: "assets/img/favicon.png",
  questionCount: "",
  container: "",
  tagPrimary: "",
  tagSecondary: "",
  url: "",
  HTMLContainerIDWorksheetCardsTopLevel: "",
  
  get card() {
    return `<div class="col-6 mb-3">
      <div class="card ws p-3 mb-1">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-row align-items-center">
            <div class="icon">
              <img class="card-img-top rounded" src="${this.creatorPhotoURL}" style="height: 40px; width: 40px;"></div>
            <a href="${this.url}" role="button" class="stretched-link" id="data-ref" data-ref="${this.key}"></a>
            <div class="mx-2 c-details"><h6 class="mb-0" id="WScreator">${this.creatorName}</h6></div>
          </div>
          <div>
            <span class="text1 text-muted mb-2" id="WSdate">${this.dateCreated}</span>
          </div>
        </div>
        <div class="mt-5">
          <h3 class="heading" id="WSname">${this.name}</h3>
          <div class="d-flex align-items-center">
            <div class="mr-auto mt-2">
              <span class="text2 text-muted pull-right">${this.questionCount} questions<span class="text2"></span></span>
            </div>
            <div>
              <a class="bx bx-purchase-tag-alt"> </a>
            </div>
            <span class="text2 text-muted pull-right"> ${this.tagPrimary} - ${this.tagSecondary}</span>
          </div>
        </div>
      </div>
    </div>`
  },

  set card(value) {
    this.HTMLContainerIDWorksheetCardsTopLevel = value.HTMLContainerIDWorksheetCardsTopLevel;
    this.key = value.key;
    this.name = value.name;
    this.dateCreated = value.dateCreated;
    this.creatorName = value.creatorName;
    this.creatorPhotoURL = value.creatorPhotoURL;
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
    cardContainerHTML = document.getElementById(this.HTMLContainerIDWorksheetCardsTopLevel);
    cardContainerHTML.insertAdjacentHTML('beforeend', this.card);
  }
};
/////////////////////////////////////////////////////////////////////