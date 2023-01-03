const form = document.querySelector<HTMLFormElement>("form")!;
const ageInput = document.querySelector<HTMLInputElement>("#age")!;
const themesInput = document.querySelector<HTMLInputElement>("#themes")!;
const submitButton = document.querySelector<HTMLButtonElement>("button")!;
const footer = document.querySelector<HTMLElement>("footer")!;
const OPENAI_API_KEY = "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";

/**
 * Transformer 35 et "Légos, jeux videos"
 * en
 * "Propose moi 5 idées de cadeau pour une personne âgée de 35 ans et qui aime Légos, jeux vidéos"
 */

const generatePromptByAgeAndThemes = (age: number, themes = "") => {
  let prompt = `Propose moi, avec ton joyeux et amical, 5 idées de cadeau pour une personne âgée de ${age} ans`;

  if (themes.trim()) {
    prompt += ` et qui aime ${themes}`;
  }

  return prompt + " !";
};

/**
 * Mettre le bouton et le footer en mode "loading"
 */
const setLoadingItems = () => {
  footer.textContent = "Chargement de supers idées en cours !";
  footer.setAttribute("aria-busy", "true");
  submitButton.setAttribute("aria-busy", "true");
  submitButton.disabled = true;
};

/**
 * Enlever le mode "loading" du bouton et du footer
 */
const removeLoadingItems = () => {
  footer.setAttribute("aria-busy", "false");
  submitButton.setAttribute("aria-busy", "false");
  submitButton.disabled = false;
};

/**
 * Lancer tout le système lorsque le formulaire est soumis
 */
form.addEventListener("submit", (e: SubmitEvent) => {
  //Annuler le rechargement de la page
  e.preventDefault();

  //Mettre en mode "loading" le footer et le bouton
  setLoadingItems();

  //Appeler l'API en lui passant la question
  fetch(`https://api.openai.com/v1/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: generatePromptByAgeAndThemes(
        ageInput.valueAsNumber,
        themesInput.value
      ),
      max_tokens: 2000,
      model: "text-davinci-003",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      //changer le HTML à l'intérieur du footer
      footer.innerHTML = translateTextHtml(data.choices[0].text);
    })
    .finally(() => {
      //SUpprimer le mode "loading" du footer et du bouton
      removeLoadingItems();
    });
});

/**
 * Transformer
 * "Hello\nComment vous allez ?"
 * en
 * "<p>Hello</p><p>Comment vous allez ?</p>"
 */
const translateTextHtml = (text: string) =>
  text
    .split("\n")
    .map((str) => `<p>${str}</p>`)
    .join("");
