import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5174/'
const OUT = 'C:\\Users\\likit\\AppData\\Local\\Temp\\claude\\c--Users-likit-1percent-life-club\\9215c91d-ff57-4a4a-9ead-439260f60bfc\\scratchpad\\'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--force-prefers-reduced-motion'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1050, deviceScaleFactor: 1.5 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1200))
// scroll to the marquee ("company you keep")
await page.evaluate(() => {
  const el = [...document.querySelectorAll('*')].find(n => n.children.length === 0 && /company you keep/i.test(n.textContent))
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 260)
})
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: OUT + 'z-marquee.png' })
console.log('wrote z-marquee.png')
await browser.close().catch(() => {})
process.exit(0)
