import GenericViolation from "./GenericViolation";

export default class RightClickHandler extends GenericViolation<"DONT_CLICK"> {
  handleRightClick: (e: MouseEvent) => void;
  constructor() {
    super("DONT_CLICK");
    this.handleRightClick = this._handleRightClick.bind(this);
  }

  setup() {
    document.addEventListener("contextmenu", this.handleRightClick);
  }

  teardown() {
    document.removeEventListener("contextmenu", this.handleRightClick);
  }

  _handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };
}
