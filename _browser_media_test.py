import asyncio,base64
from playwright.async_api import async_playwright
from pathlib import Path
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=await b.new_page()
  try:
   await page.set_content('<html><body><button>Teste</button></body></html>')
   name=Path('/mnt/data/floresta_v262_audio_fix/assets/audio/01_Menu_Carregamento/Floresta_Tema_Principal.ogg')
   encoded=base64.b64encode(name.read_bytes()).decode()
   result=await page.evaluate('''async encoded=>{const a=new Audio('data:audio/ogg;base64,'+encoded);a.volume=.05;try{await Promise.race([a.play(),new Promise((_,rej)=>setTimeout(()=>rej(Error('timeout')),6000))]);await new Promise(r=>setTimeout(r,600));const result={paused:a.paused,currentTime:a.currentTime,readyState:a.readyState,duration:a.duration};a.pause();return result;}catch(e){return {error:String(e),code:a.error?.code}}}''',encoded)
   print('BROWSER AUDIO',result,flush=True)
  except Exception as e:print('BROWSER TEST BLOCKED',repr(e)[:260],flush=True)
  await b.close()
asyncio.run(main())
