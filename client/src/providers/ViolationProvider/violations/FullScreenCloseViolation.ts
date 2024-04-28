import GenericViolation from "./GenericViolation";

export default class FullScreenCloseViolation extends GenericViolation<"FULLSCREEN_CLOSE"> {
  handleFullScreenChange: () => void;
  count: number = 0;

  constructor() {
    super("FULLSCREEN_CLOSE");
    this.handleFullScreenChange = this._handleFullScreenChange.bind(this);
  }

  setup() {
    document.addEventListener("fullscreenchange", this.handleFullScreenChange);
  }

  teardown() {
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullScreenChange
    );
  }

  _handleFullScreenChange = () => {
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
