import AbstractView from '../framework/view/abstract-view.js';

const createtripPointListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripPointListView extends AbstractView {
  get template () {
    return createtripPointListTemplate();
  }
}
