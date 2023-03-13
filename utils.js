
const debounce = (func, delay = 1000) => {
    let timeoutId;
    // ...args take all arguments of func 
    return (...args) => {
        // check if timeout exists and after every new key press reset the timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() =>{
            func.apply(null , args);
        },delay);
    };
};
