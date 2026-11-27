export function getFilteredAndSortedRepos(repos, searchText, sortBy) {
   const searchTerm = searchText.trim().toLowerCase()
   const filteredrepos = searchTerm
      ? repos.filter((repo) => (repo.name || '').toLowerCase().includes(searchTerm))
      : repos

   const sortedRepos = [...filteredrepos]

   sortedRepos.sort((a, b) => {
      if (sortBy === 'most stars' || sortBy === 'stars') {
         return (b.stargazers_count || 0) - (a.stargazers_count || 0)
      }

      return (new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
   })
   return sortedRepos
}
