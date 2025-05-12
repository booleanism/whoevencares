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
    obs.observe(content.children[i]);
  }

  obs.observe(title);
});

function createObs() {
  console.log(isMobile());
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
    {
      root: null,
      rootMargin: isMobile()
        ? "-200px 0px -200px 0px"
        : "-150px 0px -150px 0px",
      threshold: isMobile() ? 0.5 : 1,
    },
  );
}

function isMobile() {
  var match = window.matchMedia || window.msMatchMedia;
  if (match) {
    var mq = match("(pointer:coarse)");
    return mq.matches;
  }
  return false;
}
