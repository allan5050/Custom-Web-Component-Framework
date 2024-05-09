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
                if (attr !== 'connect') {
                    if (attr === 'user') {
                        this.setAttribute(attr, this[attr].username);
                    } else {
                        this.setAttribute(attr, this[attr]);
                    }
                }
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

        async connectedCallback() {
            console.log('Connected callback started');
            await this.updateStoreData();
            console.log('Store data updated');
            this.updateComponent();
            console.log('Component updated');
        }

        async updateStoreData() {
            console.log('Updating store data');
            for (const key in this) {
                console.log(`Checking key: ${key}`);
                if (this[key] && typeof this[key] === 'object' && this[key].connect) {
                    console.log(`Found store key: ${key}`);
                    const storeData = await this[key].connect.get();
                    console.log(`Store data for ${key}:`, storeData);
                    this[key] = { ...this[key], ...storeData, status: 'ready' };
                    console.log(`Updated store data for ${key}:`, this[key]);
                    this.updateAttributes();
                }
            }
            console.log('this.user:', this.user);
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

export function store(initialState) {
    return {
        ...initialState,
        status: 'pending',
        connect: initialState.connect,
    };
}

store.pending = data => data.status === 'pending';
store.error = data => data.status === 'error';
store.ready = data => data.status === 'ready';
