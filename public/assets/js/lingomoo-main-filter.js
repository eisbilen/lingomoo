// lingomoo-main-filter.js

const template = document.createElement("template");

function changeWSCreatePOS(ref) {
  dbref = firebase.database().ref(ref).orderByKey();
  cursor = new Cursor(dbref, 9); 
  reset_cursor_parameters(dbref, cursor) 
  UIDisplayPagination.paginationCursor = cursor;
  cardUiData.getDataWithPagination(cursor,'next').then(result => {cardUiData.createCards(result)});
  getTotalCount(ref, "").then((result) => {UIDisplayPagination.paginationTotalCount = Object.keys(result).length})
  UIDisplayPagination.insertPagination();
  UIDisplayPagination.updatePaginationButtons();
}

function changeCreateListElements(ref,POS) {
  $("#pre-list").html("");
  ref.once("value").then((snap) => {
    const keys = [];
    const data = [];
    // store data in array so it's ordered
    snap.forEach((ss) => {
      data.push(ss.val());
      keys.push(ss.key);
      createListElements(ss.key, POS) 
    });
  });
  $("html, body").animate({scrollTop: $("#browse-PoS").offset().top - 20,},500);
}

template.innerHTML = ` 

<!-- Vendor CSS Files -->
<link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

<!-- Template Main CSS File -->
<link href="../assets/css/style.css" rel="stylesheet">
<!-- Vendor JS Files -->
<script src="../assets/vendor/jquery/jquery.min.js"></script>
<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../assets/vendor/jquery.easing/jquery.easing.min.js"></script>

<div class="container mt-4">
<div class="row row-cols-1 row-cols-md-3">

  <div class="col p-3">
    <div class="card filter">
      <div class="card-body">
        <h5 class="card-title justify-content-center">VERBS</h5>
        <a id="filter1" href="#" class="stretched-link" role="button"></a>
      </div>
    </div>
  </div>

  <div class="col p-3">
    <div class="card filter">
      <div class="card-body">
        <h5 class="card-title justify-content-center">NOUNS</h5>
        <a id="filter2" href="#" class="stretched-link" role="button"></a>
      </div>
    </div>
  </div>

  <div class="col p-3">
  <div class="card filter">
    <div class="card-body">
      <h5 class="card-title justify-content-center">ADJECTIVES</h5>
      <a id="filter3" href="#" class="stretched-link" role="button"></a>
    </div>
  </div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">ADVERBS</h5>
    <a id="filter4" href="#" class="stretched-link" role="button"></a>
  </div>
</div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">PREPOSITIONS</h5>
    <a id="filter5" href="#" class="stretched-link" role="button"></a>
  </div>
</div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">AUXILIARY VERBS</h5>
    <a id="filter6" href="#" class="stretched-link" role="button"></a>
  </div>
</div>
</div>

</div>
</div>
`;

customElements.define(
  "lingomoo-main-filter",
  class SuperSpan extends HTMLElement {
    $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.appendChild(template.content.cloneNode(true));

      this.$("#filter1").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/VERB"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/VERB").orderByKey();
        changeCreateListElements(dbref, "VERB")
      };

      this.$("#filter2").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/NOUN"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/NOUN").orderByKey();
        changeCreateListElements(dbref, "NOUN")
      };

      this.$("#filter3").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/ADJECTIVE"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/ADJECTIVE").orderByKey();
        changeCreateListElements(dbref, "ADJECTIVE")
      };

      this.$("#filter4").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/ADVERB"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/ADVERB").orderByKey();
        changeCreateListElements(dbref, "ADVERB")
      };

      this.$("#filter5").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/PREPOSITION"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/PREPOSITION").orderByKey();
        changeCreateListElements(dbref, "PREPOSITION")
      };

      this.$("#filter6").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/AUX"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/AUX").orderByKey();
        changeCreateListElements(dbref, "AUX")
      };
    }
    connectedCallback() {
        $("#pre-list").innerHTML = '';
    }
  }
);
