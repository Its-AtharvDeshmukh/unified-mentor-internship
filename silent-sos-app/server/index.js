import 'dotenv/config';
import {mkdirSync,existsSync,readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import {createStore} from './store.js';
import {createApp} from './app.js';
process.umask(0o077);const dataDir=resolve(process.env.DATA_DIR||'.data');mkdirSync(dataDir,{recursive:true,mode:0o700});const keyPath=resolve(dataDir,'encryption.key');if(!existsSync(keyPath)&&!process.env.DATA_ENCRYPTION_KEY)writeFileSync(keyPath,randomBytes(32).toString('hex'),{mode:0o600,flag:'wx'});const key=process.env.DATA_ENCRYPTION_KEY||readFileSync(keyPath,'utf8').trim();if(!/^[a-f0-9]{64}$/i.test(key))throw new Error('DATA_ENCRYPTION_KEY must be 64 hexadecimal characters.');const filename=resolve(dataDir,'haven.sqlite');const store=createStore({filename,key:Buffer.from(key,'hex')});chmodSync(filename,0o600);const runtime=createApp({store,staticDirectory:resolve('dist')});const port=Number(process.env.PORT||5173),host=process.env.HOST||'127.0.0.1';const server=runtime.app.listen(port,host,()=>console.log(`Haven app + API: http://${host}:${port}`));const stop=()=>server.close(()=>{runtime.close();process.exit(0);});process.on('SIGTERM',stop);process.on('SIGINT',stop);
