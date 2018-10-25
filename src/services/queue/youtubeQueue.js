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
  const popped = queue.splice(0,1);
  triggerOnChange();
  return popped.length ? popped[0] : undefined;
}

function getQueue() {
  return queue;
}

function add(video) {
  if (video.playNext) {
    queue.unshift(video);
  } else {
    queue.push(video);
  }
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
