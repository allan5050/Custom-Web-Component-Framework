// user-details.js
import { define, store, html } from './your-framework.js';

const User = {
    id: true,
    name: "",
    username: "", 
    connect: {
        get: () => {
            console.log('Fetching user data...');
            return fetch('https://jsonplaceholder.typicode.com/users/1')
                .then(response => {
                    console.log('Response received:', response);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User data:', data);
                    return data;
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    return { status: 'error', error };
                });
        },
    },
};

define({
    tag: "user-details",
    user: store(User),
    render: ({ user }) => {
        console.log('Rendering user-details component...');
        console.log('User data in render:', user);
        return html`
            <div>
                ${store.pending(user) && `Loading...`}
                ${store.error(user) && `Something went wrong...`}
                ${store.ready(user) && html`
                    <p>${user.name}</p>
                `}
            </div>
        `;
    },
});