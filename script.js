// ==================== BASIC ELEMENTS ====================

const body = document.body;
const themeButton = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");


// ==================== DARK MODE ====================

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
    body.classList.add("dark");

    if (themeButton) {
        themeButton.textContent = "☀";
    }
}

if (themeButton) {
    themeButton.addEventListener("click", () => {

        body.classList.toggle("dark");

        const dark = body.classList.contains("dark");

        themeButton.textContent = dark ? "☀" : "☾";

        localStorage.setItem(
            "portfolio-theme",
            dark ? "dark" : "light"
        );
    });
}


// ==================== PROJECTS FROM CMS ====================

async function loadProjects() {

    const featuredContainer =
        document.getElementById("featuredProject");

    const projectGrid =
        document.getElementById("projectGrid");

    // Make sure the containers exist
    if (!featuredContainer || !projectGrid) {
        return;
    }

    try {

        const response = await fetch("content/projects.json");

        if (!response.ok) {
            throw new Error("Could not load projects.json");
        }

        const projects = await response.json();

        // Clear existing content
        featuredContainer.innerHTML = "";
        projectGrid.innerHTML = "";

        // Make sure we actually received a list
        if (!Array.isArray(projects) || projects.length === 0) {

            featuredContainer.innerHTML = `
                <div class="project-card coming-soon">
                    <div class="future-icon">
                        <i class="fa-solid fa-plus"></i>
                    </div>

                    <div class="project-card-body">
                        <span class="card-label">Projects</span>

                        <h3>More projects loading...</h3>

                        <p>
                            New work will appear here as projects
                            move from idea to something I can actually show.
                        </p>
                    </div>
                </div>
            `;

            return;
        }


        // ==================== FEATURED PROJECT ====================

        const featured = projects[0];

        const featuredTags = Array.isArray(featured.tags)
            ? featured.tags
            : [];

        const featuredImage = featured.image
            ? featured.image
            : "content/project1.png";

        const featuredGithub = featured.github
            ? featured.github
            : "#";


        featuredContainer.innerHTML = `

            <div class="featured-project">

                <div class="project-image">
                    <img
                        src="${featuredImage}"
                        alt="${featured.title}"
                    >
                </div>

                <div class="project-info">

                    <span class="project-number">
                        01
                    </span>

                    <span class="card-label">
                        Featured Project
                    </span>

                    <h3>
                        ${featured.title}
                    </h3>

                    <p>
                        ${featured.description || ""}
                    </p>

                    <div class="project-tech">

                        ${featuredTags.map(tag => `
                            <span>${tag}</span>
                        `).join("")}

                    </div>

                    <a
                        class="text-link"
                        href="${featuredGithub}"
                        target="_blank"
                        rel="noopener"
                    >
                        View GitHub
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>

                </div>

            </div>

        `;


        // ==================== OTHER PROJECTS ====================

        const otherProjects = projects.slice(1);

        otherProjects.forEach((project, index) => {

            const tags = Array.isArray(project.tags)
                ? project.tags
                : [];

            const image = project.image
                ? project.image
                : "content/project2.png";

            const github = project.github
                ? project.github
                : "#";


            const card = document.createElement("article");

            card.className = "project-card";


            card.innerHTML = `

                <div class="project-card-image">

                    <img
                        src="${image}"
                        alt="${project.title}"
                    >

                </div>


                <div class="project-card-body">

                    <span class="card-label">
                        Web / Software Project
                    </span>

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        ${project.description || ""}
                    </p>

                    <div class="project-tech">

                        ${tags.map(tag => `
                            <span>${tag}</span>
                        `).join("")}

                    </div>

                    <a
                        class="text-link"
                        href="${github}"
                        target="_blank"
                        rel="noopener"
                    >
                        View GitHub
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>

                </div>

            `;

            projectGrid.appendChild(card);

        });


    } catch (error) {

        console.error("Projects could not be loaded:", error);

        // Don't leave the section completely blank
        featuredContainer.innerHTML = `
            <div class="project-card coming-soon">

                <div class="future-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div class="project-card-body">

                    <span class="card-label">
                        Projects
                    </span>

                    <h3>
                        Projects couldn't be loaded
                    </h3>

                    <p>
                        Please check the projects.json file.
                    </p>

                </div>

            </div>
        `;

    }
}


// Load projects when the page opens
loadProjects();


// ==================== SCROLL REVEAL ====================

const sections =
    document.querySelectorAll("main section[id]");

const navLinks =
    document.querySelectorAll(".desktop-nav a");


const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                navLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    );

                });

            }

        });

    },
    {
        threshold: 0.18
    }
);


sections.forEach(section => {

    section.classList.add("reveal");

    observer.observe(section);

});


// ==================== MOBILE MENU ====================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        const nav =
            document.querySelector(".desktop-nav");

        nav.classList.toggle("mobile-open");

    });

}


// Close mobile menu when a navigation link is clicked

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", () => {

        document
            .querySelector(".desktop-nav")
            ?.classList.remove("mobile-open");

    });

});