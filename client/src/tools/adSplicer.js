let shadowArr = [];

const adSplicer = (arrToAdd, limit, skip, arrToBeAdded) => {
  // console.log(arrToAdd);
  let randomIndexArr = [];
  while (randomIndexArr.length < 4) {
    let r = Math.floor(Math.random() * 24) + 1;
    if (randomIndexArr.indexOf(r) === -1 && r > 1) randomIndexArr.push(r);
  }
  // let r = Math.floor(Math.random() * (limit - skip + 1) + skip);
  // let r = Math.floor(Math.random() * limit) + 1; // Old one replace it up there

  randomIndexArr.sort((a, b) => a - b);
  // console.log("randomIndexArr: ", randomIndexArr, limit, skip);

  shadowArr = [...arrToAdd];

  const slicedAdArr = arrToBeAdded.slice(skip / 5, limit / 5);
  // console.log("slicedArr: ", slicedAdArr);

  slicedAdArr.map((item) => {
    let i = slicedAdArr.indexOf(item);

    shadowArr.splice(randomIndexArr[i], 0, item);
  });

  // console.log(shadowArr);
  return shadowArr;
};

// adSplicer(arr1, 20, arr2);

// console.log(shadowArr);

export default adSplicer;
