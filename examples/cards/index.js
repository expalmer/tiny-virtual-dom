/** @jsx h */
const { h, patch } = require('../../lib');
const store = require('./store');
const constants = require('./constants');
var currentTree;
var counters = {};

// EVENTS
function onSubmit(e) {
  e.preventDefault();
  const title = e.target.childNodes[0].value;
  const seconds = e.target.childNodes[1].value;
  if (title && seconds) {
    e.target.childNodes[0].focus();
    e.target.childNodes[0].value = '';
    e.target.childNodes[1].value = '';
    store.dispatch(constants.ADD_CARD, { title, seconds });
  }
  return false;
}

function onAddTask(e, id) {
  const { value } = e.target;
  if (e.keyCode === 13 && value) {
    store.dispatch(constants.ADD_TASK, { id, value });
    e.target.value = '';
  }
}

function onTaskToggle(id, idx) {
  store.dispatch(constants.TASK_TOGGLE, { id, idx });
}

function onRemoveTask(id, idx) {
  store.dispatch(constants.REMOVE_TASK, { id, idx });
}

function onStop(e, id) {
  e.stopPropagation();
  store.dispatch(constants.STOP, { id });
}

function onStart(e, id) {
  e.stopPropagation();
  store.dispatch(constants.PLAY, { id });
}

function onRemove(e, id) {
  e.stopPropagation();
  clearTimes(id);
  store.dispatch(constants.REMOVE, { id });
}

function clearTimes(id) {
  if (!counters[id]) {
    return ;
  }
  counters[id].map(c => clearInterval(c));
  counters[id] = [];
}
function times(id, seconds, stop) {
  if (!counters[id] || counters[id].length === 0) {
    const fn = (function(s, i) {
      return () => store.dispatch(constants.COUNTING, { id: i, seconds: s-- });
    })(seconds, id);
    counters[id] = counters[id] || [];
    counters[id].push(setInterval(fn, 1000));
    return;
  } 

  if (stop || seconds === 0) {
    clearTimes(id);
    if (seconds === 0) {
      setTimeout(() => store.dispatch(constants.REMOVE, { id }), 1);
    }
  }
}


// ELEMENTS
function Header(props) {
  return (
    <header className="header">
      <form onsubmit={onSubmit}>
        <input type="text" placeholder="title"/>
        <input type="number" placeholder="timeout" />
        <input type="submit" style={{ display: 'none' }} />
      </form>
    </header>
  );
}

function Actions(props) {
  const { id } = props;
  return (
    <div className="card__actions">
      <span className="play" onclick={e => onStart(e, id)}>Play</span>
      <span className="stop" onclick={e => onStop(e, id)}>Stop</span>
      <span className="remove" onclick={e => onRemove(e, id)}>Rem</span>
    </div>
  );
};

function AddTask(props) {
  const { id } = props;
  return (
    <div className="card__input">
      <input type="text" onkeyup={(e) => onAddTask(e, id)} />
    </div>
  );
};

function Tasks(props) {
  const { id, tasks } = props;
  return (
    <ul className="tasks">
      {tasks.map((item, idx) => (
        <li className={ item.done ? 'done' : '' }>
          <span onclick={() => onTaskToggle(id, idx)}>{item.task}</span> 
          <small onclick={() => onRemoveTask(id, idx)} className="del">&times;</small>
        </li>
      ))}
    </ul>
  );
};

function Time(props) {
  const { seconds } = props.card;
  return (
    <div className="timeout">
      <h5>{seconds} <small>sec</small></h5>
    </div>
  );
};

function Progress(props) {
  const { tasks } = props;
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length || 0;
  const left = (100 / total) * done;
  const className = left < 30 ? 'low' : (left < 50) ? 'half' : (left < 100 ? 'high' : left === 100 ? 'ok' : '');
  return (
    <div className={`progress ${className}`}>
      <span style={{ left: `${left}%` }}></span>
    </div>
  );
};

function Card(props) {
  const { card } = props;
  const { id, title, seconds, tasks, stop } = card;
  times(id, seconds, (stop || seconds === 0));
  return (
    <li>
      <div className="card">
        <h1>{title}</h1>
        <AddTask id={id} />
        <Tasks tasks={tasks} id={id} />
        <Progress tasks={tasks} />
        <Time card={card} />
        <Actions id={id} />
      </div>
    </li>
  );
}

function Cards(props) {
  return (
    <div className="limiter">
      <ul className="cards">
        {props.datas.map(card => <Card card={card} />)}
      </ul>
    </div>
  );
}
function App(props) {
  const { datas } = props;
  return (
    <div>
      <Header />
      <Cards datas={datas} />
    </div>
  );
}

function render(datas) {
  const nextTree = <App datas={datas} />;
  patch(document.getElementById('app'), nextTree, currentTree);
  currentTree = nextTree;
}
store.subscribe(render);
store.dispatch('INI');