const { spawnSync } = require('node:child_process')
const process = require('node:process')

const [mode, ...playwrightArgs] = process.argv.slice(2)

if (!['all', 'screens'].includes(mode)) {
  console.error('Usage: node scripts/e2e-update.cjs <all|screens> [...playwright args]')
  process.exit(1)
}

const env = {
  ...process.env,
  E2E_UPDATE_MOCKS: mode === 'all' ? 'true' : 'false',
}

const result = spawnSync('npx', ['playwright', 'test', '--update-snapshots', ...playwrightArgs], {
  env,
  shell: true,
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

if (result.signal) {
  process.kill(process.pid, result.signal)
}

process.exit(result.status ?? 1)
