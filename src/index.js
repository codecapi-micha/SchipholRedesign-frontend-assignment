import AutoComplete from './components/autocomplete'
import styles from './scss/index.scss'

window.addEventListener('DOMContentLoaded', () => {
    const autocompleteElement = document.querySelector(AutoComplete.identifier)
    if (!autocompleteElement) {
        return
    }

    const autoCompleter = new AutoComplete(autocompleteElement)

    autoCompleter.onFlightSelected(flight => {
        document.querySelector('[data-component="flight-details"]').classList.remove('visually-hidden')
        Object.entries(flight).forEach(([key, value]) => {
            document.querySelectorAll(`[data-component="flight-detail_${key}"]`).forEach(element => element.innerHTML = value.toString())
        })
    })
})