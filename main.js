function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let promise = Promise.resolve();

promise.then(()=>delay(1000)).then(console.log())