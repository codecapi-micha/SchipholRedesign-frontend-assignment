import debounce from '../utils/debounce'
import constrain from '../utils/constrain'

function AutoComplete () {
    this.container = null
    this.itemContainer = null
    this.timer = null
    this.input = null
    this.items = []
    this.activeIndex = 0
    this.keyPress = debounce(() => {
        if (!this.input.value) {
            this.items = []
            return
        }
        fetch('/api/flights.json?query=' + this.input.value).then(console.log)
        // serverMock(this.input.value).then(items => {
        //     this.items = items
        //     this.render()
        // })
        this.render()
    }, 200)
    this.keyDown = ({keyCode}) => {
        switch (keyCode) {
        case 38:
            this.setActiveIndex(this.activeIndex - 1)
            break
        case 40:
            this.setActiveIndex(this.activeIndex + 1)
            break
        }
    }
    this.setActiveIndex = index => {
        this.activeIndex = constrain(index, 0, this.items.length - 1)
        this.render()
    }
    this.clear = () => {
        this.items = []
        this.render()
    }

    this.render = () => {
        const html = this.items.map((item, index) => {
            return `<li>${index === this.activeIndex ? '.' : ''}${item.flightNumber}</li>`
        }).join('\n')
        console.log(html)
        this.itemContainer.innerHTML = html
    }

    return this
}

AutoComplete.identifier = '[data-autocomplete]'
AutoComplete.install = function (element) {
    const autoComplete = new this()
    autoComplete.container = element
    autoComplete.input = autoComplete.container.querySelector('input[type="text"]')
    autoComplete.input.addEventListener('keypress', event => autoComplete.keyPress(event))
    autoComplete.input.addEventListener('keydown', event => autoComplete.keyDown(event))
    autoComplete.itemContainer = autoComplete.container.querySelector('[data-autocomplete-suggestions]')
}

export { AutoComplete as default }