const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const panel = document.getElementById("panel");

const pages = {
  publish: {
    title: "📤 Post joylash",
    text: "Bu yerda yangi post yozish va kanalga yuborish formasi bo‘ladi."
  },

  posts: {
    title: "📝 Postlar",
    text: "Bu yerda kanal postlarini ko‘rish, tahrirlash va o‘chirish bo‘ladi."
  },

  stats: {
    title: "📊 Statistika",
    text: "Bu yerda obunachilar, ko‘rishlar va boshqa kanal ko‘rsatkichlari chiqadi."
  },

  settings: {
    title: "⚙️ Sozlamalar",
    text: "Bu yerda bot va kanal sozlamalari bo‘ladi."
  }
};

document.querySelectorAll(".menu-btn").forEach(button => {
  button.addEventListener("click", () => {
    const pageName = button.dataset.page;
    const page = pages[pageName];

    if (!page) return;

    panel.innerHTML = `
      <h3>${page.title}</h3>
      <p>${page.text}</p>
    `;
  });
});
const themeToggle = document.getElementById("themeToggle");

// Oldingi tanlangan rejimni tekshirish
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️ Light mode";
}

// Tugma bosilganda rejimni almashtirish
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    if (isDark) {
      themeToggle.textContent = "☀️ Light mode";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.textContent = "🌙 Dark mode";
      localStorage.setItem("theme", "light");
    }
  });
}
