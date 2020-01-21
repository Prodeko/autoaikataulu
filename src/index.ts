import { generateImage } from './generateImage';
import { Event, WeekEvents } from './types';
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import calendarIds from '../calendarIds.json';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const calendarI = [
  'a440frd2hhop84nhvesq3krijc@group.calendar.google.com', //excut
  '4j6ircv0qosvgfk66588an88n8@group.calendar.google.com', //bileet
  'jgqf5u162heo7vgkgddq90d68s@group.calendar.google.com', //ulkosektori
  'cto@prodeko.org', //yleiset
  'miqv1ra1mb1878p9d5766i8a7g@group.calendar.google.com', //PoRa
  'ekm75qbnvm91a45rs2q5p2edok@group.calendar.google.com', //Fuksit
];

// Load client secrets from a local file.
const getEvents = async (startDate: Date): Promise<Event[]> => {
  const content = fs.readFileSync('credentials.json');
  return authorize(JSON.parse(content.toString())).then(auth => listEvents(auth, startDate));
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials): Promise<OAuth2Client> {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token.toString()));
    console.log('Token parsed');
    return Promise.resolve(oAuth2Client);
  } catch {
    return getAccessToken(oAuth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client): Promise<OAuth2Client> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  let retVal: Promise<OAuth2Client> = new Promise<OAuth2Client>((reject, resolve) => {});
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code).then(res => {
      const token = res.tokens;
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) throw new Error("Couln't write a file");
        console.log('Token stored to', TOKEN_PATH);
      });
      retVal = Promise.resolve(oAuth2Client);
    });
  });
  return retVal;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth, startDate: Date): Promise<Event[]> {
  const calendar = google.calendar({ version: 'v3', auth });
  const promises = calendarIds.map(calendarId =>
    calendar.events
      .list({
        calendarId: calendarId,
        timeMin: startDate.toISOString(),
        timeMax: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })
      .then(res => {
        const events = res.data.items;
        if (events.length) {
          return events.map(event => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
            const summary = event.summary.includes('Sikakaato') ? 'Sikakaato' : event.summary;
            return { name: summary, date: new Date(event.start.dateTime || `${event.start.date}T00:00:00`) };
          });
        }
        return [];
      })
      .catch(err => {
        return [];
      }),
  );
  return await Promise.all(promises).then(res => res.reduce((acc, val) => acc.concat(val), []));
}

const getWeekNumber = (d: Date) => {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
};

const getDateOfISOWeek = (w: number, y: number) => {
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
};

const getMonday = (d: Date) => {
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  if (d.getDay() === 0) {
    d.setDate(d.getDate() - 6);
  } else {
    d.setDate(d.getDate() - d.getDay() + 1);
  }
  return d;
};

const currentWeek = getWeekNumber(new Date());

const startDate = !process.argv[2]
  ? getMonday(new Date())
  : process.argv[2] === 'next'
  ? getMonday(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  : !Number(process.argv[2])
  ? getMonday(new Date())
  : Number(process.argv[2]) >= currentWeek[1]
  ? getMonday(getDateOfISOWeek(Number(process.argv[2]), currentWeek[0]))
  : getMonday(getDateOfISOWeek(Number(process.argv[2]), currentWeek[0] + 1));

getEvents(startDate)
  .then(res =>
    res
      .filter(event => event.date.getTime() >= startDate.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  )
  .then(res => generateImage({ events: res, week: getWeekNumber(startDate)[1] }))
  .then(res => console.log(res))
  .catch(err => console.log(err));
