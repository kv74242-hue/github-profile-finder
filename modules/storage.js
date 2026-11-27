const STORAGE_KEY = 'github-explorer:recent-searches'
export function loadHistory() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
        return []
    }
    let parsed
    try {
        parsed = JSON.parse(raw)

    } catch (error) {
        localStorage.removeItem(STORAGE_KEY)
        return []
    }

    if (!Array.isArray(parsed)) {
        localStorage.removeItem(STORAGE_KEY)
        return []
    }

    return parsed
        .filter((parse) => typeof parse === 'string' && parse.trim())
        .map((parse) => parse.trim())
        .slice(0, 5)
}

export function saveToHistory(username) {
    const normalUsername = username.trim()
    if (!normalUsername) {
        return loadHistory()
    }

    const history = loadHistory()
    const updatedHistory = [
        normalUsername, ...history.filter((entry) => entry.toLowerCase() !== normalUsername.toLowerCase())
    ].slice(0, 5)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    return updatedHistory
}