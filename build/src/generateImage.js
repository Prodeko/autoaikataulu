"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Jimp = __importStar(require("jimp"));
const days = { fi: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
const endPoint = 'tulos.jpg';
const fontPromise = Jimp.loadFont('./fonts/raleway-bold-white-80.fnt');
const fontPromise2 = Jimp.loadFont('./fonts/raleway-light-white-48.fnt');
const fontPromise3 = Jimp.loadFont('./fonts/raleway-medium-white-24.fnt');
const fontPromise4 = Jimp.loadFont('./fonts/raleway-medium-white-40.fnt');
const formatTime = (d) => {
    if (d.getMinutes() < 10) {
        return `${d.getHours()}:0${d.getMinutes()}`;
    }
    return `${d.getHours()}:${d.getMinutes()}`;
};
const addEvent = (image, startY, event, language) => __awaiter(void 0, void 0, void 0, function* () {
    const [font2, font3, font4] = yield Promise.all([fontPromise2, fontPromise3, fontPromise4]);
    const lang = language && Object.keys(days).includes(language) ? language : 'fi';
    if (event.date.getHours() === 0) {
        return image
            .print(font2, 50, startY, {
            text: days[lang][event.date.getDay()],
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        }, 100, 72)
            .print(font4, 170, startY, {
            text: event.name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        }, 680, 72);
    }
    return image
        .print(font2, 50, startY, {
        text: days[lang][event.date.getDay()],
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, 100, 48)
        .print(font3, 50, startY + 48, {
        text: formatTime(event.date),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, 100, 24)
        .print(font4, 170, startY, {
        text: event.name,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, 680, 72);
});
exports.generateImage = (event) => {
    const interval = 850 / event.events.length;
    return Jimp.read('prodeko_aikataulu.jpg')
        .then((image) => __awaiter(void 0, void 0, void 0, function* () {
        const font = yield fontPromise;
        let tempImage = image.print(font, 300, 120, {
            text: `Prodekon viikko ${event.week}`,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        }, 600, 100);
        for (let i = 0; i < event.events.length; i++) {
            tempImage = yield addEvent(tempImage, 350 + i * interval, event.events[i]);
        }
        return tempImage.write(endPoint); // save
    }))
        .then(() => endPoint)
        .catch(err => err);
};
