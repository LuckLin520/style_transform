function application() {
  const setError = (msg, courceErrorPos) => {
    document.querySelector(`.error${courceErrorPos}`).innerText = msg;
  };
  const clearError = () => {
    document.querySelector(".errorLeft").innerText = "";
    document.querySelector(".errorRight").innerText = "";
  };
  const leftInput = document.querySelector(".input");
  const rightInput = document.querySelector(".output");
  const camelRadio = document.querySelector('input[type="radio"][value="1"]');

  const transHandler = (e) => {
    const isO2C = e.target.classList.contains("object2CssText");
    const sourceInput = isO2C ? leftInput : rightInput;
    const targetInput = isO2C ? rightInput : leftInput;
    const courceErrorPos = sourceInput === leftInput ? "Left" : "Right";
    if (!sourceInput.value) return setError("Please input", courceErrorPos);
    try {
      if (isO2C) {
        eval(`var cssObj = ${sourceInput.value}`);
        if (!isObject(cssObj))
          return setError("The input is not a css object", courceErrorPos);
        targetInput.value = CssObjectTransfer.object2CssText(cssObj);
      } else {
        targetInput.value = CssObjectTransfer.cssText2Object(
          sourceInput.value,
          camelRadio.checked
        );
      }
      clearError();
    } catch (error) {
      setError(error.message, courceErrorPos);
    }
  };
  document
    .querySelectorAll(".transBtn")
    .forEach((v) => v.addEventListener("click", transHandler));

  document.querySelectorAll('input[type="radio"]').forEach((v) =>
    v.addEventListener("change", () => {
      if (!leftInput.value) return undefined;
      eval(`var cssObj = ${leftInput.value}`);
      if (!isObject(cssObj))
        return setError("The input is not a css object", true);
      leftInput.value = JSON.stringify(
        CssObjectTransfer.formatObjectKeyValue(cssObj, v.value === "1"),
        null,
        4
      );
    })
  );

  document.querySelectorAll(".clear").forEach((v) =>
    v.addEventListener("click", (e) => {
      e.target.parentNode.querySelector("textarea").value = "";
    })
  );
}
