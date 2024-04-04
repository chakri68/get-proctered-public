/**
 * @param  {string[]} parts
 */
export function joinPath(...parts) {
  let finalStr = "";
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "" || parts[i] === undefined || parts[i] === "/") {
      continue;
    }
    // Clean the parts[i] first
    if (i !== 0 && parts[i].startsWith("/")) {
      parts[i] = parts[i].slice(1);
    }
    if (parts[i].endsWith("/")) {
      parts[i] = parts[i].slice(0, -1);
    }

    finalStr += parts[i] + "/";
  }

  return finalStr;
}
