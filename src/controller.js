export default class Controller {
  #view;
  #worker;
  #service;
  #events = {
    alive: () => {},
    progress: ({ total }) => {
      this.#view.updateProgress(total);
    },
    ocurrenceUpdate: ({ found, linesLength, took }) => {
      const [[key, value]] = Object.entries(found);
      this.#view.updateDegugLog(
        `found ${value} ocurrencies of ${key} - over ${linesLength} lines - took: ${took}`
      );
    },
  };

  constructor({ view, worker, service }) {
    this.#view = view;
    this.#worker = this.#configureWorker(worker);
    this.#service = service;
  }

  static init(dependecies) {
    const controller = new Controller(dependecies);
    controller.init();
    return controller;
  }

  #configureWorker(worker) {
    worker.onmessage = ({ data }) => this.#events[data.eventType](data);
    return worker;
  }

  #configureOnFileChange(file) {
    // console.log({ file });
  }

  #configureOnFileFormSubmit({ file, description, date }) {
    const query = {};
    query["date cleared"] = new RegExp(normalizedDate, "i");

    if (this.#view.workerIsEnabled()) {
      this.#worker.postMessage({ file, query });
      return;
    }

    this.#service.processFile({
      query,
      file,
      onProgress: (total) => {
        this.#events.progress({ total });
      },
      onOcurrenceUpdate: (...args) => {
        this.#events.ocurrenceUpdate(...args);
      },
    });
  }

  init() {
    this.#view.configureOnFileChange(this.#configureOnFileChange.bind(this));
    this.#view.configureOnFileFormSubmit(
      this.#configureOnFileFormSubmit.bind(this)
    );
  }
}
