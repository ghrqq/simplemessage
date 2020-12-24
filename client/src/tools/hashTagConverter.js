const hashTagConverter = (str, type) => {
  if (str[0] === "#" && type === "pound") {
    return str;
  }
  if (str[0] === "#") {
    let cutted = str.slice(1, str.length);

    let converted = "%23" + cutted;
    return converted;
  }

  if (str[0] === "%" && str[1] === "2" && str[2] === "3") {
    let cutted = str.slice(3, str.length);
    let converted = "#" + cutted;
    return converted;
  } else {
    if (type === "pound") {
      let converted = "#" + str;
      return converted;
    } else {
      let converted = "%23" + str;
      return converted;
    }
  }
};

export default hashTagConverter;
