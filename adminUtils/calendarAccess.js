const admin = require('firebase-admin');
const firebaseConfig = require('./config/firebase.secret.json')
const firebaseAdminConfig = require('./config/firebase_admin.secret.json');
const parseArgs = require('minimist');
const { exit } = require('process');

admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    databaseURL: firebaseConfig.databaseURL
  });

const permissionSet = {
    'calendar': { hasCalendarAccess: true },
    'admin': { hasCalendarAccess: true, hasAdminAccess: true }
}

async function grantAccess(perm, uid) {
    return admin.auth().setCustomUserClaims(
        uid, permissionSet[perm]
    ).then(
        () => console.log(`Added claim to ${uid}`)
    );
}

async function checkAccess(perm, uid) {
    return admin.auth().getUser(uid).then((userRecord) => {
        Object.keys(permissionSet[perm]).map(p =>
            console.log(`${uid} ${p}: ${userRecord.customClaims[p]}`)
        );
    });
}

function invertPerm(perm) {
    return Object.keys(perm).reduce((acc, cur) => {
        acc[cur] = acc[!permissionSet[cur]]
        return acc
    }, {})
}

async function revokeAccess(perm, uid) {
    return admin.auth().setCustomUserClaims(
        uid, invertPerm(permissionSet[perm])
    ).then(
        () => console.log(`Revoked ${perm} claim to ${uid}`)
    );
}

if (require.main === module) {
    const args = parseArgs(process.argv.slice(2));
    const correctUsage = "./calendarAccess [check|add|revoke] --uid <userID> --level <calendar|admin>"
    switch (args['_'][0]) {
        case 'add':
            if (args['uid'] && args['level']) {
                grantAccess(args['level'], args['uid']).then(() => exit());
            } else {
                throw Error(correctUsage);
            }
            break;
        case 'check':
            if (args['uid'] && args['level']) {
                checkAccess(args['level'], args['uid']).then(() => exit());
            } else {
                throw Error(correctUsage);
            }
            break;
        case 'revoke':
            if (args['uid'] && args['level']) {
                revokeAccess(args['level'], args['uid']).then(() => exit());
            } else {
                throw Error(correctUsage);
            }
            break;
        default:
            throw Error(correctUsage);
    }
}