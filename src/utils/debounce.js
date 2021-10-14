export default function debounce (func, timeout = 250) {
    let timer
    return (...functionArguments) => {
        clearTimeout(timer)
        timer = setTimeout(() => func.apply(this, functionArguments), timeout)
    }
}