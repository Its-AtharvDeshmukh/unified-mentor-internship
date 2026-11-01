import { DatabaseSync } from 'node:sqlite';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
export function createStore({ filename=':memory:', key=randomBytes(32) }={}) {
 const db=new DatabaseSync(filename);db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email_hash TEXT UNIQUE NOT NULL,salt TEXT NOT NULL,password_hash TEXT NOT NULL,profile TEXT NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id) ON DELETE CASCADE,csrf TEXT NOT NULL,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS alerts(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id) ON DELETE CASCADE,request_id TEXT NOT NULL,data TEXT NOT NULL,status TEXT NOT NULL,created INTEGER NOT NULL,UNIQUE(user_id,request_id));
 CREATE TABLE IF NOT EXISTS deliveries(id TEXT PRIMARY KEY,alert_id TEXT REFERENCES alerts(id) ON DELETE CASCADE,user_id TEXT REFERENCES users(id) ON DELETE CASCADE,token_hash TEXT UNIQUE NOT NULL,expires INTEGER NOT NULL,state TEXT NOT NULL,next_attempt INTEGER NOT NULL,data TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS delivery_due ON deliveries(state,next_attempt); CREATE INDEX IF NOT EXISTS alerts_owner ON alerts(user_id,created);`);
 const encode=value=>{const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]).toString('base64');};
 const decode=value=>{const raw=Buffer.from(value,'base64'),decipher=createDecipheriv('aes-256-gcm',key,raw.subarray(0,12));decipher.setAuthTag(raw.subarray(12,28));return JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)),decipher.final()]).toString('utf8'));};
 const getUser=id=>{const row=db.prepare('SELECT * FROM users WHERE id=?').get(id);return row?{...row,profile:decode(row.profile)}:null;};
 const getAlert=(id,owner)=>{const row=owner?db.prepare('SELECT * FROM alerts WHERE id=? AND user_id=?').get(id,owner):db.prepare('SELECT * FROM alerts WHERE id=?').get(id);return row?{...decode(row.data),owner:row.user_id}:null;};
 const saveAlert=(owner,alert)=>{db.prepare('UPDATE alerts SET data=?,status=? WHERE id=? AND user_id=?').run(encode(alert),alert.status,alert.id,owner);};
 return {db,encode,decode,getUser,getAlert,saveAlert,saveProfile:(id,profile)=>db.prepare('UPDATE users SET profile=? WHERE id=?').run(encode(profile),id),alerts:owner=>db.prepare('SELECT data FROM alerts WHERE user_id=? ORDER BY created DESC LIMIT 100').all(owner).map(row=>decode(row.data)),deliveryRows:id=>db.prepare('SELECT * FROM deliveries WHERE alert_id=?').all(id),close:()=>db.close()};
}
