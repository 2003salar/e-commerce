const validateCard = array => {
  return new Promise((resolve, reject) => {
    let newArray = [];
    let sum = 0;
    
    for (let i = array.length - 1; i >= 0; i--) {
      let num = array[i];
      if ((array.length - 1 - i) % 2 === 1) {
        num *= 2; 
        if (num > 9) {
          num -= 9;
        }
      }
      newArray.push(num);
    }

    for (let i = 0; i < newArray.length; i++) {
      sum += newArray[i];
    }

    if (sum % 10 === 0) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};

module.exports = validateCard;



