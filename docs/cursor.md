

🧠 Git Hygiene Enhancements (Developer Painkillers)

🔥 You already have:

✅ Clean commit via one command
✅ Commit from a Markdown template
✅ Icons, visuals, logs — chef’s kiss

Now let’s add real-world armor — the kind that saves you from yelling “WTF Git!?”

⸻

1. 🛑 Abort if Committing on main or master

Prevent accidents directly:

if (['main', 'master'].includes(branch.trim())) {
  console.log(chalk.red('🚫 Direct commits to main/master are not allowed.'));
  process.exit(1);
}

🔒 Save your production from one sleepy commit.

⸻

2. 📂 Detect & Warn on Dirty Stash

Git stash hiding local changes? Warn the dev:

const { stdout: stashList } = await execAsync('git stash list');
if (stashList.trim()) {
  console.log(chalk.yellow('⚠️  You have stashed changes. Don’t forget them!'));
}


⸻

3. 🧽 Auto-clean .DS_Store and node_modules from Git

Sometimes devs accidentally add junk files.

await execAsync('git rm -r --cached .DS_Store node_modules .env || true');

👣 Then auto-write/update .gitignore with safety lines.

⸻

4. 🧠 Auto-branch Reminder (If not following naming guide)

Warn if branch doesn’t start with feat/, fix/, chore/, etc:

if (!/^feat\/|fix\/|chore\/|refactor\//.test(branch.trim())) {
  console.log(chalk.yellow(`⚠️  Branch name "${branch.trim()}" doesn’t follow naming convention.`));
}


⸻

5. 🕶️ Show a Mini Git Log Graph

Give visibility:

git log --oneline --graph --decorate -n 5

📜 In the script:

const { stdout: miniLog } = await execAsync('git log --oneline --graph --decorate -n 5');
console.log(chalk.cyan('\n🔁 Recent commits:'));
console.log(chalk.gray(miniLog));


⸻

6. 🧯 Auto-rollback on Failed Commit

If git commit fails, revert staged files:

await execAsync('git reset');
console.log(chalk.red('❌ Commit failed — rolled back staged changes.'));


⸻

7. 🧪 Optional AI-Check (if online): suggestCommitMsg()

Preview your commit with auto-summarizer (if no message present):

// Placeholder idea: Use `git diff` and hit OpenAI or local LLM API
const diff = await execAsync('git diff --cached');
const aiMsg = await getAICommitMessage(diff.stdout); // hypothetical
console.log(`🤖 AI suggested: ${aiMsg}`);

This could be opt-in via --ai flag.

⸻

8. 🔐 Signed Commits Enforcement Reminder

If not using git commit -S, remind:

const { stdout: gpg } = await execAsync('git config commit.gpgSign');
if (gpg.trim() !== 'true') {
  console.log(chalk.yellow('💡 Tip: You’re not using signed commits. Consider enabling: git config commit.gpgSign true'));
}


⸻

📦 Add These as Optional Flags:

Use --strict, --push, --ai, --no-lint to control behavior.

npm run commit -- --strict --push

Can parse process.argv easily and trigger features.

⸻

Final Result?

One script. Zero git regrets.
Every commit: safe, smart, structured, signed, and synced.

⸻

