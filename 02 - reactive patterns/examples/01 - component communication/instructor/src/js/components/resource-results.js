// Here, we'll define a custom event for when an item is selected from the result component,
// and handle emitting it. We'll also highlight the selected item so the UI reacts to the user's actions.

const template = document.createElement('template');
// TODO: Update the template to support dynamic results (NOTE: we are not altering the badge count at this time)
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <section class="h-100">
    <div class="card h-100">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Results</strong>
        <span class="badge text-bg-secondary">4</span>
      </div>

      <div class="list-group list-group-flush">

        <!-- results will be injected here, by selecting for .list-group and embedding inner HTML -->

      </div>
    </div>
  </section>`;

class ResourceResults extends HTMLElement {
  // TODO: Create a private field for results data
  #results = [];  // # makes a property or method privately scoped.
  // This means only methods/logic from the same instance (e.g. ResourceResults) can change it.
  // We're going to have a controlled process for writing the data, and we don't want outside logic to be able to bypass that.

  constructor() {
    super();
    // TODO: Bind the handleResultClick method to this instance
    // WTF is this and why do we need to do it? -> https://dev.to/aman_singh/why-do-we-need-to-bind-methods-inside-our-class-component-s-constructor-45bn
    // If you read to the end, you'll know we could've just used an arrow function... but this illustrates class vs. instance behavioural differences 
    this._handleResultClick = this._handleResultClick.bind(this); 
    this.attachShadow({ mode: 'open' });
  }

  // TODO: Implement setter for results data, remember to render
  set results(data) {
    // The setter method for our private array - similar to what you're learning in C# right now.
    this.#results = data;
    this.render();  // when data is set, call our render method (below) to fire the display logic.
  }

  // TODO: Add an event handler method for result selection
  _handleResultClick(event) {
    // Let's leave this empty for now,
    // and first deal with where it needs to be called elsewhere in our object for event-driven behaviour.
  }

  connectedCallback() {  // <- when the component loads/attaches into the DOM...
    // TODO: Add a click event listener to handle result selection
    this.shadowRoot.addEventListener('click', this._handleResultClick);
    this.render();
  }

  // TODO: Clean up event listener in disconnectedCallback
  disconnectedCallback () {  // <- when the component is unloaded/removed from the DOM...
    // ... then clean up your unused event listeners!
    this.shadowRoot.removeEventListener('click', this._handleResultClick);
  }
  
  render() {
    // TODO: Update to render from the private results field, if it's empty, show "No results found" message

    // copy template HTML above onto the shadow root node for this component, 
    const content = template.content.cloneNode(true)
    // and snipe that list-group class so we can nest our data display inside it
    const listGroup = content.querySelector('.list-group');


    // then render a result row for each item in the results array
    if (this.#results.length) {  // resolves true if the results array contains items
      // for each result in the array, generate HTML to hold/display data
      // -> pack it all inside a sneaky <button> so we can later easily highlight it when active with bootstrap classes
      const resultsHTML = this.#results.map(
        result => `
        <button type="button" class="list-group-item list-group-item-action" data-id="${result.id}">
          <div class="d-flex w-100 justify-content-between">
            <h2 class="h6 mb-1">${result.title}</h2>
            <small>${result.category}</small>
          </div>
          <p class="mb-1 small text-body-secondary">${result.summary}</p>
          <small class="text-body-secondary">${result.location}</small>
        </button>`
      ); 

      // inject the HTML we just generated inside the list-group node
      listGroup.innerHTML = resultsHTML.join(''); // resultsHTML is an array, so combine each HTML blob back-to-back into a string

    } else {
      // If #results contains no items, display some default text.
      // Always communicate to the user in UI design! An empty card might have them wondering if something's broken.
      listGroup.innerHTML = `
        <div class="list-group-item">
          <p class="mb-0">No results found.</p>
        </div>`;
    }

    // finally, take the content we composed and add it to the shadow root node!
    this.shadowRoot.innerHTML = '';  // clear current contents first; we're re-rendering
    this.shadowRoot.appendChild(content);
  }
}

customElements.define('resource-results', ResourceResults);