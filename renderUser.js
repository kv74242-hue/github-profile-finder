const userCard = document.querySelector('#user-card')
const reposCard = document.querySelector('#repos-card')
const historyCard = document.querySelector('#history-card')
export function renderUser(user) {
    userCard.replaceChildren()
    if (user.avatar_url?.startsWith('https://')) {
        const img = document.createElement('img')
        img.src = user.avatar_url
        img.alt = `${user.login} image`
        img.width = 150
        userCard.appendChild(img)
    }

    const name = document.createElement('h2')
    name.textContent = user.name || user.login
    userCard.appendChild(name)

    const details = document.createElement('p')
    details.textContent = `
   @${user.login} | Followers : ${user.followers} | Following : ${user.following} | ` +
        `Public repositories: ${user.public_repos}`
    userCard.appendChild(details)

    const bio = document.createElement('p')
    bio.textContent = user.bio || 'No Bio available'
    userCard.appendChild(bio)

    if (user.html_url?.startsWith('https://')) {
        const link = document.createElement('a')
        link.href = user.html_url
        link.rel = 'noopener noreferrer'
        link.target = '_blank'
        link.textContent = 'Visit Github Profile'
        userCard.appendChild(link)
    }

}

export function renderRepo(repos, emptyMessage = 'No public repositories found') {
    reposCard.replaceChildren()

    if (repos.length === 0) {
        reposCard.textContent = emptyMessage
        return
    }
    for (let repo of repos) {
        const repoCard = document.createElement('article')
        const repoName = document.createElement('h3')
        repoName.textContent = repo.name || 'No Repo Available'
        if (repo.html_url?.startsWith('https://')) {
            const repoLink = document.createElement('a')
            repoLink.textContent = repoName.textContent
            repoLink.rel = 'noopener noreferrer'
            repoLink.href = repo.html_url
            repoLink.target = '_blank'
            repoName.replaceChildren(repoLink)
        }
        repoCard.appendChild(repoName)

        const repoDescription = document.createElement('p')
        repoDescription.textContent = repo.description || 'No description available'
        repoCard.appendChild(repoDescription)

        const repoLanguage = document.createElement('p')
        repoLanguage.textContent = `Primary Language: ${repo.language || 'Primary Language Not available'}`
        repoCard.appendChild(repoLanguage)

        const repoDetails = document.createElement('p')
        repoDetails.textContent = `Stars : ${repo.stargazers_count} | Fork Count : ${repo.forks_count}`
        repoCard.appendChild(repoDetails)
        reposCard.appendChild(repoCard)
    }
}

export function renderHistory(usernames) {
    historyCard.replaceChildren()

    const history = Array.isArray(usernames) ? usernames : []
    history.forEach((username) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = username
        button.dataset.username = username
        historyCard.appendChild(button)
    })
}