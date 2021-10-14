export default function constrain (value, low, high) {
    return Math.min(Math.max(parseInt(value), low), high)
}