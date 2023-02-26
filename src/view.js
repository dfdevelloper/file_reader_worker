export default class View {
  #csvFile = document.querySelector("#csv-file");
  #fileSize = document.querySelector("#file-fize");
  #form = document.querySelector("#form");
  #debug = document.querySelector("#debug");
  #worker = document.querySelector("#worker");
  #progress = document.querySelector("#progress");

  setFileSize(value) {
    this.#fileSize.innerText = `File size: ${value}\n`;
  }

  configureOnFileChange(handler) {
    this.#csvFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      handler(file);
    });
  }

  configureOnFileFormSubmit(handler) {
    this.#form.reset();
    this.#form.addEventListener("submit", (e) => {
      e.preventDefault();
      const file = this.#csvFile.files[0];
      // this here should be in the controller
      if (!file) {
        alert("Please select a file");
        return;
      }

      this.updateDegugLog("");
      const form = new FormData(e.currentTarget);
      const description = form.get("description");
      const date = form.get("date");
      handler({ file, description, date });
    });
  }

  updateDegugLog(text, reset = true) {
    if (reset) {
      this.#debug.innerText = text;
      return;
    }

    this.#debug.innerText += text;
  }

  updateProgress(value) {
    this.#progress.value = value;
  }

  workerIsEnabled() {
    return this.#worker.checked;
  }
}
