const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const SortTypeDescription = {
  [SortType.DAY]: 'Day',
  [SortType.EVENT]: 'Event',
  [SortType.TIME]: 'Time',
  [SortType.PRICE]: 'Price',
  [SortType.OFFERS]: 'Offers',
};

const TripPointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const TripPointTypeDescription = {
  [TripPointType.TAXI]: 'Taxi',
  [TripPointType.BUS]: 'Bus',
  [TripPointType.TRAIN]: 'Train',
  [TripPointType.SHIP]: 'Ship',
  [TripPointType.DRIVE]: 'Drive',
  [TripPointType.FLIGHT]: 'Flight',
  [TripPointType.CHECK_IN]: 'Check-in',
  [TripPointType.SIGHTSEEING]: 'Sightseeing',
  [TripPointType.RESTAURANT]: 'Restaurant'
};

const UserAction = {
  UPDATE_TRIP_POINT: 'UPDATE_TRIP_POINT',
  ADD_TRIP_POINT: 'ADD_TRIP_POINT',
  DELETE_TRIP_POINT: 'DELETE_TRIP_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export { SortType, SortTypeDescription, TripPointType, TripPointTypeDescription, UserAction, UpdateType, FilterType };
