

The `login/`, `signup/` and `widget/` folders are all going to be the containers for our different routes. Explanations of the files are:

`index.js` - the actual container component itself and all of the react goodness
`sagas.js` - where we'll store our sagas to watch for API related calls
`reducer.js` - where we'll manage the piece of state related to this container
`actions.js` - where we'll keep all of the actions that our container dispatches
`constants.js` - where we'll store our constants for reducers/actions


__1) Store__:

We setup a global "store" to "store" our application's "state". Not to be confused with React's internal state.

Think of this like a state of states. A country.

__2) Reducer__:

We provide our store with reducers which are like the "gatekeepers", "managers" of their own piece of state.

So think of them like the governors of each state of that bigger state, or country. When something comes into modify their state, they accept/reject or use it.

__3) Provide__:

We "provide" that store to our app via the <Provider store={store} />.

Get it? We provide our app with a store. This makes it possible for our app to be aware of this global state.

__4) Actions__:

Our app dispatches actions to of how we'd like to make our global applications state (store) be due to that action.

So, we signup for an app. That is an action that must change our application's global state (country) but particularly a specific piece (state).

__5) Reducer Check__:

Our reducers, if the action is relevant to them, capture it and modify their state accordingly.

The reducer governor in charge of, let's say the Signup state, sees that someone would like to modify it, and either accepts/rejects or changes the state.

__6) Redner__:

As our global state changes, our connected app receives these changes and re-renders our react components appropriately.

