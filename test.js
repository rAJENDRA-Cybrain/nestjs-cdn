/* eslint-disable prettier/prettier */
const func = () => {
  setTimeout(() => {
    console.log('- 1 -');
  }, 1000);

  setTimeout(() => {
    console.log('- 2 -');
  }, 2000);

  setTimeout(() => {
    console.log('- 3 -');
  }, 5000);

  setTimeout(() => {
    console.log('- 4 -');
  }, 7000);
};


for (var i = 0; i < 10; i++) {
    (function (j) {
      setTimeout(() => console.log(j), 1000);
    })(i);
  }