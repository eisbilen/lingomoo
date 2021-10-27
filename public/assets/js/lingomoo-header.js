// lingomoo-header.js

const template = document.createElement("template");

template.innerHTML = ` 
<!-- ======= Header ======= -->
<!-- Vendor CSS Files -->
<link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="../assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">

<!-- Template Main CSS File -->
<link href="../assets/css/style.css" rel="stylesheet">

<header id="header" class="fixed-top">
  <div class="container d-flex align-items-center">
    <a href="index.html" class="logo mr-auto"><img src="assets/img/lingomoo.svg" alt="" class="img-fluid"></a>
    <img id="profile_image" src="/img/user-circle-solid.svg" class="rounded-circle" alt="" width="40" height="40" />
  </div>
</header><!-- End Header -->
`;

customElements.define(
  "lingomoo-header",
  class SuperSpan extends HTMLElement {
    $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.appendChild(template.content.cloneNode(true));

    }
    connectedCallback() {
    }
  }
);
