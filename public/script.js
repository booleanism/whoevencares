window.addEventListener("load", (ev) => {
  let title = document.querySelector(
    "body > div > main > div > div.article-title > h1",
  );

  if (!title) {
    return;
  }

  let content = document.querySelector(
    "body > div > main > div > div.article > span",
  );

  if (!content) {
    return;
  }

  if (!content?.children) {
    return;
  }

  let obs = createObs();

  for (let i = 0; i < content.children.length; i++) {
    // console.log(content?.children[i]);
    obs.observe(content.children[i]);
  }

  obs.observe(title);
});

function createObs() {
  return new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.tagName.toLowerCase() == "pre") {
            entry.target.style.boxShadow = "2px 2px white";
          } else {
          }
          entry.target.style.color = "white";
        } else {
          entry.target.style.color = "#382d26";
          entry.target.style.boxShadow = "";
        }
      });
    },
    { root: null, rootMargin: "-100px 0px -100px 0px", threshold: 1 },
  );
}
