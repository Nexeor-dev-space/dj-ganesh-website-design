import { getPayload } from 'payload'
import config from './payload.config'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

async function sync() {
  console.log('Initializing Payload to push database schema...')
  await getPayload({ config })
  console.log('Database schema successfully synced!')
  process.exit(0)
}

sync()
