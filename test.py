import sys

path = r'e:\My_Projects\Ongoing (Latest)\Portfolio 2\src\components\sections\DeveloperDashboardSection.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = lines[:75] + lines[78:176]

replacement = """          {/* GitHub Contributions */}
          <Card className=\"p-5 h-full flex items-center justify-between hover:border-violet-500/50\">
            <div className=\"flex items-center gap-4\">
              <div className=\"w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0\">
                <Activity className=\"w-6 h-6\" />
              </div>
              <div>
                <span className=\"text-[11px] font-mono text-neutral-400 uppercase block\">Total Commits</span>
                <span className=\"text-2xl font-black text-neutral-100\">
                  {loading ? <span className=\"animate-pulse\">...</span> : <AnimatedCounter value={githubContributions.totalContributions ?? 196} />}
                </span>
              </div>
            </div>
          </Card>\n"""

new_lines.append(replacement)
new_lines.extend(lines[191:443])
new_lines.extend(lines[622:])

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
