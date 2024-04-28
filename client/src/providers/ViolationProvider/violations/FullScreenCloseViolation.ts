import GenericViolation from "./GenericViolation";

export default class FullScreenCloseViolation extends GenericViolation<"FULLSCREEN_CLOSE"> {
  count: number = 0;

  constructor() {
    super("FULLSCREEN_CLOSE");
  }

  setup() {
    document.addEventListener("fullscreenchange", this.handleFullScreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      this.handleFullScreenChange.bind(this)
    );
    document.addEventListener(
      "mozfullscreenchange",
      this.handleFullScreenChange.bind(this)
    );
    document.addEventListener(
      "MSFullscreenChange",
      this.handleFullScreenChange.bind(this)
    );
  }

  teardown() {
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullScreenChange.bind(this)
    );
    document.removeEventListener(
      "webkitfullscreenchange",
      this.handleFullScreenChange.bind(this)
    );
    document.removeEventListener(
      "mozfullscreenchange",
      this.handleFullScreenChange.bind(this)
    );
    document.removeEventListener(
      "MSFullscreenChange",
      this.handleFullScreenChange.bind(this)
    );
  }

  handleFullScreenChange = () => {
    if (
      !document.fullscreenElement &&
      // @ts-ignore
      !document.webkitIsFullScreen &&
      // @ts-ignore
      !document.mozFullScreen &&
      // @ts-ignore
      !document.msFullscreenElement
    ) {
      this.count++;
      const newInstance = {
        timestamp: new Date(),
        severity: (this.count > 2 ? "error" : "warning") as "error" | "warning",
      };
      this.instances.push(newInstance);
      this.notify(newInstance);
    }
  };
}
