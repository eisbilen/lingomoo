// super-span.js

const options = {duration: 300, iterations: 5, easing: 'ease-in-out'}
const keyframes = [
  {opacity: 1.0, blur: '0px', transform: 'rotate(0deg)'},
  {opacity: 0.7, blur: '2px', transform: 'rotate(360deg)'},
  {opacity: 1.0, blur: '0px', transform: 'rotate(0deg)'},
]

const template = document.createElement('template')
template.innerHTML = `
<!-- Google Fonts -->
  <link
  href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Dosis:300,400,500,,600,700,700i|Lato:300,300i,400,400i,700,700i"
  rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="../assets/css/style.css" rel="stylesheet">

  <style>
    span {
      display: inline-block;
      font-weight: var(--super-font-weight, bolder);
    }
  </style>
  <div class="container">

  <div class="card-group">

    <div class="card" style="width: 18rem;">
      
      <div class="card-body">
        <h5 class="card-title">VERBS: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <p></p>
        <span class="badge badge-warning">23,343 questions</span>
       
      </div>
    </div>

    <div class="card" style="width: 18rem;">
      <span class="badge badge-warning">13,343 questions available</span>
      <div class="card-body">
        <h5 class="card-title">ADJECTIVES: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <a id="verb-set2" href="#" class="btn btn-primary">STUDY</a>
      </div>
    </div>


    <div class="card" style="width: 18rem;">
      <span class="badge badge-warning">13,343 questions available</span>
      <div class="card-body">
        <h5 class="card-title">ADJECTIVES: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <a id="verb-set2" href="#" class="btn btn-primary">STUDY</a>
      </div>
    </div>

    
    <div class="card" style="width: 18rem;">
      <span class="badge badge-warning">13,343 questions available</span>
      <div class="card-body">
        <h5 class="card-title">ADJECTIVES: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <a id="verb-set2" href="#" class="btn btn-primary">STUDY</a>
      </div>
    </div>

    
    <div class="card" style="width: 18rem;">
      <span class="badge badge-warning">13,343 questions available</span>
      <div class="card-body">
        <h5 class="card-title">ADJECTIVES: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <a id="verb-set2" href="#" class="btn btn-primary">STUDY</a>
      </div>
    </div>

    
    <div class="card" style="width: 18rem;">
      <span class="badge badge-warning">13,343 questions available</span>
      <div class="card-body">
        <h5 class="card-title">ADJECTIVES: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <a id="verb-set2" href="#" class="btn btn-primary">STUDY</a>
      </div>
    </div>

    
    <div class="card" style="width: 18rem;">
      <span class="badge badge-warning">13,343 questions available</span>
      <div class="card-body">
        <h5 class="card-title">ADJECTIVES: STUDY SET ONE</h5>
        <p class="card-text">Study the complete set</p>
        <a id="verb-set2" href="#" class="btn btn-primary">STUDY</a>
      </div>
    </div>

  </div>



  <ul class="nav nav-tabs mt-4 justify-content-left">
    <li class="nav-item">
      <a class="nav-link  active" href="#">Study</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="worksheet.html">Create Worksheet</a>
    </li>
  </ul>
  <div class="row mt-2 text-center">
    <h5 id="your-profile" ></h5>
    <button type="button" class="btn btn-danger btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      What do you want to study today ?
    </button>
    <div class="dropdown-menu">
      <a id="todays_content" class="dropdown-item" href="#">Today's Content</a>
      <div class="dropdown-divider"></div>

      <a id="VERB" class="dropdown-item" href="#">Verbs</a>
      <a id="ADJECTIVE" class="dropdown-item" href="#">Adjectives</a>
      <a id="ADVERB" class="dropdown-item" href="#">Adverbs</a>

      <div class="dropdown-divider"></div>
      <a id="PREPOSITION" class="dropdown-item" href="#">Prepositions</a>
      <a id="ADVERB_PARTICLE" class="dropdown-item" href="#">Adverb Particles</a>
      <a id="POSSESIVE_PRONOUN" class="dropdown-item" href="#">Possesive Nouns</a>
      <div class="dropdown-divider"></div>
      <a id="MODAL" class="dropdown-item" href="#">Modals</a>
    </div>

  </div>

  <div class="row mt-4">
      <h5 id= "study_label" class="text-center"></h5>
  </div>
  
  <div class="row">
    <div id="card-cont" class="card-columns"></div>
  </div>

  <div class="row mt-4">
  <div class="col text-center">
    <h4 id="index-text" ></h4>
  </div>
  </div>

  <div class="row">
    <div class="col-6 text-center">
      <a id="previous-button" class="btn btn-primary" href="#" role="button">Previous</a>
    </div>

    <div class="col-6 text-center">
      <a id="next-button" class="btn btn-primary" href="#" role="button">Next</a>
    </div>
  </div>
</div>

  <span><slot></slot></span>
  <abbr title="click or mouse over">Erdem Oldu mu simdi bu🖱</abbr>
`;

customElements.define('super-span', class SuperSpan extends HTMLElement {

  $(selector) {
    return this.shadowRoot && this.shadowRoot.querySelector(selector)
  }

  constructor() {
    super()
    this.shine = this.shine.bind(this)
    const root = this.attachShadow({mode: 'open'})
          root.appendChild(template.content.cloneNode(true))
    this.addEventListener('click', this.shine)
    this.addEventListener('mouseover', this.shine)
  }

  connectedCallback() {
    const slot = this.$('slot')
    const [node] = slot.assignedNodes()
    this.setAttribute('aria-label', node.textContent)
    node.textContent = '⭐️'
  }

  shine(event) {
    this.$('span').animate(keyframes, options)
  }
});
