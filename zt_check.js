const fs = require('fs');
const raw = fs.readFileSync('C:/Users/SNL (Manny)/AppData/Local/hermes/cf_token');
const token = raw.slice(2).toString('utf16le').trim();
const ZONE_ID = 'c348cecedb630ff7fec587a7e7159b8c';
const ACCOUNT_ID = 'd294847c0ad56126048ecba079b21e72';

async function cf(method, path, body) {
  const opts = { method, headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  return (await fetch('https://api.cloudflare.com/client/v4' + path, opts)).json();
}

async function main() {
  // 1. Check Zero Trust status
  console.log("=== CHECKING ZERO TRUST ===");
  try {
    const zt = await cf('GET', '/accounts/' + ACCOUNT_ID + '/access/organizations');
    console.log("ZT orgs:", JSON.stringify(zt.result?.length || 0));
  } catch(e) {}

  // 2. Check if Access apps exist
  try {
    const apps = await cf('GET', '/accounts/' + ACCOUNT_ID + '/access/apps');
    console.log("Access apps:", apps.result?.length || 0);
  } catch(e) {}

  // 3. Check Google Workspace identity provider
  try {
    const idps = await cf('GET', '/accounts/' + ACCOUNT_ID + '/access/identity_providers');
    console.log("Identity providers:", JSON.stringify(idps.result?.map(i => ({name: i.name, type: i.type})) || []));
  } catch(e) {}
}

main().catch(e => console.error(e));
