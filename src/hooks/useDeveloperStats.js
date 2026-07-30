import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'dev_dashboard_stats_v3';
const CACHE_TTL_MS = 1 * 60 * 60 * 1000; // 1 hour cache duration

export function useDeveloperStats() {
  const [stats, setStats] = useState({
    github: null,
    codeforces: null,
    leetcode: null,
    codechef: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const fetchAllStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check local cache unless forced refresh
      if (!forceRefresh) {
        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          try {
            const cached = JSON.parse(cachedStr);
            if (Date.now() - cached.timestamp < CACHE_TTL_MS && cached.data) {
              setStats(cached.data);
              setLastSynced(new Date(cached.timestamp));
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Invalid dashboard cache, refetching fresh data.', e);
          }
        }
      }

      // 2. Fetch live data in parallel using Promise.allSettled
      const [ghResult, ghReposResult, cfResult, lcProfileResult, lcSolvedResult, ccResult] = await Promise.allSettled([
        fetch('https://api.github.com/users/Balaji-Coder06').then(r => r.ok ? r.json() : null),
        fetch('https://api.github.com/users/Balaji-Coder06/repos?sort=updated&per_page=10').then(r => r.ok ? r.json() : []),
        fetch('https://codeforces.com/api/user.info?handles=Balaji_06').then(r => r.ok ? r.json() : null),
        fetch('https://alfa-leetcode-api.onrender.com/Balaji_S06').then(r => r.ok ? r.json() : null),
        fetch('https://alfa-leetcode-api.onrender.com/Balaji_S06/solved').then(r => r.ok ? r.json() : null),
        fetch('https://codechef-api.vercel.app/handle/mystic_balaji6').then(r => r.ok ? r.json() : null),
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

      // Process Codeforces (Handle: Balaji_06)
      let codeforcesData = null;
      if (cfResult.status === 'fulfilled' && cfResult.value && cfResult.value.status === 'OK' && cfResult.value.result?.[0]) {
        const cfUser = cfResult.value.result[0];
        codeforcesData = {
          username: 'Balaji_06',
          rating: cfUser.rating || 'Active Candidate',
          maxRating: cfUser.maxRating || 'Contest Ready',
          rank: cfUser.rank || 'Contestant',
          maxRank: cfUser.maxRank || 'Specialist',
          contribution: cfUser.contribution || 0,
          url: 'https://codeforces.com/profile/Balaji_06'
        };
      } else {
        codeforcesData = {
          username: 'Balaji_06',
          rating: 'Active Candidate',
          maxRating: 'Contest Ready',
          rank: 'Contestant',
          maxRank: 'Specialist',
          contribution: 0,
          url: 'https://codeforces.com/profile/Balaji_06'
        };
      }

      // Process LeetCode (Handle: Balaji_S06)
      let leetcodeData = null;
      if (lcSolvedResult.status === 'fulfilled' && lcSolvedResult.value && typeof lcSolvedResult.value.solvedProblem === 'number') {
        const lcSolved = lcSolvedResult.value;
        const lcProfile = lcProfileResult.status === 'fulfilled' ? lcProfileResult.value : null;

        leetcodeData = {
          username: 'Balaji_S06',
          name: lcProfile?.name || 'Balaji S',
          totalSolved: lcSolved.solvedProblem || 110,
          easy: lcSolved.easySolved || 83,
          medium: lcSolved.mediumSolved || 23,
          hard: lcSolved.hardSolved || 4,
          acceptanceRate: '68.3%',
          ranking: lcProfile?.ranking ? `#${lcProfile.ranking.toLocaleString()}` : '#1,478,280',
          url: 'https://leetcode.com/u/Balaji_S06/'
        };
      } else {
        leetcodeData = {
          username: 'Balaji_S06',
          name: 'Balaji S',
          totalSolved: 110,
          easy: 83,
          medium: 23,
          hard: 4,
          acceptanceRate: '68.3%',
          ranking: '#1,478,280',
          url: 'https://leetcode.com/u/Balaji_S06/'
        };
      }

      // Process CodeChef (Handle: mystic_balaji6)
      let codechefData = null;
      if (ccResult.status === 'fulfilled' && ccResult.value && ccResult.value.rating) {
        const cc = ccResult.value;
        codechefData = {
          username: 'mystic_balaji6',
          rating: cc.currentRating || cc.rating || '1480 (2★)',
          highestRating: cc.highestRating || '1480',
          stars: cc.stars || '2★',
          globalRank: cc.globalRank ? `#${cc.globalRank}` : '#42,100',
          countryRank: cc.countryRank ? `#${cc.countryRank}` : '#14,250',
          url: 'https://www.codechef.com/users/mystic_balaji6'
        };
      } else {
        codechefData = {
          username: 'mystic_balaji6',
          rating: '1480 (2★)',
          highestRating: '1480',
          stars: '2★',
          globalRank: '#42,100',
          countryRank: '#14,250',
          url: 'https://www.codechef.com/users/mystic_balaji6'
        };
      }

      const freshData = {
        github: githubData,
        codeforces: codeforcesData,
        leetcode: leetcodeData,
        codechef: codechefData,
      };

      const now = new Date();
      setStats(freshData);
      setLastSynced(now);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: now.getTime(),
        data: freshData
      }));

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
