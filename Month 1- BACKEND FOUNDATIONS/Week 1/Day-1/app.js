// const sum = require('./sum')

// console.log(sum.sumOfTwoNumber(10,20))
// const fs = require("fs")
// setImmediate(() => console.log('setImmediate'))

// setTimeout(() => console.log('Timer expired'), 0);

// Promise.resolve('Promise').then((res) => console.log(res))

// fs.readFile('./file.txt', 'utf8', () => {
//     setTimeout(() => console.log('2nd Timer'), 0);
//     process.nextTick(() => console.log('2nd nextTick'))
//     setImmediate(() => console.log('2nd setImmediate'))
//     console.log('File reading CB')
// })
// process.nextTick(() => console.log('nextTick'))
// console.log('Last line of file')

setTimeout(() => console.log("timeout"), 0);

setImmediate(() => console.log("immediate"));