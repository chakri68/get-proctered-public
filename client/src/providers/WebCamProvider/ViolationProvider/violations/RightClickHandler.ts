import GenericViolation from "./GenericViolation";

export default class RightClickHandler extends GenericViolation<"DONT_CLICK"> {
 

  constructor() {
    super("DONT_CLICK");
  }

  setup() {
    document.addEventListener("contextmenu", this.handleRightClick);
  }

  teardown() {
    document.removeEventListener(
      "contextmenu",
      this.handleRightClick.bind(this)
    );
  }

  handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };
}
