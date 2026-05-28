const { Buffer } = require('node:buffer')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const zlib = require('node:zlib')

const sourcePath = path.join(process.cwd(), 'SPA2_FSTEC_FRONTEND_ARCHITECTURE.md')
const outputPath = path.join(process.cwd(), 'SPA2_FSTEC_FRONTEND_ARCHITECTURE.docx')

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function paragraph(text, style = 'Normal') {
  const escaped = escapeXml(text)
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`
}

function parseMarkdown(markdown) {
  const blocks = []
  let inCode = false

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd()

    if (line.startsWith('```')) {
      inCode = !inCode
      continue
    }

    if (inCode) {
      if (line.trim()) {
        blocks.push(paragraph(line, 'Code'))
      }
      continue
    }

    if (!line.trim()) {
      blocks.push(paragraph('', 'Normal'))
      continue
    }

    if (line.startsWith('# ')) {
      blocks.push(paragraph(line.slice(2), 'Title'))
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push(paragraph(line.slice(3), 'Heading1'))
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push(paragraph(line.slice(4), 'Heading2'))
      continue
    }

    if (line.startsWith('- ')) {
      blocks.push(paragraph(`• ${line.slice(2)}`, 'ListParagraph'))
      continue
    }

    const firstSpaceIndex = line.indexOf(' ')
    const firstToken = firstSpaceIndex > 0 ? line.slice(0, firstSpaceIndex) : ''
    const isNumbered = firstToken.endsWith('.')
      && firstToken.slice(0, -1).split('').every(char => char >= '0' && char <= '9')

    if (isNumbered) {
      blocks.push(paragraph(line, 'ListParagraph'))
      continue
    }

    blocks.push(paragraph(line, 'Normal'))
  }

  return blocks.join('')
}

function documentXml(body) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/></w:rPr>
    <w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="36"/></w:rPr>
    <w:pPr><w:spacing w:after="240"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="30"/></w:rPr>
    <w:pPr><w:spacing w:before="240" w:after="160"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="26"/></w:rPr>
    <w:pPr><w:spacing w:before="180" w:after="120"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="ListParagraph">
    <w:name w:val="List Paragraph"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:ind w:left="360" w:hanging="180"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Code">
    <w:name w:val="Code"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="20"/></w:rPr>
  </w:style>
</w:styles>`

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Описание архитектуры фронтенда SPA 2</dc:title>
  <dc:subject>Архитектурный документ для руководства и подготовки к требованиям ФСТЭК</dc:subject>
  <dc:creator>SPA 2 team</dc:creator>
  <cp:lastModifiedBy>SPA 2 team</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-05-28T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-05-28T00:00:00Z</dcterms:modified>
</cp:coreProperties>`

const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>SPA 2 documentation generator</Application>
</Properties>`

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) ? (0xEDB88320 ^ (value >>> 1)) : (value >>> 1)
  }
  return value >>> 0
})

function crc32(buffer) {
  let crc = 0xFFFFFFFF
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980)
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { dosDate, dosTime }
}

function createZip(files) {
  const localParts = []
  const centralParts = []
  let offset = 0
  const { dosDate, dosTime } = dosDateTime()

  for (const file of files) {
    const name = Buffer.from(file.name)
    const data = Buffer.from(file.content)
    const compressed = zlib.deflateRawSync(data)
    const crc = crc32(data)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034B50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0, 6)
    local.writeUInt16LE(8, 8)
    local.writeUInt16LE(dosTime, 10)
    local.writeUInt16LE(dosDate, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(compressed.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    localParts.push(local, name, compressed)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014B50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(8, 10)
    central.writeUInt16LE(dosTime, 12)
    central.writeUInt16LE(dosDate, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(compressed.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(offset, 42)
    centralParts.push(central, name)

    offset += local.length + name.length + compressed.length
  }

  const centralSize = centralParts.reduce((size, part) => size + part.length, 0)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054B50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([...localParts, ...centralParts, end])
}

const markdown = fs.readFileSync(sourcePath, 'utf8')
const body = parseMarkdown(markdown)
const files = [
  { name: '[Content_Types].xml', content: contentTypesXml },
  { name: '_rels/.rels', content: relsXml },
  { name: 'docProps/core.xml', content: coreXml },
  { name: 'docProps/app.xml', content: appXml },
  { name: 'word/document.xml', content: documentXml(body) },
  { name: 'word/styles.xml', content: stylesXml },
]

fs.writeFileSync(outputPath, createZip(files))
console.warn(`Generated ${outputPath}`)
