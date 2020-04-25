interface EventData {
  id: string;
}

function processEventData(eventData: EventData) {
  console.log(eventData);
}

export {
  EventData,
  processEventData,
};
