import { renderUser, renderRepo, renderHistory } from "./modules/renderUser.js"
import { fetchGithubUser, fetchRepos } from "./modules/fetchprofile.js"
import { getFilteredAndSortedRepos } from "./modules/repoFilters.js"
import { loadHistory, saveToHistory } from "./modules/storage.js"
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const repoSearchInput = document.querySelector('#repo-search-input')
const categories = document.querySelector('#categories')
const repoControls = document.querySelector('#repo-controls')
const status = document.querySelector('#status')
const userCard = document.querySelector('#user-card')
const reposCard = document.querySelector('#repos-card')
const historyCard = document.querySelector('#history-card')
let currentRepos = []
let currentController = null

function setStatus(message, state = '') {
    status.textContent = message
    status.dataset.state = state
}

async function searchUser(username, signal) {
    userCard.replaceChildren()
    reposCard.replaceChildren()
    if (!username) {
        setStatus('Please enter a valid GitHub username.', 'error')
        return null
    }
    if (!navigator.onLine) {
        setStatus('You are offline. Check your connection and try again.', 'error')
        return null
    }

    setStatus('Loading...', 'loading')

    try {
        const user = await fetchGithubUser(username, signal)
        renderUser(user)
        const repos = await fetchRepos(username, signal)
        setStatus('')
        return { user, repos }
    } catch (error) {
        if (error.name !== 'AbortError') {
            userCard.replaceChildren()
            reposCard.replaceChildren()
            if (error instanceof TypeError) {
                setStatus('Network error. Check your connection and try again.', 'error')
            } else {

                setStatus(error.message, 'error')
            }
        }
        return null
    }
}

function updateRepoView() {
    const getFilteredRepos = getFilteredAndSortedRepos(currentRepos, repoSearchInput.value.trim(), categories.value)
    if (currentRepos.length === 0) {
        renderRepo([], 'No public repositories found')
    } else if (getFilteredRepos.length === 0) {
        renderRepo([], 'No repositories match your filter')
    } else {
        renderRepo(getFilteredRepos)
    }
}



window.addEventListener('offline', () => {
    setStatus('You are offline. Check your connection and try again.', 'error')
})

window.addEventListener('online', () => {
    if (status.textContent === 'You are offline. Check your connection and try again.') {
        setStatus('You are back online.', 'success')
    }
})

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const username = searchInput.value.trim()
    runSearch(username)
})

async function runSearch(username) {

    if (currentController) {
        currentController.abort()
    }
    currentController = new AbortController()
    const signal = currentController.signal

    currentRepos = []
    repoSearchInput.value = ''
    categories.selectedIndex = 0
    repoControls.hidden = true

    const result = await searchUser(username, signal)
    if (result !== null && result.repos.length > 0) {
        currentRepos = result.repos
        repoControls.hidden = false
        updateRepoView()

    } else if (result !== null) {
        renderRepo([], 'No public repositories found')
    }

    if (result !== null) {
        const updatedHistory = saveToHistory(result.user.login)
        renderHistory(updatedHistory)
    }

}

repoSearchInput.addEventListener('input', updateRepoView)
categories.addEventListener('change', updateRepoView)
historyCard.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-username]')
    if (!button) {
        return
    }

    const username = button.dataset.username
    searchInput.value = username
    runSearch(username)
})
renderHistory(loadHistory())

