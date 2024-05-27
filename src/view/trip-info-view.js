import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTripPointDueDate } from '../utils/date-trip-point.js';

const renderRouteTrip = (tripPoints, destinations) => {
  if (tripPoints.length === 0) {
    return '';
  }
  const routeWithoutRepeats = [tripPoints[0].destination];
  for (let i = 1; i < tripPoints.length; i++) {
    if (tripPoints[i].destination !== tripPoints[i - 1].destination) {
      routeWithoutRepeats.push(tripPoints[i].destination);
    }
  }

  if (routeWithoutRepeats.length > 3) {
    const startTripPoint = destinations.find((item) => item.id === routeWithoutRepeats[0]);
    const endTripPoint = destinations.find((item) => item.id === routeWithoutRepeats[routeWithoutRepeats.length - 1]);
    return `${startTripPoint.name} &mdash; ... &mdash; ${endTripPoint.name}`;
  }

  return routeWithoutRepeats.map((destination) => `${destinations.find((item) => item.id === destination).name}`).join(' &mdash; ');

};
const renderDatesTrip = (tripPoints) => {
  if (tripPoints.length === 0) {
    return '';
  }
  const startDate = tripPoints[0].dateFrom !== null ? humanizeTripPointDueDate(tripPoints[0].dateFrom) : '';
  const endDate = tripPoints[tripPoints.length - 1].dateTo !== null ? humanizeTripPointDueDate(tripPoints[tripPoints.length - 1].dateTo) : '';
  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

const getPriceTripPointOffers = (tripPoint, offers) => {
  if (offers.length === 0) {
    return 0;
  }
  let priceTripPointOffers = 0;
  const offersByType = offers.find((offer) => offer.type === tripPoint.type);
  const tripPointOffers = tripPoint.offers;
  tripPointOffers.forEach((offer) => {
    priceTripPointOffers += offersByType.offers.find((item) => item.id === offer).price;
  });
  return priceTripPointOffers;
};

const renderTotalPriceTrip = (tripPoints, offers) => {
  if (tripPoints.length === 0) {
    return '';
  }
  let totalPrice = 0;
  tripPoints.forEach((tripPoint) => {
    totalPrice += tripPoint.basePrice;
    totalPrice += getPriceTripPointOffers(tripPoint, offers);
  });
  return `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

const createTripInfoTemplate = (tripPoints, destinations, offers) => {
  if (destinations.length === 0 || offers.length === 0) {
    return '';
  }
  return `<div class="trip-info"><div class="trip-info__main">
  <h1 class="trip-info__title">${renderRouteTrip(tripPoints, destinations)}</h1>
  <p class="trip-info__dates">${renderDatesTrip(tripPoints)}</p>
</div>
<p class="trip-info__cost">
  ${renderTotalPriceTrip(tripPoints, offers)}
</p></div>`;
};

export default class TripInfoView extends AbstractView {
  #tripPoints = null;
  #destinations = null;
  #offers = null;

  constructor(tripPoints, destinations, offers) {
    super();
    this.#tripPoints = tripPoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template () {
    return createTripInfoTemplate(this.#tripPoints, this.#destinations, this.#offers);
  }
}
