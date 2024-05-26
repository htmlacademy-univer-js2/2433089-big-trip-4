import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class TripPointsModel extends Observable {
  #tripPoints = [];
  #tripPointsApiService = null;

  constructor(tripPointsApiService) {
    super();
    this.#tripPointsApiService = tripPointsApiService;
  }

  init = async () => {
    try {
      const tripPoints = await this.#tripPointsApiService.tripPoints;
      this.#tripPoints = tripPoints.map(this.#adaptToClient);
    } catch(err) {
      this.#tripPoints = [];
    }

    this._notify(UpdateType.INIT);
  };

  get tripPoints() {
    return this.#tripPoints;
  }


  updateTripPoint = async (updateType, update) => {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip point');
    }

    try {
      const response = await this.#tripPointsApiService.updateTripPoint(update);
      const updatedTripPoint = this.#adaptToClient(response);
      this.#tripPoints = [
        ...this.#tripPoints.slice(0, index),
        updatedTripPoint,
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType, updatedTripPoint);
    } catch(err) {
      throw new Error('Can\'t update trip point');
    }
  };

  addTripPoint = (updateType, update) => {
    this.#tripPoints.unshift(update);

    this._notify(updateType, update);
  };

  deleteTripPoint = (updateType, update) => {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting trip point');
    }

    this.#tripPoints = [
      ...this.#tripPoints.slice(0, index),
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (tripPoint) => {
    const adaptedTripPoint = {...tripPoint,
      basePrice: tripPoint['base_price'],
      dateFrom: tripPoint['date_from'] !== null ? new Date(tripPoint['date_from']) : tripPoint['date_from'],
      dateTo: tripPoint['date_to'] !== null ? new Date(tripPoint['date_to']) : tripPoint['date_to'],
      isFavorite: tripPoint['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedTripPoint['base_price'];
    delete adaptedTripPoint['date_from'];
    delete adaptedTripPoint['date_to'];
    delete adaptedTripPoint['is_favorite'];

    return adaptedTripPoint;
  };
}
