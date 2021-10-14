import AutoComplete from './components/autocomplete'
window.addEventListener('DOMContentLoaded', () => {
    AutoComplete.install(document.querySelector('[data-autocomplete]'))
})