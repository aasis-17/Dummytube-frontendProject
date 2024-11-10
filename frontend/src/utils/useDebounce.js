
const useDebounce = (fun, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() =>{
      fun(...args)
      }, delay)  
    }
  }

  export default useDebounce