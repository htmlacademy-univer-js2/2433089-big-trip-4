import TripPointView from '../view/trip-point-view.js';
import EditingTripPointView from '../view/editing-trip-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  PREVIEW: 'preview',
  EDITING: 'editing',
};

export default class TripPointPresenter {
  #tripPointsList = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  #previewTripPointComponent = null;
  #editingTripPointComponent = null;

  #changeData = null;
  #changeMode = null;

  #tripPoint = null;
  #mode = Mode.PREVIEW;

  constructor({tripPointsList, destinationsModel, offersModel, changeData, changeMode}) {
    this.#tripPointsList = tripPointsList;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init (tripPoint) {
    this.#tripPoint = tripPoint;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const prevPreviewTripPointComponent = this.#previewTripPointComponent;
    const prevEditingTripPointComponent = this.#editingTripPointComponent;

    this.#previewTripPointComponent = new TripPointView(this.#tripPoint, this.#destinations, this.#offers);
    this.#editingTripPointComponent = new EditingTripPointView({
      tripPoint: this.#tripPoint,
      destination: this.#destinations,
      offers: this.#offers,
      isNewTripPoint: false
    });

    this.#previewTripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#previewTripPointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingTripPointComponent.setPreviewClickHandler(this.#handlePreviewClick);
    this.#editingTripPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingTripPointComponent.setResetClickHandler(this.#handleResetClick);

    if (prevPreviewTripPointComponent === null || prevEditingTripPointComponent === null) {
      render(this.#previewTripPointComponent, this.#tripPointsList);
      return;
    }

    if (this.#mode === Mode.PREVIEW) {
      replace(this.#previewTripPointComponent, prevPreviewTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#previewTripPointComponent, prevEditingTripPointComponent);
      this.#mode = Mode.PREVIEW;
    }

    remove(prevPreviewTripPointComponent);
    remove(prevEditingTripPointComponent);
  }

  destroy = () => {
    remove(this.#previewTripPointComponent);
    remove(this.#editingTripPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.PREVIEW) {
      this.#editingTripPointComponent.reset(this.#tripPoint);
      this.#replaceEditingTripPointToPreviewPoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editingTripPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editingTripPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.PREVIEW) {
      this.#previewTripPointComponent.shake();
      return;
    }

    this.#editingTripPointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#editingTripPointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  #replacePreviewTripPointToEditingPoint = () => {
    replace(this.#editingTripPointComponent, this.#previewTripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditingTripPointToPreviewPoint = () => {
    replace(this.#previewTripPointComponent, this.#editingTripPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.PREVIEW;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editingTripPointComponent.reset(this.#tripPoint);
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TRIP_POINT,
      UpdateType.PATCH,
      {...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite},
    );
  };

  #handleEditClick = () => {
    this.#replacePreviewTripPointToEditingPoint();
  };

  #handlePreviewClick = () => {
    this.resetView();
  };

  #handleFormSubmit = (tripPoint) => {
    this.#changeData(
      UserAction.UPDATE_TRIP_POINT,
      UpdateType.MINOR,
      tripPoint,
    );
  };

  #handleResetClick = (tripPoint) => {
    this.#changeData(
      UserAction.DELETE_TRIP_POINT,
      UpdateType.MINOR,
      tripPoint,
    );
  };
}


