interface PlayerState {
  time: number,
}

function makeDefaultPlayerState(): PlayerState {
  return {
    time: 0,
  };
}

export default PlayerState;
export {
  makeDefaultPlayerState,
};
