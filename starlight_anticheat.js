/*
StarLight Anticheat v5 - Webgame version
By Aztherix Software
- Please follow the LICENSE.

For installation guid
*/

(function(global){

  class StarLightAC {
    constructor(opts = {}){
      // Site owner settings
      this.settings = Object.assign({
        blockDevTools: true,          // true = block F12 / shortcuts
        banOnConsoleExec: true,       // true = ban user on console tamper, false = warn
        detectConsoleExec: true,
        detectDevTools: true,
        detectKeybinds: true,
        detectClipboard: true,
        detectCanvasWebGL: true,
        detectDOMMutation: true,
        detectTiming: true,
        detectionInterval: 1000,
        banDurationMs: 48*60*60*1000,
        telemetryFlushInterval: 5000,
        serverBase: '/',              // Vercel base URL
        webhookURL: null              // Discord webhook for ban notifications
      }, opts);

      this.clientId = opts.clientId || this._generateClientId();
      this.banInfo = null;
      this.reportQueue = [];

      this._showWatermark();
      this._initBanCheck();
    }

    _showWatermark(){
      console.log('%c███████╗████████╗ █████╗ ██████╗ ██╗     ███████╗\\n██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝\\n███████╗   ██║   ███████║██████╔╝██║     █████╗  \\n╚════██║   ██║   ██╔══██║██╔═══╝ ██║     ██╔══╝  \\n███████║   ██║   ██║  ██║██║     ███████╗███████╗\\n╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝','color: #ff00ff; font-size: 14px; font-weight: bold;');
    }

    async _initBanCheck(){
      try{
        const resp = await fetch(this.settings.serverBase+'api/checkBan?clientId='+this.clientId);
        const data = await resp.json();
        if(data.banned) this._applyBan(data.reason, data.until);
      }catch(e){
        console.warn('Ban check failed', e);
      }
    }

    _applyBan(reason, until){
      this.banInfo = { reason, until: until || Date.now() + this.settings.banDurationMs };
      this._showBanPage();
      if(this.settings.webhookURL) this._sendWebhook(reason);
      // Send ban to server
      fetch(this.settings.serverBase+'api/banUser',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          clientId:this.clientId,
          reason: reason,
          durationMs:this.settings.banDurationMs
        })
      });
    }

    _showBanPage(){
      const div = document.createElement('div');
      div.id='slac-ban-screen';
      div.innerHTML=`<h1>You are banned!</h1><p>Reason: ${this.banInfo.reason}</p><p>Until: ${new Date(this.banInfo.until).toLocaleString()}</p>`;
      Object.assign(div.style,{
        position:'fixed', top:0, left:0, width:'100%', height:'100%',
        background:'linear-gradient(135deg,#ff0000,#ff9900)',
        color:'white', fontFamily:'Courier New, monospace', display:'flex',
        flexDirection:'column', justifyContent:'center', alignItems:'center',
        textAlign:'center', zIndex:999999, animation:'pulse 2s infinite alternate'
      });
      document.body.innerHTML='';
      document.body.appendChild(div);
      const style = document.createElement('style');
      style.innerHTML=`@keyframes pulse {0%{transform:scale(1);}100%{transform:scale(1.02);}}`;
      document.head.appendChild(style);
    }

    _sendWebhook(reason){
      fetch(this.settings.webhookURL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          content: '**StarLightAC Ban Alert**',
          embeds:[{
            title:'User Banned',
            fields:[
              { name:'Client ID', value:this.clientId },
              { name:'Reason', value:reason },
              { name:'IP', value:window.location.hostname },
              { name:'Duration', value:this.settings.banDurationMs/1000/60+' minutes' }
            ],
            color:16711680
          }]
        })
      });
    }

    startDetection(){
      if(this.settings.blockDevTools) this._disableDevTools();
      if(this.settings.detectConsoleExec) this._loop(()=>this._detectConsoleExec(),this.settings.detectionInterval);
      if(this.settings.detectDevTools) this._loop(()=>this._detectDevTools(),this.settings.detectionInterval);
      if(this.settings.detectKeybinds) this._loop(()=>this._detectKeybinds(),this.settings.detectionInterval);
      if(this.settings.detectClipboard) this._loop(()=>this._detectClipboard(),this.settings.detectionInterval);
      if(this.settings.detectCanvasWebGL) this._loop(()=>this._detectCanvasWebGL(),this.settings.detectionInterval);
      if(this.settings.detectDOMMutation) this._loop(()=>this._detectDOMMutation(),this.settings.detectionInterval);
      if(this.settings.detectTiming) this._loop(()=>this._detectTiming(),this.settings.detectionInterval);
      setInterval(()=>this._flushReports(),this.settings.telemetryFlushInterval);
    }

    _disableDevTools(){
      document.addEventListener('contextmenu',e=>e.preventDefault());
      window.addEventListener('keydown',e=>{
        if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='C'||e.key==='K'))) e.preventDefault();
      },true);
    }

    _detectConsoleExec(){
      try{
        const orig = console.log;
        console.log = function(){
          orig.apply(this,arguments);
          if(this.settings.banOnConsoleExec) this._applyBan('Console code execution');
          else alert('Console code execution detected!');
        }.bind(this);
      }catch(e){}
    }

    _detectDevTools(){
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if(Math.abs(widthDiff)>150 || Math.abs(heightDiff)>150) this._report('DevTools open detected');
    }

    _detectKeybinds(){
      window.addEventListener('keydown', e=>{
        if(e.ctrlKey && e.key==='U') this._report('View Source detected');
      }, true);
    }

    _detectClipboard(){
      document.addEventListener('paste',()=>this._report('Paste detected'), true);
      document.addEventListener('copy',()=>this._report('Copy detected'), true);
    }

    _detectCanvasWebGL(){
      try{
        const canvas=document.createElement('canvas');
        const gl=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
        if(!gl) this._report('No WebGL detected');
      }catch(e){}
    }

    _detectDOMMutation(){
      try{
        const obs = new MutationObserver(muts=>{
          if(muts.length>10) this._report('Suspicious DOM mutation');
        });
        obs.observe(document.documentElement,{childList:true,subtree:true,attributes:true});
      }catch(e){}
    }

    _detectTiming(){
      const t0=performance.now();
      for(let i=0;i<10000;i++) i*i;
      const t1=performance.now();
      if(t1-t0>30) this._report('Timing anomaly detected');
    }

    _report(reason){ this.reportQueue.push({reason, timestamp:Date.now(), clientId:this.clientId}); }

    _flushReports(){
      if(this.reportQueue.length>0){
        console.log('SLAC reports:',this.reportQueue);
        this.reportQueue=[];
      }
    }

    _loop(fn, interval){ fn(); setTimeout(()=>this._loop(fn, interval), interval); }

    _generateClientId(){ return 'cl-'+Math.random().toString(36).slice(2,10); }
  }

  global.StarLightAC = StarLightAC;

})(window);
