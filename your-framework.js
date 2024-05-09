// your-framework.js
export function define(component) {
    const { tag, render, ...initialState } = component;

    class CustomElement extends HTMLElement {
        constructor() {
            super();
            Object.assign(this, initialState);
            this.attachShadow({ mode: 'open' });
            this.updateComponent();
        }

        updateComponent() {
            const template = document.createElement('template');
            template.innerHTML = render(this);
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.bindEventListeners();
            this.updateAttributes();
        }

        updateAttributes() {
            Object.keys(initialState).forEach(attr => {
                this.setAttribute(attr, this[attr]);
            });
        }

        bindEventListeners() {
            const eventElements = this.shadowRoot.querySelectorAll('[onclick]');
            eventElements.forEach(element => {
                const eventHandler = new Function('event', `
          with (this) {
            (${element.getAttribute('onclick')})(this);
            this.updateComponent();
          }
        `).bind(this);
                element.addEventListener('click', eventHandler);
            });
        }
    }

    customElements.define(tag, CustomElement);
}

export function html(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] ? values[i] : '';
        return result + string + value;
    }, '');
}