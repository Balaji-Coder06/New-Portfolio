import { useState, useEffect, useCallback } from 'react';

// Cache removed for auto-sync on every visit

export function useDeveloperStats() {
  const [stats, setStats] = useState({
    github: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const fetchAllStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch live data array
      const [ghResult, ghReposResult] = await Promise.allSettled([
        fetch('https://api.github.com/users/Balaji-Coder06').then(r => r.ok ? r.json() : null),
        fetch('https://api.github.com/users/Balaji-Coder06/repos?sort=updated&per_page=10').then(r => r.ok ? r.json() : []),
      ]);

      // Process GitHub
      let githubData = null;
      if (ghResult.status === 'fulfilled' && ghResult.value) {
        const user = ghResult.value;
        const repos = ghReposResult.status === 'fulfilled' && Array.isArray(ghReposResult.value) ? ghReposResult.value : [];
        const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

        const langMap = {};
        repos.forEach(r => {
          if (r.language) {
            langMap[r.language] = (langMap[r.language] || 0) + 1;
          }
        });
        const totalLangs = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
        const languages = Object.entries(langMap).map(([name, count]) => ({
          name,
          percent: Math.round((count / totalLangs) * 100),
        })).sort((a, b) => b.percent - a.percent);

        githubData = {
          username: user.login,
          name: user.name || 'S Balaji',
          avatar: user.avatar_url,
          bio: user.bio || 'Computer Science Engineering Student & Full Stack Engineer',
          publicRepos: user.public_repos,
          followers: user.followers,
          following: user.following,
          totalStars: totalStars,
          repos: repos.slice(0, 4).map(r => ({
            id: r.id,
            name: r.name,
            url: r.html_url,
            stars: r.stargazers_count,
            forks: r.forks_count,
            description: r.description || 'Public GitHub project',
            language: r.language
          })),
          languages: languages.length > 0 ? languages : [
            { name: 'JavaScript / React', percent: 45 },
            { name: 'HTML5 & CSS3', percent: 30 },
            { name: 'C / C++', percent: 15 },
            { name: 'Python', percent: 10 }
          ]
        };
      }

      const freshData = {
        github: githubData,
      };

      const now = new Date();
      setStats(freshData);
      setLastSynced(now);

    } catch (err) {
      console.error('Error fetching developer stats:', err);
      setError('Network issue fetching live API stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  return {
    stats,
    loading,
    error,
    lastSynced,
    refetch: () => fetchAllStats(true)
  };
}
