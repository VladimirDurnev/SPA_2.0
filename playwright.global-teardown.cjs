const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

const e2eRoot = path.join(__dirname, 'apps')

function normalizeHeaders(headers = []) {
  return Object.fromEntries(headers.map(({ name, value }) => [name, value]))
}

function parseJsonEntry(entry) {
  const content = entry?.response?.content
  const mimeType = content?.mimeType ?? ''
  const text = content?.text

  if (!text || !mimeType.includes('application/json')) {
    return null
  }

  try {
    return {
      request: {
        method: entry?.request?.method ?? '',
        url: entry?.request?.url ?? '',
        queryString: entry?.request?.queryString ?? [],
        headers: normalizeHeaders(entry?.request?.headers),
        postData: entry?.request?.postData,
      },
      response: {
        status: entry?.response?.status,
        statusText: entry?.response?.statusText,
        contentType: mimeType,
        headers: normalizeHeaders(entry?.response?.headers),
        body: JSON.parse(text),
      },
    }
  }
  catch {
    return null
  }
}

function writeJsonMock(filePath, har) {
  const jsonEntriesByRequest = new Map()

  for (const entry of har.log.entries) {
    const jsonEntry = parseJsonEntry(entry)

    if (jsonEntry) {
      const requestKey = `${jsonEntry.request.method} ${jsonEntry.request.url}`
      jsonEntriesByRequest.set(requestKey, jsonEntry)
    }
  }

  if (jsonEntriesByRequest.size === 0) {
    return
  }

  const jsonPath = filePath.replace(/\.har$/i, '.json')
  const jsonMock = {
    entries: [...jsonEntriesByRequest.values()],
  }

  fs.writeFileSync(jsonPath, `${JSON.stringify(jsonMock, null, 2)}\n`)
}

function processHarFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const har = JSON.parse(content)

  writeJsonMock(filePath, har)
  fs.writeFileSync(filePath, `${JSON.stringify(har, null, 2)}\n`)
}

function formatHarFiles(directory) {
  if (!fs.existsSync(directory)) {
    return
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      formatHarFiles(entryPath)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.har') && entryPath.includes(`${path.sep}__e2e__${path.sep}`)) {
      processHarFile(entryPath)
    }
  }
}

module.exports = async function globalTeardown() {
  if (process.env.E2E_UPDATE_MOCKS !== 'true') {
    return
  }

  formatHarFiles(e2eRoot)
}

if (require.main === module) {
  formatHarFiles(e2eRoot)
}
