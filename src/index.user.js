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
    container: "container",
  };

  const MESSAGES = {
    containerFound: `Znaleziono formularz ${IDS.container}`,
    error: {
      basic: "Error",
      containerNotFound: `Nie znaleziono kontenera ${IDS.container}. Skrypt został wstrzymany.`,
    },
  };

  let container;

  const linkStyles = async () => {
    const styleTag = document.createElement("style");
    styleTag.textContent = `
    body {
    
    }
    `;

    document.body.prepend(styleTag);
  };

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
    console.log("renderUiElements");
  };

  const init = async () => {
    try {
      await lookForAppContainer();
    } catch (err) {
      return handleContainerNotFound();
    }

    linkStyles();
    renderUiElements();
  };

  init();
})();
