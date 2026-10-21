import asyncio, json
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream'])
  page=await browser.new_page(viewport={'width':1280,'height':720})
  messages=[]
  page.on('pageerror', lambda e: messages.append(('pageerror',str(e)[:250])))
  page.on('console', lambda msg: messages.append(('console-'+msg.type,msg.text[:180])) if msg.type=='error' else None)
  print('Opening game...',flush=True)
  try:
   await page.goto('http://127.0.0.1:8765/Jogo.html',wait_until='domcontentloaded',timeout=65000)
   print('DOM ready',flush=True)
   try:
    await page.wait_for_function('window.FlorestaAudioV262 && window.gameFront172',timeout=30000)
    print('Audio API ready',flush=True)
   except Exception as e:print('api timeout',str(e)[:180],flush=True)
   print('Front',await page.evaluate('({ready:window.gameFront172?.ready,started:window.gameFront172?.started,view:window.gameFront172?.shell?.dataset.view,version:window.FlorestaBuild?.version,audio:window.FlorestaAudioV262?.status,atmos:window.FlorestaAtmosferaV261?.status})'),flush=True)
   if await page.locator('#f172Menu').count():
    await page.locator('#f172Menu').click(position={'x':600,'y':240},timeout=5000,force=True)
    await page.wait_for_timeout(2500)
    print('Post user menu gesture',await page.evaluate('({audio:window.FlorestaAudioV262?.status,menuHidden:window.gameFront172?.shell?.hidden})'),flush=True)
   if await page.locator('#f172Actions [data-action="new"]').count():
    await page.locator('#f172Actions [data-action="new"]').click(timeout=5000,force=True)
    await page.wait_for_timeout(700)
    print('New game clicked',await page.evaluate('({panel:document.querySelector("#f172PanelTitle")?.textContent, ready:window.gameFront172?.ready,view:window.gameFront172?.shell?.dataset.view})'),flush=True)
  except Exception as e:print('Exception',repr(e),flush=True)
  print('ERRORS',json.dumps(messages[:15],ensure_ascii=False),flush=True)
  await browser.close()
asyncio.run(main())
