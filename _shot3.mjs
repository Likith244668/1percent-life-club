import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5174/'
const OUT = 'C:\\Users\\likit\\AppData\\Local\\Temp\\claude\\c--Users-likit-1percent-life-club\\9215c91d-ff57-4a4a-9ead-439260f60bfc\\scratchpad\\'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-prefers-reduced-motion'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1500, deviceScaleFactor: 1.5 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1400))
await page.screenshot({ path: OUT + 'z-align.png' })
console.log('wrote z-align.png')
await browser.close().catch(() => {})
process.exit(0)
