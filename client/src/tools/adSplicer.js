let shadowArr = [];

const adSplicer = (arrToAdd, limit, arrToBeAdded) => {
  let randomIndexArr = [];
  while (randomIndexArr.length < 4) {
    let r = Math.floor(Math.random() * limit) + 1;
    if (randomIndexArr.indexOf(r) === -1) randomIndexArr.push(r);
  }
  randomIndexArr.sort((a, b) => a - b);

  shadowArr = [...arrToAdd];

  arrToBeAdded.map((item) => {
    let i = arrToBeAdded.indexOf(item);

    shadowArr.splice(randomIndexArr[i], 0, item);
  });
};

adSplicer(arr1, 20, arr2);

console.log(shadowArr);
