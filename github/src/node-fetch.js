import fetch from 'node-fetch';

const response = await fetch('https://api.github.com/users/trasherdk');
const data = await response.json();

console.log(data);
