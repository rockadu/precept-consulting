const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileMenu() {
  const openBtn = document.querySelector("[data-menu-open]");
  const menu = document.querySelector("[data-menu]");
  if (!openBtn || !menu) return;

  const isOpen = () => menu.classList.contains("is-open");

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  openBtn.addEventListener("click", () => {
    setOpen(!isOpen());
  });

  menu.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function initReveals() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (prefersReducedMotion) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  nodes.forEach((node) => observer.observe(node));
}

function initCountUp() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
}

function initCopyEmail() {
  const button = document.querySelector("[data-copy-email]");
  if (!button) return;

  const original = button.textContent;
  button.addEventListener("click", async () => {
    const email = button.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      button.textContent = "Copiado";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    } catch {
      button.textContent = "Não foi possível copiar";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    }
  });
}

function initTagCloud() {
  const cloud = document.getElementById("tagcloud");
  if (!cloud || typeof window.jQuery === "undefined" || !window.jQuery.fn.tagoSphere) return;

  const $cloud = window.jQuery(cloud);
  $cloud.find("a").on("click", (event) => event.preventDefault());

  if (prefersReducedMotion) {
    cloud.classList.add("is-static");
    return;
  }

  const size = Math.max(320, Math.min(cloud.parentElement?.clientWidth || 640, 640));

  $cloud.tagoSphere({
    height: size,
    width: size,
    radius: Math.round(size * 0.42),
    speed: 3,
    slower: 0.9,
    timer: 5,
    fontMultiplier: 14,
    hoverStyle: {
      border: "none",
      color: "#3ddcb4",
    },
    mouseOutStyle: {
      border: "none",
      color: "#f2f4f7",
    },
  });
}

initHeader();
initMobileMenu();
initReveals();
initCountUp();
initCopyEmail();
initTagCloud();
