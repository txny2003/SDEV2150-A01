// I don't need to do anything to the template, because it's just an as-is input interface.
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <aside class="h-100">
    <div class="card h-100">
      <div class="card-header">
        <strong>Filters</strong>
      </div>

      <div class="card-body">
        <form id="frm-filter">
          <label for="q" class="form-label">Search</label>
          <input id="q" class="form-control" type="text" placeholder="Try: tutoring, mental health, bursary" />

          <hr class="my-3" />

          <div class="mb-2"><strong>Category</strong></div>
          <div class="d-flex flex-wrap gap-2" aria-label="Category filters">
            <button class="btn btn-sm btn-outline-primary" type="button">All</button>
            <button class="btn btn-sm btn-outline-primary" type="button">Academic</button>
            <button class="btn btn-sm btn-outline-primary" type="button">Wellness</button>
            <button class="btn btn-sm btn-outline-primary" type="button">Financial</button>
            <button class="btn btn-sm btn-outline-primary" type="button">Tech</button>
          </div>

          <hr class="my-3" />

          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="openNow" />
            <label class="form-check-label" for="openNow">Open now</label>
          </div>

          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="virtual" />
            <label class="form-check-label" for="virtual">Virtual options</label>
          </div>

          <hr class="my-3" />

          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" type="button">Reset</button>
            <button class="btn btn-primary" type="submit">Filter</button>
          </div>
        </form>
      </div>
    </div>
  </aside>`;


class ResourceFilters extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCategoryClick = this._handleCategoryClick.bind(this);
  }

  connectedCallback() {
    this._form = this.shadowRoot.querySelector('#frm-filter');
    this._form.addEventListener('submit', this._handleSubmit);

    this._categoryGroup = this.shadowRoot.querySelector('aria-label="Category filters"') // aria-label is its uniquely identifying attribute
    this._categoryGroup.addEventListener('click', this._handleCategoryClick);

    this.render();
  }

  disconnectedCallback() {
    if (this._form) {
      this._form.removeEventListener('submit', this._handleSubmit);
    }
    if (this._categoryGroup) {
      this._categoryGroup.removeEventListener('click', this._handleCategoryClick);
    }
  }

  _handleCategoryClick(event) {
    const button = event.target.closest('button');
    if (!button || !this._categoryGroup.contains(button)) {
      // If no button could be identified ||or the click happened within this div but not on a button, GTFO
      return;
    }

    const activeButton = this._categoryGroup.querySelector('.active');
    if (activeButton && activeButton !== button) {
      // If there is an active button &&and it's !==not the one just clicked, toggle it to inactive
      activeButton.classList.remove('active');
    }

    // With the above checks passed, we can toggle the button that just got clicked
    button.classList.add('active');
  }

  _handleSubmit(event) {
    event.preventDefault();

    const searchQuery = this.shadowRoot.querySelector('#q').value.trim();
    // Getting the category requires a few steps of work: find group -> find active button -> find its text value
    const categoryGroup = this.shadowRoot.querySelector('aria-label="Category filters"') // aria-label is its uniquely identifying attribute
    const categoryButton = categoryGroup.querySelector('.active') || categoryGroup.querySelector('button');
    const category = categoryButton ? categoryButton.textContent.trim().toLowerCase() : 'all' // default to all if no selected button
    const openNow = this.shadowRoot.querySelector('#openNow').checked;
    const virtual = this.shadowRoot.querySelector('#virtual').checked;

    const filters = {
      searchQuery,
      category,
      openNow,
      virtual,
    };

    const filtersEvent = new CustomEvent(
      'resource-filters-changed',
      {
        details: filters,
        bubbles: true,
        composed: true,
      }
    );

    this.dispatchEvent(filtersEvent);
  }

  render() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resource-filters', ResourceFilters);