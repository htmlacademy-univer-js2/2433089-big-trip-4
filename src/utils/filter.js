import { FilterType } from '../const';
import { isTripPointDateFuture, isTripPointDatePresent, isTripPointDatePast } from './date-trip-point.js';

const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isTripPointDateFuture(tripPoint.dateFrom)),
  [FilterType.PRESENT]: (tripPoints) => tripPoints.filter((tripPoint) => isTripPointDatePresent(tripPoint.dateFrom, tripPoint.dateTo)),
  [FilterType.PAST]: (tripPoints) => tripPoints.filter((tripPoint) => isTripPointDatePast(tripPoint.dateTo)),
};

export { filter };
