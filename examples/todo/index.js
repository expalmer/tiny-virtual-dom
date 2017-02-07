/** @jsx h */
const { h, patch } = require('../../lib');

var DATAS = [
  {
    task: 'Read a good book',
    done: false
  },
  {
    task: 'Learn Javascript',
    done: false
  },
  {
    task: 'Learn Haskell',
    done: false
  }
];

// Events
const onAddTask = event => {
  const { value } = event.target;
  if (event.keyCode === 13 && value) {
    DATAS = [{ task: value, done: false }, ...DATAS];
    event.target.value = '';
    render();
  }
};

const onToggleTask = index => {
  DATAS = DATAS.map((i, idx) => {
    if (index === idx) {
      i.done = !i.done;
    }
    return i;
  });
  render();
};

const onRemoveTask = index => {
  DATAS = DATAS.filter((i, idx) => index !== idx);
  render();
};

// Elements
const Input = props => {
  return (
    <div className="insert">
      <input type="text" placeholder="What needs to be done?" onkeyup={onAddTask} />
    </div>
  );
};

const Item = props => {
  const { item, index } = props;
  return (
    <li className={`todo${item.done ? ' done' : ''}`}>
      <span onclick={() => onToggleTask(index)}>{item.task}</span>
      <button className="destroy" onclick={() => onRemoveTask(index)}></button>
    </li>
  );
};

const List = props => {
  const { datas } = props;
  return (
    <ul className="list">
      {datas.map((item, index) => <Item item={item} index={index} />)}
    </ul>
  );
};

const App = props => {
  return (
    <div>
      <h1>To Do List</h1>
      <Input />
      <List datas={props.datas} />
    </div>
  );
};


var currentTree;

function render() {
  const nextTree = <App datas={DATAS} />;
  patch(document.getElementById('app'), nextTree, currentTree);
  currentTree = nextTree;
}

render();
