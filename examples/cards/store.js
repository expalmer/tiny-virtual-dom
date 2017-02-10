const constants = require('./constants');

const getId = (() => {
	var id = 1;
	return () => id++;
})();

const initialState = [
  {
		id: getId(),
    title: 'Some thing to do',
    tasks: [{ task: 'one', done: false} , { task: 'two', done: false }],
    seconds: 60,
		stop: false
  }
];

const store = ((initialState) => {
  var listeners = [];
  var currentState = initialState;

  function subscribe(fn) {
    listeners.push(fn);
  }

  function dispatch(action, payload) { 
		console.log(action, payload);
		switch(action) {
			case constants.ADD_CARD: {
				const { title, seconds } = payload;
				const newCard = {
					id: getId(),
					title,
					seconds,
					tasks: [],
					stop: false
				};
				currentState = [newCard, ...currentState];
				break;
			}
			case constants.ADD_TASK: {
				currentState = [...currentState].map(card => {
					if (payload.id === card.id) {
						card.tasks = [{ task: payload.value, done: false }, ...card.tasks];
					}
					return card;
				});
				break;
			}
			case constants.TASK_TOGGLE: {
				currentState = [...currentState].map(card => {
					if (payload.id === card.id) {
						card.tasks = [...card.tasks].map((task, idx) => {
							if (payload.idx === idx) {
								task.done = !task.done;
							}
							return task;
						});
					}
					return card;
				});
				break;
			}
			case constants.REMOVE_TASK: {
				currentState = [...currentState].map(card => {
					if (payload.id === card.id) {
						card.tasks = [...card.tasks].filter((task, idx) => idx !== payload.idx);
					}
					return card;
				});
				break;
			}

			case constants.COUNTING: {
				currentState = [...currentState].map(card => {
					if (payload.id === card.id) {
						card.seconds = payload.seconds;
					}
					return card;
				});
				break;
			}

			case constants.STOP: {
				currentState = [...currentState].map(card => {
					if (payload.id === card.id) {
						card.stop = true;
					}
					return card;
				});
				break;
			}

			case constants.PLAY: {
				currentState = [...currentState].map(card => {
					if (payload.id === card.id) {
						card.stop = false;
					}
					return card;
				});
				break;
			}
			case constants.REMOVE: {
				currentState = [...currentState].filter(card => payload.id !== card.id);
				break;
			}
		}

    listeners.forEach(fn => fn(getState()));
  }

  function getState() {
    return [...currentState];
  }

  return {
    subscribe,
    dispatch,
		getState,
  };
})(initialState);

module.exports = store;