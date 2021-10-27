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


<div class="container mt-4">
<h2>Browse by subject</h2>
<p></p>
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
      const filters = ["VERB", "NOUN"];
      const arrayLength = filters.length;

      root.appendChild(template.content.cloneNode(true));

      
      function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

      this.$("#filter1").onclick = function () {
        var db = firebase
          .database()
          .ref("/questions_cat/VERB/")
          .orderByKey();
        reset_cursor_params(db);
        console.log("button");
        $("#next-button").click();

        $("#pre-list").html("");
    
        removeAllChildNodes($("#pre-list"))

        var dbref = firebase.database().ref("/questions/VERB").orderByKey();
        dbref.once("value").then((snap) => {
            const keys = [];
            const data = [];
            // store data in array so it's ordered
            snap.forEach((ss) => {
              data.push(ss.val());
              keys.push(ss.key);
              createListElements(ss.key, 'VERB') 
            });
            console.log("data.length");
            console.log(data.length);
            console.log("keys");
            console.log(keys);
          });
      };

      this.$("#filter2").onclick = function () {
        var db = firebase
          .database()
          .ref("/questions_cat/NOUN/")
          .orderByKey();
        reset_cursor_params(db);
        console.log("button");
        $("#next-button").click();

        $("#pre-list").html("");
        var dbref = firebase.database().ref("/questions/NOUN").orderByKey();
        dbref.once("value").then((snap) => {
            const keys = [];
            const data = [];
            // store data in array so it's ordered
            snap.forEach((ss) => {
              data.push(ss.val());
              keys.push(ss.key);
              createListElements(ss.key, 'NOUN') 
            });
            console.log("data.length");
            console.log(data.length);
            console.log("keys");
            console.log(keys);
          });

      };

      this.$("#filter3").onclick = function () {
        var db = firebase
          .database()
          .ref("/questions_cat/ADJECTIVE/")
          .orderByKey();
        reset_cursor_params(db);
        console.log("button");
        $("#next-button").click();

        $("#pre-list").html("");
        var dbref = firebase.database().ref("/questions/ADJECTIVE").orderByKey();
        dbref.once("value").then((snap) => {
            const keys = [];
            const data = [];
            // store data in array so it's ordered
            snap.forEach((ss) => {
              data.push(ss.val());
              keys.push(ss.key);
              createListElements(ss.key, 'ADJECTIVE') 
            });
            console.log("data.length");
            console.log(data.length);
            console.log("keys");
            console.log(keys);
          });

      };

      this.$("#filter4").onclick = function () {
        var db = firebase
          .database()
          .ref("/questions_cat/ADVERB/")
          .orderByKey();
        reset_cursor_params(db);
        console.log("button");
        $("#next-button").click();

        $("#pre-list").html("");
        var dbref = firebase.database().ref("/questions/ADVERB").orderByKey();
        dbref.once("value").then((snap) => {
            const keys = [];
            const data = [];
            // store data in array so it's ordered
            snap.forEach((ss) => {
              data.push(ss.val());
              keys.push(ss.key);
              createListElements(ss.key, 'ADVERB') 
            });
            console.log("data.length");
            console.log(data.length);
            console.log("keys");
            console.log(keys);
          });
      };

      this.$("#filter5").onclick = function () {
        var db = firebase
          .database()
          .ref("/questions_cat/PREPOSITION/")
          .orderByKey();
        reset_cursor_params(db);
        console.log("button");
        $("#next-button").click();

        $("#pre-list").html("");
        var dbref = firebase.database().ref("/questions/PREPOSITION").orderByKey();
        dbref.once("value").then((snap) => {
            const keys = [];
            const data = [];
            // store data in array so it's ordered
            snap.forEach((ss) => {
              data.push(ss.val());
              keys.push(ss.key);
              createListElements(ss.key, 'PREPOSITION') 
            });
            console.log("data.length");
            console.log(data.length);
            console.log("keys");
            console.log(keys);
          });
      };

      this.$("#filter6").onclick = function () {
        var db = firebase
          .database()
          .ref("/questions_cat/AUX/")
          .orderByKey();
        reset_cursor_params(db);
        console.log("button");
        $("#next-button").click();

        $("#pre-list").html("");
        var dbref = firebase.database().ref("/questions/AUX").orderByKey();
        dbref.once("value").then((snap) => {
            const keys = [];
            const data = [];
            // store data in array so it's ordered
            snap.forEach((ss) => {
              data.push(ss.val());
              keys.push(ss.key);
              createListElements(ss.key, 'AUX') 
            });
            console.log("data.length");
            console.log(data.length);
            console.log("keys");
            console.log(keys);
          });

      };

    }
    connectedCallback() {
        $("#pre-list").innerHTML = '';
    }
  }
);
