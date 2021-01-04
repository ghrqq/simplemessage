import ads from "./ads.json";

let shadowArr = [];

const adSplicer = (arrToAdd, limit, skip) => {
  let endingIndexOfSlice = Math.floor(arrToAdd.length / 4);

  let randomIndexArr = [];
  while (randomIndexArr.length < endingIndexOfSlice) {
    let r = Math.floor(Math.random() * (limit - skip + 1) + skip);
    if (randomIndexArr.indexOf(r) === -1) randomIndexArr.push(r);
  }

  // let r = Math.floor(Math.random() * limit) + 1; // Old one replace it up there

  randomIndexArr.sort((a, b) => a - b);

  // console.log("randomIndexArr: ", randomIndexArr);
  // console.log("addedrandomIndexArr: ", addedRandomIndexArr);
  shadowArr = [...arrToAdd];

  console.log("endingIndexOfSlice: ", endingIndexOfSlice);

  const slicedArr = ads.ads.slice(0, endingIndexOfSlice);

  slicedArr.map((item) => {
    let i = slicedArr.indexOf(item);

    shadowArr.splice(randomIndexArr[i], 0, item);
  });

  // console.log(shadowArr);
  return shadowArr;
};

// adSplicer(arr1, 20, arr2);

// console.log(shadowArr);

export default adSplicer;
