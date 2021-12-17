// this object represent the worksheet cards for WEB UI
// set card(value) helps to define the values for card
// get card() returns HTML literal with values populated in
const UIDisplayWorkSheetCard = {
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
    this.HTMLContainerIDQuestionCardsTopLevel = value.HTMLContainerIDQuestionCardsTopLevel;
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
    cardContainerHTML = document.getElementById(this.HTMLContainerIDQuestionCardsTopLevel);
    cardContainerHTML.insertAdjacentHTML('beforeend', this.card);
  }
};

// this is implementation of the strategy pattern for worksheet cards
// it defines how to get and arrange data for worksheet cards
function WorksheetCardData() {
  this.getDataWithLimitToLast = function (databaseRef, limitToLastValue)  {
    return getFirebaseDataWithLimitToLast(databaseRef, limitToLastValue)
  }

  this.arrangeData = function (data) {
    arrangedData = []

    for (let key in data) {
      cardData = {}
      cardData['key'] = key;
      cardData['name'] = findWSname(key);
      cardData['dateCreated'] = timeSince(findWSdate(key));
      cardData['creator'] = findWScreator(key);
      cardData['questionCount'] = findWSquestioncount(key);
      cardData['HTMLContainerIDQuestionCardsTopLevel'] = 'into';
      cardData['tagPrimary'] = findWStag1(key);
      cardData['tagSecondary'] = findWStag2(key);
      arrangedData.push(cardData)
    }
    return arrangedData
  }
}

const studyPageUiData = new UIData();
const studyPageWorksheetCardData = new WorksheetCardData();

studyPageUiData.setStrategy(studyPageWorksheetCardData)
studyPageUiData.getDataWithLimitToLast("/worksheets",8).then(result => {
  const arrangedData = studyPageUiData.arrangeData(result)
  arrangedData.forEach(function (cardData, index) {
    UIDisplayWorkSheetCard.card = cardData;
    UIDisplayWorkSheetCard.insertCard();
  });
})
