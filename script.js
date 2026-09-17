const menuButtons = document.querySelectorAll(".menu-btn");
const panel = document.getElementById("panel");

const pages = {
  dashboard: {
    title: "Dashboard",
    text: "Welcome to your task manager."
  },

  tasks: {
    title: "My Tasks",
    text: "Bu yerda yangi task qo‘shish va tasklarni boshqarish mumkin."
  },

  calendar: {
    title: "Calendar",
    text: "Bu yerda tasklar uchun kalendar bo‘ladi."
  },

  analytics: {
    title: "Analytics",
    text: "Bu yerda bajarilgan va bajarilmagan tasklar statistikasi chiqadi."
  },

  settings: {
    title: "Settings",
    text: "Bu yerda sozlamalarni o‘zgartirish mumkin."
  }
};

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    const pageName = button.dataset.page;
    const page = pages[pageName];

    if (!page) return;

    menuButtons.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    panel.innerHTML = `
      <div class="page-heading">
        <h2>${page.title}</h2>
        <p>${page.text}</p>
      </div>
    `;
  });
});
