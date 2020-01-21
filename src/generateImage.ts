import * as Jimp from 'jimp';
import { Event, WeekEvents } from './types';

const days = { fi: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

const endPoint = 'tulos.jpg';

const fontPromise = Jimp.loadFont('./fonts/raleway-bold-white-80.fnt');
const fontPromise2 = Jimp.loadFont('./fonts/raleway-light-white-48.fnt');
const fontPromise3 = Jimp.loadFont('./fonts/raleway-medium-white-24.fnt');
const fontPromise4 = Jimp.loadFont('./fonts/raleway-medium-white-40.fnt');

const formatTime = (d: Date): string => {
  if (d.getMinutes() < 10) {
    return `${d.getHours()}:0${d.getMinutes()}`;
  }
  return `${d.getHours()}:${d.getMinutes()}`;
};

const addEvent = async (image, startY: number, event: Event, language?: string) => {
  const [font2, font3, font4] = await Promise.all([fontPromise2, fontPromise3, fontPromise4]);
  const lang = language && Object.keys(days).includes(language) ? language : 'fi';
  if (event.date.getHours() === 0) {
    return image
      .print(
        font2,
        50,
        startY,
        {
          text: days[lang][event.date.getDay()],
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        100,
        72,
      )
      .print(
        font4,
        170,
        startY,
        {
          text: event.name,
          alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        680,
        72,
      );
  }
  return image
    .print(
      font2,
      50,
      startY,
      {
        text: days[lang][event.date.getDay()],
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      100,
      48,
    )
    .print(
      font3,
      50,
      startY + 48,
      {
        text: formatTime(event.date),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      100,
      24,
    )
    .print(
      font4,
      170,
      startY,
      {
        text: event.name,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      680,
      72,
    );
};

export const generateImage = (event: WeekEvents): Promise<string> => {
  const interval = 850 / event.events.length;
  return Jimp.read('prodeko_aikataulu.jpg')
    .then(async image => {
      const font = await fontPromise;

      let tempImage = image.print(
        font,
        300,
        120,
        {
          text: `Prodekon viikko ${event.week}`,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        600,
        100,
      );
      for (let i = 0; i < event.events.length; i++) {
        tempImage = await addEvent(tempImage, 350 + i * interval, event.events[i]);
      }

      return tempImage.write(endPoint); // save
    })
    .then(() => endPoint)
    .catch(err => err);
};
