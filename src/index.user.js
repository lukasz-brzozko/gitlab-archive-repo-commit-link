// ==UserScript==
// @name         Gitlab Archive Repo Commit Link
// @namespace    https://github.com/lukasz-brzozko/gitlab-archive-repo-commit-link
// @version      2024-10-25
// @description  Redirects to the archived repository if no MR were found
// @author       Łukasz Brzózko
// @match        https://gitlab.nd0.pl/orbico/portal/-/commit/*
// @icon         https://about.gitlab.com/nuxt-images/ico/favicon.ico
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/gitlab-archive-repo-commit-link/main/dist/index.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/gitlab-archive-repo-commit-link/main/dist/index.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const IDS = {
    container: ".commit-info.merge-request-info",
  };

  const MESSAGES = {
    containerFound: `Znaleziono formularz ${IDS.container}`,
    error: {
      basic: "Error",
      containerNotFound: `Nie znaleziono kontenera ${IDS.container}. Skrypt został wstrzymany.`,
    },
  };

  let container;

  const handleContainerNotFound = () => {
    window.console.error(
      `%c ${MESSAGES.error.containerNotFound}`,
      "background: red; color: #fff; font-size: 20px"
    );
  };

  const lookForAppContainer = async () => {
    const DOMElements = await new Promise((resolve, reject) => {
      const maxAttempts = 50;
      let attempt = 0;

      const setIntervalId = setInterval(() => {
        container = document.getElementById(IDS.container);
        if (container) {
          clearInterval(setIntervalId);
          window.console.info(
            `%c ${MESSAGES.containerFound}`,
            "background: #B7E1CD; color: #000; font-size: 20px"
          );
          resolve({ container });
        } else {
          if (attempt >= maxAttempts) {
            clearInterval(setIntervalId);
            reject({ error: MESSAGES.error.containerNotFound });
          } else {
            attempt++;
          }
        }
      }, 300);
    });

    return DOMElements;
  };

  const renderUiElements = () => {
    const link = document.createElement("a");
    const currentLink = window.location;
    const newLink = currentLink.replace("orbico", "orbico-platform");
    link.href = newLink;
    link.className = "ml-3 gl-button btn btn-default btn-md";

    const containerLink = container.querySelector("a");

    if (containerLink) return;

    container.appendChild(link);
  };

  const init = async () => {
    try {
      await lookForAppContainer();
    } catch (err) {
      return handleContainerNotFound();
    }

    renderUiElements();
  };

  init();
})();
