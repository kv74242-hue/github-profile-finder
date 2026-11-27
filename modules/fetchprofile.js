export async function fetchGithubUser(username, signal) {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`,
        { signal }

    )
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('User not found')
        }
        if (response.status === 403) {
            throw new Error(`API Hourly Limit Reached`)
        }
        throw new Error(`Request Failed (HTTP ${response.status})`)
    }

    return response.json()
}

export async function fetchRepos(username, signal) {
    const repoResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=30&sort=updated`,
        { signal }
    )

    if (!repoResponse.ok) {
        if (repoResponse.status === 404) {
            throw new Error(`Repo not found`)
        }
        if (repoResponse.status === 403) {
            throw new Error(`API Hourly limit reached`)
        }
        throw new Error(`Request Failed (HTTP ${repoResponse.status})`)
    }

    return repoResponse.json()
}