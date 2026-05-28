const { spawn } = require('node:child_process')
const path = require('node:path')
const process = require('node:process')

const reportPath = path.join(process.cwd(), 'coverage', 'apps', 'index.html')

const commands = {
  darwin: ['open', [reportPath]],
  linux: ['xdg-open', [reportPath]],
  win32: ['cmd', ['/c', 'start', '', reportPath]],
}

const [command, args] = commands[process.platform] ?? commands.linux

spawn(command, args, {
  detached: true,
  stdio: 'ignore',
}).unref()
