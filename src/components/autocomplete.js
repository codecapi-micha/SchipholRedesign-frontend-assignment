import debounce from '../utils/debounce'
import constrain from '../utils/constrain'

class AutoComplete {
    static identifier = '[data-component="rw-autocomplete-element"]'

    #container = null
    #input = null
    #items = []
    #activeIndex = -1
    #handlers = []

    constructor(element) {
        this.#container = element
        this.#input = this.#container.querySelector('[data-input="true"]')
        this.#input.addEventListener('keydown', event => this.#keyDown(event))
        this.itemContainer = this.#container.querySelector('[data-component="rw-autocomplete-suggestions"]')
    }

    #search = debounce(() => {
        if (this.#input.value === '') {
            this.#clear()
            return
        }
        const query = this.#input.value.toLowerCase()
        fetch('/api/flights.json?query=' + query)
            .then(response => response.json())
            .then(({ flights }) => {
                // temporary filtering and slicing on the client since we dont have a real server
                return flights.filter(flight => flight.airport.toLowerCase().includes(query)).slice(0, 5)
            }).then(flights => {
                this.#items = flights
                this.#setActiveIndex(-1)
                this.#render()
            })
    }, 200)

    #keyDown ({code}) {
        switch (code) {
        case 'ArrowLeft':
        case 'ArrowRight':
            break
        case 'ArrowUp':
            this.#setActiveIndex(this.#activeIndex - 1)
            break
        case 'ArrowDown':
            this.#setActiveIndex(this.#activeIndex + 1)
            break
        case 'Enter':
            if (this.#items.length === 0) {
                return
            }
            this.#selectFlight(this.#items[this.#activeIndex])
            break
        default:
            this.#search()
            break
        }
    }

    #selectFlight (flight) {
        this.#input.value = this.getFlightTemplate(flight)
        this.#handlers.forEach(fn => fn(flight, this))
    }

    #setActiveIndex (index) {
        this.#activeIndex = constrain(index, 0, this.#items.length - 1)
        this.#render()
    }

    #clear () {
        this.#items = []
        this.#setActiveIndex(-1)
        this.#render()
    }

    onFlightSelected (fn) {
        this.#handlers.push(fn)
    }

    getFlightTemplate (flight) {
        const { flightNumber, airport, expectedTime } = flight
        return `${flightNumber} - ${airport} (${expectedTime})`
    }

    #render () {
        if (this.#items.length === 0 && this.#input.value !== '') {
            this.#setItemContainerHTML('<em>No items found</em>')
            return
        }
        const html = this.#items.map((flight, index) => {
            const classes = ['c-autocomplete__suggestion']
            if (index === this.#activeIndex) {
                classes.push('c-autocomplete__suggestion--active')
            }
            return `<li class="${classes.join(' ')}">${this.getFlightTemplate(flight)}</li>`
        }).join('\n')
        this.#setItemContainerHTML(html)
    }

    #setItemContainerHTML (html) {
        this.itemContainer.innerHTML = html
    }
}

export { AutoComplete as default }