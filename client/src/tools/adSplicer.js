let shadowArr = [];

const adSplicer = (arrToAdd, limit, skip, arrToBeAdded) => {
  let randomIndexArr = [];
  while (randomIndexArr.length < 4) {
    let r = Math.floor(Math.random() * (limit - skip + 1) + skip);
    if (randomIndexArr.indexOf(r) === -1) randomIndexArr.push(r);
  }

  // let r = Math.floor(Math.random() * limit) + 1; // Old one replace it up there

  randomIndexArr.sort((a, b) => a - b);

  shadowArr = [...arrToAdd];

  arrToBeAdded.map((item) => {
    let i = arrToBeAdded.indexOf(item);

    shadowArr.splice(randomIndexArr[i], 0, item);
  });

  console.log(shadowArr);
  return shadowArr;
};

// adSplicer(arr1, 20, arr2);

// console.log(shadowArr);

export default adSplicer;
