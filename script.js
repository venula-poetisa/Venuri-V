const body = document.body;
const themeButton = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
    body.classList.add("dark");
    themeButton.textContent = "☀";
}

themeButton.addEventListener("click", () => {
    body.classList.toggle("dark");
    const dark = body.classList.contains("dark");
    themeButton.textContent = dark ? "☀" : "☾";
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav a");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            navLinks.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        }
    });
}, { threshold: 0.18 });

sections.forEach(section => {
    section.classList.add("reveal");
    observer.observe(section);
});

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        const nav = document.querySelector(".desktop-nav");
        nav.classList.toggle("mobile-open");
    });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".desktop-nav")?.classList.remove("mobile-open");
    });
});
