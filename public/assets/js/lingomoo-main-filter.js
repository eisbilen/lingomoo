// lingomoo-main-filter.js

const template = document.createElement("template");

template.innerHTML = ` 
<!-- Vendor CSS Files -->
<link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

<!-- Template Main CSS File -->
<link href="../assets/css/style.css" rel="stylesheet">
<!-- Vendor JS Files -->
<script src="../assets/vendor/jquery/jquery.min.js"></script>
<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../assets/vendor/jquery.easing/jquery.easing.min.js"></script>
<link href="../assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">

<div class="container mt-4">
<div class="row row-cols-1 row-cols-md-3">

  <div class="col p-3">
    <div class="card filter">
      <div class="card-body">
        <h5 class="card-title justify-content-center">Verbs</h5>
        <p id="verb-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"></i></p>
        <a id="filter1" href="#" class="stretched-link" role="button"></a>
      </div>
    </div>
  </div>

  <div class="col p-3">
    <div class="card filter">
      <div class="card-body">
        <h5 class="card-title justify-content-center">Nouns</h5>
        <p id="noun-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"></i></p>
        <a id="filter2" href="#" class="stretched-link" role="button"></a>
      </div>
    </div>
  </div>

  <div class="col p-3">
  <div class="card filter">
    <div class="card-body">
      <h5 class="card-title justify-content-center">Adjectives</h5>
      <p id="adjective-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"></i></p>
      <a id="filter3" href="#" class="stretched-link" role="button"></a>
    </div>
  </div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">Adverbs</h5>
    <p id="adverb-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"></i></p>
    <a id="filter4" href="#" class="stretched-link" role="button"></a>
  </div>
</div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">Prepositions</h5>
    <p id="preposition-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"</p>
    <a id="filter5" href="#" class="stretched-link" role="button"></a>
  </div>
</div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">Auxiliary Verbs</h5>
    <p id="aux-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"></p>
    <a id="filter6" href="#" class="stretched-link" role="button"></a>
  </div>
</div>
</div>

<div class="col p-3">
<div class="card filter">
  <div class="card-body">
    <h5 class="card-title justify-content-center">Determiners</h5>
    <p id="det-filter" class="card-text text-rigth align-middle lingoo-statistics font-weight-light"></p>
    <a id="filter7" href="#" class="stretched-link" role="button"></a>
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

      this.$("#filter7").onclick = function () {
        UIDisplayPagination.paginationTotalCountDBREF = "/questions_cat/DETERMINER"
        changeWSCreatePOS(UIDisplayPagination.paginationTotalCountDBREF)

        dbref = firebase.database().ref("/questions/DETERMINER").orderByKey();
        changeCreateListElements(dbref, "DETERMINER")
      };


    }
    connectedCallback() {
        $("#pre-list").innerHTML = '';
    }
  }
);
