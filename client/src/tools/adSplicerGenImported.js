import ads from "./ads.json";

let shadowArr = [];

const adSplicer = (arrToAdd, limit, skip) => {
  let endingIndexOfSlice = Math.floor(arrToAdd.length / 4);

  let randomIndexArr = [];
  while (randomIndexArr.length < endingIndexOfSlice) {
    let r = Math.floor(Math.random() * (limit - skip + 1) + skip);
    if (randomIndexArr.indexOf(r) === -1) randomIndexArr.push(r);
  }

  randomIndexArr.sort((a, b) => a - b);

  shadowArr = [...arrToAdd];

  const slicedArr = ads.ads.slice(0, endingIndexOfSlice);

  slicedArr.map((item) => {
    let i = slicedArr.indexOf(item);

    shadowArr.splice(randomIndexArr[i], 0, item);
  });

  return shadowArr;
};

export default adSplicer;
