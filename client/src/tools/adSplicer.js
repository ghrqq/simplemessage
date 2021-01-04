let shadowArr = [];

const adSplicer = (arrToAdd, limit, skip, arrToBeAdded) => {
  let randomIndexArr = [];
  while (randomIndexArr.length < 4) {
    let r = Math.floor(Math.random() * 24) + 1;
    if (randomIndexArr.indexOf(r) === -1 && r > 1) randomIndexArr.push(r);
  }

  randomIndexArr.sort((a, b) => a - b);

  shadowArr = [...arrToAdd];

  const slicedAdArr = arrToBeAdded.slice(skip / 5, limit / 5);

  slicedAdArr.map((item) => {
    let i = slicedAdArr.indexOf(item);

    shadowArr.splice(randomIndexArr[i], 0, item);
  });

  return shadowArr;
};

export default adSplicer;
