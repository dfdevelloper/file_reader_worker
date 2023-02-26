import Service from "./service.js";
const service = new Service();

postMessage({ eventType: "alive" });

onmessage = ({ data }) => {
  const { file, query } = data;
  service.processFile({
    file,
    query,
    onProgress: (total) => {
      postMessage({ eventType: "progress", total });
    },
    onOcurrenceUpdate: (args) => {
      postMessage({ eventType: "ocurrenceUpdate", ...args });
    },
  });
};
