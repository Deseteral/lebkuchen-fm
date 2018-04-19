let queue = [];

const subscribers = {
  added: new Set(),
  changed: new Set(),
};

function clear() {
  queue.length = 0;
  triggerOnChange();
}

function pop() {
  const popped = queue.pop();
  triggerOnChange();
  return popped;
}

function getQueue() {
  return queue;
}

function add(video) {
  queue.push(video);
  if (queue.length === 1) {
    subscribers.added.forEach((callback)=> callback());
  }
  triggerOnChange();
}
function triggerOnChange(){
  subscribers.changed.forEach((callback)=> callback(queue));
}

function setOnAddListener(callback) {
  subscribers.added.add(callback);
}

function setOnChangeListener(callback) {
  subscribers.changed.add(callback);
}

export default {
  add,
  clear,
  getQueue,
  pop,
  setOnAddListener,
  setOnChangeListener,
};
