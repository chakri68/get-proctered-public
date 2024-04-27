import GenericViolation from "./GenericViolation";

export default class KeyboardDisabler extends GenericViolation<"DONT_TYPE">{
  constructor() {
    super("DONT_TYPE")
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  setup() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  teardown() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event: Event) {
    event.preventDefault(); // Prevents the default behavior of keydown event
    event.stopPropagation(); // Stops the event from propagating further
  }
}


