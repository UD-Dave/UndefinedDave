var count = 0;

var play = setInterval(() => {
    console.log(`hi - ${count + 1}`)
    count += 1;
    console.log(play);
    if(count === 8) {
        console.log(play);
        clearInterval(play);
    };
}, 1000);