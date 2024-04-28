import GenericViolation from "./GenericViolation";

export default class KeyboardDisabler extends GenericViolation<"DONT_TYPE"> {
  handleKeyDown: (event: Event) => void;
  constructor() {
    super("DONT_TYPE");
    this.handleKeyDown = this._handleKeyDown.bind(this);
  }

  setup() {
    console.log("KeyboardDisabler setup");
    document.addEventListener("keydown", this.handleKeyDown);
  }

  teardown() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  _handleKeyDown(event: Event) {
    event.preventDefault(); // Prevents the default behavior of keydown event
    event.stopPropagation(); // Stops the event from propagating further
  }
}
