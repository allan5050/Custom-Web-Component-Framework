// user-details.js
import { define, store, html } from './your-framework.js';

const User = {
  id: 1,
  name: '',
  [store.connect]: {
    get: (id) => {
      return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then((response) => response.json())
        .then((user) => {
          console.log('User data retrieved:', user);
          console.log('User name:', user.name);
          return user;
        });
    },
  },
};

define({
  tag: 'user-details',
  user: store(User),
  render: ({ user }) => html`
    <div>
      ${store.pending(user) && `Loading...`}
      ${store.error(user) && `Something went wrong...`}
      ${store.ready(user) && html`
        <p>Name: ${user.name}</p>
      `}
    </div>
  `,
});