// lingomoo-worksheets.js

const template = document.createElement("template");
const tempCard = document.createElement("template");
var data = "";

tempCard.innerHTML = `
<div class="col">
<div class="card p-3 mb-2">
    <div class="d-flex justify-content-between">
        <div class="d-flex flex-row align-items-center">
            <div class="icon"> <i class="bx bxl-mailchimp"></i> </div>
            <div class="m-2 c-details">
                <h6 id='WScreator' class="mb-0">Mailchimp</h6> <span id="WSdate">1 days ago</span>
            </div>
        </div>
        <div class="badge"> <span>Design</span> </div>
        <button id="WSGetData" type="button" class="btn btn-success">Study</button>

    </div>
    <div class="mt-5">
        <h3 id="WSname" class="heading">Senior Product<br>Designer-Singapore</h3>
        <div class="mt-5">
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="mt-3"> <span class="text1">32 Applied <span class="text2">of 50 capacity</span></span> </div>
        </div>
    </div>
</div>
</div>
`;

template.innerHTML = ` 

<!-- Vendor CSS Files -->
<link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<!-- Template Main CSS File -->
<link href="../assets/css/style.css" rel="stylesheet">
<!-- Vendor JS Files -->
<script src="../assets/vendor/jquery/jquery.min.js"></script>
<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../assets/vendor/jquery.easing/jquery.easing.min.js"></script>
<button id="WSGetData" type="button" class="btn btn-success">Study</button>

`;

customElements.define(
    "lingomoo-worksheets",
    class Worksheets extends HTMLElement {
        $(selector) {
            return this.shadowRoot && this.shadowRoot.querySelector(selector);
        }
        constructor() {
            super();
            const root = this.attachShadow({ mode: "open" });
            root.appendChild(template.content.cloneNode(true));

            this.$("#WSGetData").onclick = function () {
                console.log('erdem')
                var db_WS = firebase.database().ref("/questions_cat/ADVERB/").orderByKey();
                reset_cursor_params(db_WS);
                const cursor_ws = new Cursor(db_WS, 9);
                initListOfTasks(0);
                getQuestionData(cursor_ws)
            };   

  
                function beAwesome(e)
                

                {
                    console.log(e.target.$("#WSGetData"))

                    if(e.target && e.target.id== 'WSGetData'){
                        console.log('click'); // ok
                        console.log(data); // ok
                    }
                 }


                 function findWSname(text) {
                    var myRe = "__(.+?)___";
                    return text.match(myRe)[1];
                }
    
                function findWSdate(text) {
                    var myRe = "___(.+?)____";
                    return text.match(myRe)[1];
                }
    
                function findWScreator(text) {
                    var myRe = "(.+?)__";
                    return text.match(myRe)[1];
                }

            async function doall() {

                let WSuserid = "";
                var dbref = firebase.database().ref("/worksheets").limitToLast(5);

                dbref.once("value").then((snap) => {
                    // store data in array so it's ordered
                    snap.forEach((ss) => {

                        WSuserid = findWScreator(ss.key)
                        var db = firebase.database().ref("/users" + "/" + WSuserid).limitToFirst(1);

                        db.once("value").then((snap) => {
                            snap.forEach((tt) => {
                                console.log(tt.val())
                                console.log(tt.key)
                                tempCard.content.querySelector("#WSname").innerText = findWSname(ss.key);
                                tempCard.content.querySelector("#WSdate").innerText = timeSince(findWSdate(ss.key));
                                tempCard.content.querySelector("#WScreator").innerText = tt.val()
                                tempCard.content.querySelector("#WSGetData").innerText = tt.val()
                                data=ss.key
   

                                tempCard.content.querySelector("#WSGetData").addEventListener('click', beAwesome.bind(this));


                            //    tempCard.content.querySelector("#WSGetData").addEventListener('click', () => {
                            //        console.log('clicked');
                            //      });
                            //tempCard.content.querySelector("#WSGetData").onclick = function () {
                            //    console.log('erdem')
                            //    var db_WS = firebase.database().ref(ss.key).orderByKey();
                            //    reset_cursor_params(db_WS);
                            //    const cursor_ws = new Cursor(db_WS, 9);
                            //    initListOfTasks(0);
                            //    getQuestionData(cursor_ws)
                            //};


                            });

                            var clone = tempCard.content.cloneNode(true)
                            root.appendChild(clone)
                            console.log('erdem')


                        });
                    });
                });
            }
            doall().then(function() {



            });
        }

        connectedCallback() {
            //this.addEventListener('click', this.beAwesome.bind(this))

            
        }



    }
);
