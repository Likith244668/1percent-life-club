import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5174/'
const OUT = 'C:\\Users\\likit\\AppData\\Local\\Temp\\claude\\c--Users-likit-1percent-life-club\\9215c91d-ff57-4a4a-9ead-439260f60bfc\\scratchpad\\'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-prefers-reduced-motion'],
})

async function shoot(name, width, height, fullPage) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1400))
  await page.screenshot({ path: OUT + name, fullPage })
  console.log('wrote', name)
  await page.close()
}

await shoot('desktop-full.png', 1440, 900, true)
await shoot('mobile-full.png', 390, 844, true)

await browser.close()
console.log('done')
