const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const panel = document.getElementById("panel");
const themeToggle = document.getElementById("themeToggle");

const pages = {
  publish: `
    <h3>📤 Post joylash</h3>
    <p>Yangi post yozing va kanalga yuboring.</p>

    <input id="postTitle" class="form-input" placeholder="Post sarlavhasi">

    <textarea id="postText" class="form-input" placeholder="Post matni"></textarea>

    <button id="sendPost" class="primary-btn">
      📤 Post yuborish
    </button>

    <p id="postMessage"></p>
  `,

  posts: `
    <h3>📝 Postlar</h3>
    <p>Bu yerda kanal postlarini boshqarishingiz mumkin.</p>

    <div class="post-box">
      <b>Hozircha postlar mavjud emas</b>
      <p>Yangi post qo‘shish uchun “Post joylash” tugmasini bosing.</p>
    </div>
  `,

  stats: `
    <h3>📊 Statistika</h3>

    <div class="stat-details">
      <p>👥 Obunachilar: <b id="statSubscribers">—</b></p>
      <p>📝 Postlar: <b id="statPosts">—</b></p>
      <p>📈 Holat: <b>Faol</b></p>
    </div>
  `,

  settings: `
    <h3>⚙️ Sozlamalar</h3>

    <label for="channelName">Kanal nomi</label>
    <input
      id="channelName"
      class="form-input"
      value="Nothing Forever"
    >

    <label for="channelUsername">Kanal username</label>
    <input
      id="channelUsername"
      class="form-input"
      value="@nothing_ls_forever"
    >

    <button id="saveSettings" class="primary-btn">
      💾 Saqlash
    </button>

    <p id="settingsMessage"></p>
  `
};

document.querySelectorAll(".menu-btn").forEach(button => {
  button.addEventListener("click", () => {
    const pageName = button.dataset.page;

    if (!pages[pageName]) return;

    document.querySelectorAll(".menu-btn").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    panel.classList.add("panel-open");

    panel.innerHTML = pages[pageName];

    if (pageName === "stats") {
      document.getElementById("statSubscribers").textContent =
        document.getElementById("subscribers").textContent;

      document.getElementById("statPosts").textContent =
        document.getElementById("posts").textContent;
    }

    if (pageName === "publish") {
      document.getElementById("sendPost").addEventListener("click", () => {
        const title = document.getElementById("postTitle").value.trim();
        const text = document.getElementById("postText").value.trim();
        const message = document.getElementById("postMessage");

        if (!title || !text) {
          message.textContent = "Iltimos, barcha joylarni to‘ldiring.";
          return;
        }

        message.textContent = "Post tayyorlandi. Telegram bot ulanishi kerak.";
      });
    }

    if (pageName === "settings") {
      document.getElementById("saveSettings").addEventListener("click", () => {
        document.getElementById("settingsMessage").textContent =
          "Sozlamalar saqlandi!";
      });
    }
  });
});

// Dark mode
if (themeToggle) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const darkMode =
      document.body.classList.contains("dark-mode");

    themeToggle.textContent = darkMode
      ? "☀️ Light mode"
      : "🌙 Dark mode";

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  });
}
