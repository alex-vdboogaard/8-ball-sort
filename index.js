//initialise a random array of numbers 1 - 15:
let arrOptions = [];

for (let i=1;i <= 15;i++) {
    arrOptions.push(i);
}

function getRandomFromArr() {
   var randomIndex = Math.floor(Math.random()*arrOptions.length);
   let removed = arrOptions[randomIndex];
   //swap and remove
   arrOptions[randomIndex] = arrOptions[arrOptions.length - 1];
   arrOptions.pop();
   return removed;
}

let random = [];
for (let j = 0; j < 15; j++) {
    random[j] = getRandomFromArr();
};