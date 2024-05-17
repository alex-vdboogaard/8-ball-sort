function showTriangle(arr) {
    let wrapper = document.createElement("div");
    wrapper.classList.add("triangle-wrapper");
    wrapper.innerHTML = `
            <img src='https://github.com/alex-vdboogaard/8-ball-sort/images/individual-balls/${arr[0]}.png'> 
            <div class="horizontal-balls"><img src='https://github.com/alex-vdboogaard/8-ball-sort/images/individual-balls/${arr[1]}.png'><img src='/images/individual-balls/${arr[2]}.png'></div>
            <div class="horizontal-balls"><img src='https://github.com/alex-vdboogaard/8-ball-sort/images/individual-balls/${arr[3]}.png'><img src='/images/individual-balls/${arr[4]}.png'><img src='/images/individual-balls/${arr[5]}.png'></div>
            <div class="horizontal-balls"><img src='https://github.com/alex-vdboogaard/8-ball-sort/images/individual-balls/${arr[6]}.png'><img src='/images/individual-balls/${arr[7]}.png'><img src='/images/individual-balls/${arr[8]}.png'><img src='/images/individual-balls/${arr[9]}.png'></div>
            <div class="horizontal-balls"><img src='https://github.com/alex-vdboogaard/8-ball-sort/images/individual-balls/${arr[10]}.png'><img src='/images/individual-balls/${arr[11]}.png'><img src='/images/individual-balls/${arr[12]}.png'><img src='/images/individual-balls/${arr[13]}.png'><img src='/images/individual-balls/${arr[14]}.png'></div>`

    document.querySelector("#random-wrapper").appendChild(wrapper);
}

function generateArr() {
    let arrOptions = [];

    for (let i = 1; i <= 15; i++) {
        arrOptions.push(i);
    }

    function getRandomFromArr() {
        var randomIndex = Math.floor(Math.random() * arrOptions.length);
        let removed = arrOptions[randomIndex];
        //swap with the last element and remove
        arrOptions[randomIndex] = arrOptions[arrOptions.length - 1];
        arrOptions.pop();
        return removed;
    }

    let random = [];
    for (let j = 0; j < 15; j++) {
        random[j] = getRandomFromArr();
    };
    return random;
}

function solveTriangle(random) {
    //make an identical array of "solid" or "stripe" entries
    let identical = [];
    let eightPos;
    for (let k = 0; k < 15; k++) {
        if (random[k] < 8) {
            identical.push("solid");
        }
        else if (random[k] > 8) {
            identical.push("stripe");
        }
        else {
            identical.push("eight");
            eightPos = k;
        }
    }
    //put the eight in the right position
    let eightRightPos = false;
    if (random[4] !== 8) {
        random[eightPos] = random[4];
        random[4] = 8;
        identical[eightPos] = identical[4];
        identical[4] = "eight";
    }
    else {
        eightRightPos = true;
    }

    //initialise how a perfect arrangement looks of solids and stripes:
    let perfect = ["solid", "stripe", "solid", "solid", "eight", "stripe", "stripe", "solid", "stripe", "solid", "solid", "stripe", "stripe", "solid", "stripe"];

    //find the indexes of the incorrect balls
    let posOfIncorrectBalls = [];
    for (let i = 0; i < 15; i++) {
        if (perfect[i] !== identical[i]) {
            posOfIncorrectBalls.push(i);
        }
    };
    let swaps;
    if (posOfIncorrectBalls) {
        swaps = posOfIncorrectBalls.length / 2;
    }
    else {
        swaps = 0;
    }
    if (swaps !== 0) {
        for (let i = 0; i < swaps; i++) {
            let pattern1 = identical[posOfIncorrectBalls[0]]; //this can be a stripe or a solid
            let val1 = posOfIncorrectBalls[0];
            for (let j = 1; j < posOfIncorrectBalls.length; j++) {
                if (identical[posOfIncorrectBalls[j]] !== pattern1) { //find the closest ball with the opposite pattern
                    let val2 = posOfIncorrectBalls[j];
                    let pattern2 = identical[posOfIncorrectBalls[j]];

                    //now we have the positions of the two balls we want to swap
                    let temp = random[val1];
                    random[val1] = random[val2];
                    random[val2] = temp;

                    //swap the identical array too
                    let tempPattern = pattern1;
                    identical[val1] = pattern2;
                    identical[val2] = tempPattern;

                    //remove those two values from posIncorrectBalls
                    posOfIncorrectBalls.splice(j, 1);
                    posOfIncorrectBalls.shift();
                    break;
                }
            }
        }
    }

    let response = {};
    response.sorted = random;
    if (eightRightPos) {
        response.swaps = swaps;
    }
    else {
        response.swaps = swaps + 1;
    }
    return response;
}

function generateExample() {
    document.querySelector("#random-wrapper").innerHTML = "";
    let myRandom = generateArr();
    showTriangle(myRandom);
    showTriangle(solveTriangle(myRandom).sorted);
};

document.querySelector("#random").addEventListener("click", generateExample);

//simulation:
function findAverage(arr) {
    const n = arr.length;
    if (n === 0) {
        return 0; // Return 0 if the array is empty
    }

    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += arr[i];
    }

    return sum / n;
}

let myChart;
function runSimulation() {
    const simulations = document.querySelector("#simulations").value;
    let hashMap = {};
    let random, response, swaps;

    for (let i = 0; i < simulations; i++) {
        random = generateArr();
        response = solveTriangle(random);
        swaps = response.swaps;

        if (!hashMap.hasOwnProperty(swaps)) {
            hashMap[swaps] = 0;
        }
        hashMap[swaps] += 1;
    }

    let keys = Object.keys(hashMap);
    let labels = [];
    let totals = [];

    keys.forEach(key => {
        labels.push(key);
        totals.push(hashMap[key]);
    });

    const ctx = document.getElementById('canvas-1000').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Number of swaps needed for ${simulations} random arrangements`,
                data: totals,
                backgroundColor: '#41B667',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    const average = findAverage(totals);
};
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#simulation").addEventListener("click", runSimulation);
});
