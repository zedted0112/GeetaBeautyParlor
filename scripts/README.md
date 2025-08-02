# Scripts Directory

This directory contains utility scripts for the GeethaBeautyParlor project.

## 🚀 Commit Workflow

### Quick Commit
```bash
npm run commit
```

### Check Status
```bash
npm run commit:check
```

### Manual Usage
```bash
node scripts/commit-changes.js
```

## 📝 How It Works

1. **Status Check**: Shows all modified, added, and deleted files
2. **Staging**: Automatically stages all changes with `git add .`
3. **Commit Message**: Reads from `COMMIT_MESSAGE.md` in the root directory
4. **Commit**: Creates a commit using the detailed message
5. **Status Report**: Shows final status and latest commit info

## 📋 Commit Message Format

Update `COMMIT_MESSAGE.md` in the root directory with your commit details:

```markdown
feat: Brief description of changes

## 🎨 Detailed Description

### Changes Made
- List of specific changes
- Technical improvements
- Files modified

## 🎯 Impact
- User experience improvements
- Performance enhancements
- Bug fixes
```

## 🎨 Features

- **Colorful output** with chalk for better readability
- **Status icons** for different file changes (📝, ➕, 🗑️)
- **Error handling** with helpful suggestions
- **Branch information** display
- **Clean workflow** with automatic staging

## 🔧 Requirements

- Node.js with ES modules support
- `chalk` package for colored output
- Git repository initialized 