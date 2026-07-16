import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5174/'
const OUT = 'C:\\Users\\likit\\AppData\\Local\\Temp\\claude\\c--Users-likit-1percent-life-club\\9215c91d-ff57-4a4a-9ead-439260f60bfc\\scratchpad\\'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-prefers-reduced-motion'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1200))

async function region(name, selector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, selector)
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: OUT + name })
  console.log('wrote', name)
}

// Hero (top of page)
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: OUT + 'z-hero.png' })
console.log('wrote z-hero.png')

await region('z-pillars.png', '#pillars')
await region('z-cta.png', '#join')

await browser.close()
console.log('done')
