import { spawnSync } from 'node:child_process'

const [, , scriptName, ...forwardedArguments] = process.argv

if (!scriptName) {
  console.error('A workspace script name is required')
  process.exit(1)
}

const workspaceNames = ['frontend', 'backend']
const npmExecutable = process.platform === 'win32' ? 'npm' : 'npm'

for (const workspaceName of workspaceNames) {
  const commandArguments = ['run', scriptName, '--workspace', workspaceName]

  if (forwardedArguments.length > 0) {
    commandArguments.push('--', ...forwardedArguments)
  }

  const runResult = spawnSync(
    npmExecutable,
    commandArguments,
    {
      shell: process.platform === 'win32',
      stdio: 'inherit'
    },
  )

  if (runResult.error) {
    console.error(runResult.error)
    process.exit(1)
  }

  if (runResult.status !== 0) {
    process.exit(runResult.status ?? 1)
  }
}
