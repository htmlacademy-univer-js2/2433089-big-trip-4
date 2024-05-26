import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomInteger, getRandomElement } from '../utils/common.js';

const TRIP_POINTS_COUNT = 20;

const TRIP_POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATION_NAMES = ['Amsterdam', 'Chamonix', 'Geneva', 'London'];

const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const ElementsCount = {
  MIN: 1,
  MAX: 4
};

const PictureNumber = {
  MIN: 0,
  MAX: 10
};

const Price = {
  MIN: 100,
  MAX: 1000
};

const generateDescription = () => {
  let description = '';
  for (let i = 0; i < getRandomInteger(ElementsCount.MIN, ElementsCount.MAX); i++) {
    description += `${getRandomElement(DESCRIPTIONS)}`;
  }
  return description;
};

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInteger(PictureNumber.MIN, PictureNumber.MAX)}`,
  description: generateDescription(),
});

const generateDestination = (id) => ({
  id,
  description: generateDescription(),
  name: DESTINATION_NAMES[id],
  pictures: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}, generatePicture),
});

const getDestinations = () => Array.from({length: DESTINATION_NAMES.length}).map((_, index) => generateDestination(index));

const generateOffer = (id, tripPointType) => ({
  id,
  title: `offer for ${tripPointType}`,
  price: getRandomInteger(Price.MIN, Price.MAX)
});

const generateOffersByType = (tripPointType) => ({
  type: tripPointType,
  offers: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}).map((_, index) => generateOffer(index + 1, tripPointType
  )),
});

const getOffersByType = () => Array.from({length: TRIP_POINT_TYPES.length}).map((_, index) => generateOffersByType(TRIP_POINT_TYPES[index]));

const offersByType = getOffersByType();
const destinations = getDestinations();

const generateTripPoint = () => {
  const offersByTypetripPoint = getRandomElement(offersByType);
  const allOfferIdsByTypetripPoint = offersByTypetripPoint.offers.map((offer) => offer.id);
  return {
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: dayjs().add(getRandomInteger(-3, -1), 'day').add(getRandomInteger(-2, 0), 'hour').add(getRandomInteger(-59, 0), 'minute'),
    dateTo: dayjs().add(getRandomInteger(-1, 2), 'day').add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 59), 'minute'),
    destinationId: getRandomElement(destinations).id,
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger()),
    offerIds: Array.from({length: getRandomInteger(0, allOfferIdsByTypetripPoint.length)}).map(() => allOfferIdsByTypetripPoint[getRandomInteger(0, allOfferIdsByTypetripPoint.length - 1)]),
    type: offersByTypetripPoint.type,
  };
};


const getTripPoints = () => Array.from({length: TRIP_POINTS_COUNT}).map(() => generateTripPoint()).sort();

export { getTripPoints, getDestinations, getOffersByType };
