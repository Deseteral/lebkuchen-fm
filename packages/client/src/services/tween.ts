interface TweenOverTimeArgs {
  from: number,
  to: number,
  time: number,
  onUpdate: (value: number) => void,
  onComplete: () => void,
}

function tweenOverTime({ from, to, time, onUpdate, onComplete }: TweenOverTimeArgs) {
  const startTime = Date.now();

  const loop = () => {
    const t = (Date.now() - startTime) / time;

    if (t >= 1.0) {
      onUpdate(to);
      onComplete();
      return;
    }

    const value = from + (to - from) * t;
    onUpdate(value);

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

export {
  tweenOverTime,
  TweenOverTimeArgs,
};
