#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import fs from 'fs';

const execAsync = promisify(exec);

async function commitChanges() {
  console.log(chalk.blue('🚀 Preparing clean commit for GeethaBeautyParlor...\n'));
  
  try {
    // Check git status
    console.log(chalk.cyan('📊 Checking git status...'));
    const { stdout: status } = await execAsync('git status --porcelain');
    
    if (!status.trim()) {
      console.log(chalk.green('✅ No changes to commit'));
      return;
    }
    
    console.log(chalk.yellow('📝 Changes detected:'));
    const changes = status.trim().split('\n');
    changes.forEach(change => {
      const [status, file] = change.split(' ');
      const statusIcon = status === 'M' ? '📝' : status === 'A' ? '➕' : status === 'D' ? '🗑️' : '❓';
      console.log(chalk.gray(`  ${statusIcon} ${file}`));
    });
    
    // Add all changes
    console.log(chalk.cyan('\n📦 Staging changes...'));
    await execAsync('git add .');
    console.log(chalk.green('✅ Changes staged'));
    
    // Read commit message
    console.log(chalk.cyan('\n📝 Reading commit message...'));
    const commitMessage = fs.readFileSync('COMMIT_MESSAGE.md', 'utf8');
    const firstLine = commitMessage.split('\n')[0];
    
    console.log(chalk.yellow('📋 Commit message:'));
    console.log(chalk.gray(firstLine));
    
    // Commit
    console.log(chalk.cyan('\n💾 Committing changes...'));
    await execAsync(`git commit -F COMMIT_MESSAGE.md`);
    console.log(chalk.green('✅ Changes committed successfully!'));
    
    // Show final status
    console.log(chalk.cyan('\n📊 Final status:'));
    const { stdout: finalStatus } = await execAsync('git status --porcelain');
    if (!finalStatus.trim()) {
      console.log(chalk.green('✅ Working directory is clean'));
    } else {
      console.log(chalk.yellow('⚠️  Some changes remain:'));
      console.log(chalk.gray(finalStatus));
    }
    
    // Show commit info
    console.log(chalk.cyan('\n📋 Latest commit:'));
    const { stdout: commitInfo } = await execAsync('git log --oneline -1');
    console.log(chalk.gray(commitInfo.trim()));
    
    // Show branch info
    console.log(chalk.cyan('\n🌿 Current branch:'));
    const { stdout: branchInfo } = await execAsync('git branch --show-current');
    console.log(chalk.gray(branchInfo.trim()));
    
  } catch (error) {
    console.log(chalk.red(`❌ Error during commit: ${error.message}`));
    
    if (error.message.includes('not a git repository')) {
      console.log(chalk.yellow('💡 Initialize git repository first:'));
      console.log(chalk.gray('  git init'));
      console.log(chalk.gray('  git add .'));
      console.log(chalk.gray('  git commit -m "Initial commit"'));
    }
  }
}

// Run the commit process
commitChanges().catch(console.error); 