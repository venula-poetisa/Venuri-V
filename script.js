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


// ==================== SITE CONTENT ====================

async function loadSite() {

    try {

        const response = await fetch("content/site.json");

        if (!response.ok) {
            throw new Error("Could not load site.json");
        }

        const site = await response.json();


        // ==================== GENERAL ====================

        document.title =
            site.general.siteTitle;

        document
            .getElementById("pageTitle")
            .textContent =
            site.general.siteTitle;

        document
            .getElementById("metaDescription")
            .setAttribute(
                "content",
                site.general.metaDescription
            );

        document
            .getElementById("favicon")
            .setAttribute(
                "href",
                site.general.favicon
            );


        // ==================== HEADER ====================

        document
            .getElementById("brand")
            .innerHTML =
            `${site.header.brand.split(" ")[0]}<span> ${site.header.brand.split(" ").slice(1).join(" ")}</span>`;

        document
            .getElementById("headerEmail")
            .href =
            `mailto:${site.header.email}`;

        document
            .getElementById("headerGithub")
            .href =
            site.header.github;

        document
            .getElementById("headerLinkedin")
            .href =
            site.header.linkedin;

        document
            .getElementById("headerResume")
            .href =
            site.header.resume;


        // ==================== HERO ====================

        document
            .getElementById("heroEyebrow")
            .textContent =
            site.hero.eyebrow;

        document
            .getElementById("heroHeading")
            .textContent =
            site.hero.heading;

        document
            .getElementById("heroHeadingEmphasis")
            .textContent =
            site.hero.headingEmphasis;

        document
            .getElementById("heroDescription")
            .textContent =
            site.hero.description;


        const primaryButton =
            document.getElementById("heroPrimaryButton");

        primaryButton.href =
            site.hero.primaryButton.link;

        primaryButton.querySelector("span")
            .textContent =
            site.hero.primaryButton.label;


        const resumeButton =
            document.getElementById("heroResumeButton");

        resumeButton.href =
            site.header.resume;

        resumeButton.querySelector("span")
            .textContent =
            site.hero.secondaryButton.label;


        // Quick stats

        const stats =
            document.getElementById("quickStats");

        stats.innerHTML = "";

        site.hero.stats.forEach(stat => {

            stats.innerHTML += `
                <div>
                    <strong>${stat.number}</strong>
                    <span>${stat.label}</span>
                </div>
            `;

        });


        // Code card

        const code =
            site.hero.codeCard;

        document
            .getElementById("codeFilename")
            .textContent =
            code.filename;

        document
            .getElementById("codeName")
            .textContent =
            `"${code.name}"`;

        document
            .getElementById("codeFocus")
            .textContent =
            `"${code.focus}"`;

        document
            .getElementById("codeStack")
            .textContent =
            code.stack
                .map(item => `"${item}"`)
                .join(", ");

        document
            .getElementById("codeMindset")
            .textContent =
            `"${code.mindset}"`;


        // Hero badges

        const badges =
            document.getElementById("heroBadges");

        badges.innerHTML = "";

        site.hero.badges.forEach((badge, index) => {

            badges.innerHTML += `
                <div class="floating-badge badge-${index + 1}">
                    <i class="fa-solid ${badge.icon}"></i>
                    ${badge.label}
                </div>
            `;

        });


        // ==================== ABOUT ====================

        document
            .getElementById("aboutEyebrow")
            .textContent =
            site.about.eyebrow;

        document
            .getElementById("aboutHeading")
            .textContent =
            site.about.heading;

        document
            .getElementById("aboutLead")
            .textContent =
            site.about.lead;


        const aboutParagraphs =
            document.getElementById("aboutParagraphs");

        aboutParagraphs.innerHTML = "";

        site.about.paragraphs.forEach(paragraph => {

            const p =
                document.createElement("p");

            p.textContent = paragraph;

            aboutParagraphs.appendChild(p);

        });


        const techPills =
            document.getElementById("techPills");

        techPills.innerHTML = "";

        site.about.techPills.forEach(skill => {

            techPills.innerHTML += `
                <span>${skill}</span>
            `;

        });


        document
            .getElementById("profilePhoto")
            .src =
            site.about.photo;

        document
            .getElementById("photoCaption")
            .textContent =
            site.about.photoCaption;


        // ==================== EDUCATION ====================

        const education =
            document.getElementById("educationList");

        education.innerHTML = "";

        site.education.forEach(item => {

            education.innerHTML += `

                <article class="timeline-item">

                    <div class="timeline-dot"></div>

                    <div class="timeline-year">
                        ${item.year}
                    </div>

                    <div class="timeline-card">

                        <span class="card-label">
                            ${item.label}
                        </span>

                        <h3>
                            ${item.degree}
                        </h3>

                        ${
                            item.institution
                            ? `<p>${item.institution}</p>`
                            : ""
                        }

                        ${
                            item.description
                            ? `<p>${item.description}</p>`
                            : ""
                        }

                        ${
                            item.link
                            ? `
                                <a href="${item.link}"
                                   target="_blank"
                                   rel="noopener">

                                    Visit programme

                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>

                                </a>
                            `
                            : ""
                        }

                    </div>

                </article>

            `;

        });


        // ==================== EXPERIENCE ====================

        const experience =
            document.getElementById("experienceList");

        experience.innerHTML = "";

        site.experience.forEach((item, index) => {

            experience.innerHTML += `

                <article class="experience-card ${index === 0 ? "featured" : ""}">

                    <div class="experience-top">

                        <span class="company-icon">

                            <i class="fa-solid ${item.icon}"></i>

                        </span>

                        <span>
                            ${item.date}
                        </span>

                    </div>

                    <h3>
                        ${item.role}
                    </h3>

                    <p class="company">
                        ${item.company}
                    </p>

                    <p>
                        ${item.description}
                    </p>

                    <div class="tags">

                        ${item.tags.map(tag => `
                            <span>${tag}</span>
                        `).join("")}

                    </div>

                </article>

            `;

        });


        // ==================== SKILLS ====================

        document
            .getElementById("skillsEyebrow")
            .textContent =
            site.skills.eyebrow;

        document
            .getElementById("skillsHeading")
            .textContent =
            site.skills.heading;

        document
            .getElementById("skillsSubtitle")
            .textContent =
            site.skills.subtitle;


        const skills =
            document.getElementById("skillsList");

        skills.innerHTML = "";

        site.skills.categories.forEach(category => {

            skills.innerHTML += `

                <div class="stack-card">

                    <div class="stack-title">

                        <i class="fa-solid ${category.icon}"></i>

                        <h3>
                            ${category.title}
                        </h3>

                    </div>

                    <div class="skill-list">

                        ${category.items.map(item => `
                            <span>${item}</span>
                        `).join("")}

                    </div>

                </div>

            `;

        });


        // ==================== PROJECT SECTION ====================

        document
            .getElementById("projectsEyebrow")
            .textContent =
            site.projectsSection.eyebrow;

        document
            .getElementById("projectsHeading")
            .textContent =
            site.projectsSection.heading;

        document
            .getElementById("projectsSubtitle")
            .textContent =
            site.projectsSection.subtitle;


        // ==================== FUTURE PROJECTS ====================

        document
            .getElementById("futureEyebrow")
            .textContent =
            site.future.eyebrow;

        document
            .getElementById("futureHeading")
            .textContent =
            site.future.heading;

        document
            .getElementById("futureSubtitle")
            .textContent =
            site.future.subtitle;


        const future =
            document.getElementById("futureProjects");

        future.innerHTML = "";

        site.future.projects.forEach(project => {

            future.innerHTML += `

                <article class="roadmap-card">

                    <div class="roadmap-status">
                        ${project.status}
                    </div>

                    <div class="roadmap-icon">

                        <i class="fa-solid ${project.icon}"></i>

                    </div>

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        ${project.description}
                    </p>

                    <div class="roadmap-line">
                        <span></span>
                    </div>

                </article>

            `;

        });


        // ==================== CONTACT ====================

        document
            .getElementById("contactEyebrow")
            .textContent =
            site.contact.eyebrow;

        document
            .getElementById("contactHeading")
            .textContent =
            site.contact.heading;

        document
            .getElementById("contactDescription")
            .textContent =
            site.contact.description;


        const contactEmail =
            document.getElementById("contactEmail");

        contactEmail.href =
            `mailto:${site.header.email}`;

        document
            .getElementById("contactEmailText")
            .textContent =
            site.contact.emailButton;


        const contactGithub =
            document.getElementById("contactGithub");

        contactGithub.href =
            site.header.github;

        contactGithub.textContent =
            site.contact.githubLabel;


        const contactLinkedin =
            document.getElementById("contactLinkedin");

        contactLinkedin.href =
            site.header.linkedin;

        contactLinkedin.textContent =
            site.contact.linkedinLabel;


        // ==================== FOOTER ====================

        document
            .getElementById("footerText")
            .textContent =
            site.footer.text;

        document
            .getElementById("footerBack")
            .textContent =
            site.footer.backToTop;


    } catch (error) {

        console.error(
            "Site content could not be loaded:",
            error
        );

    }
}


// ==================== PROJECTS ====================

async function loadProjects() {

    const featuredContainer =
        document.getElementById("featuredProject");

    const projectGrid =
        document.getElementById("projectGrid");

    if (!featuredContainer || !projectGrid) {
        return;
    }

    try {

        const response =
            await fetch("content/projects.json");

        if (!response.ok) {
            throw new Error("Could not load projects.json");
        }

        const projects =
            await response.json();

        featuredContainer.innerHTML = "";
        projectGrid.innerHTML = "";


        if (!Array.isArray(projects) ||
            projects.length === 0) {

            featuredContainer.innerHTML = `
                <div class="project-card coming-soon">

                    <div class="future-icon">
                        <i class="fa-solid fa-plus"></i>
                    </div>

                    <div class="project-card-body">

                        <span class="card-label">
                            Projects
                        </span>

                        <h3>
                            More projects loading...
                        </h3>

                        <p>
                            New work will appear here as projects
                            move from idea to something I can actually show.
                        </p>

                    </div>

                </div>
            `;

            return;
        }


        // ==================== FEATURED ====================

        const featured =
            projects[0];

        const featuredTags =
            Array.isArray(featured.tags)
            ? featured.tags
            : [];


        featuredContainer.innerHTML = `

            <div class="featured-project">

                <div class="project-image">

                    <img
                        src="${featured.image || "images/project1.png"}"
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

                    <a class="text-link"
                       href="${featured.github || "#"}"
                       target="_blank"
                       rel="noopener">

                        View GitHub

                        <i class="fa-solid fa-arrow-right"></i>

                    </a>

                </div>

            </div>

        `;


        // ==================== OTHER PROJECTS ====================

        projects.slice(1).forEach(project => {

            const tags =
                Array.isArray(project.tags)
                ? project.tags
                : [];


            const card =
                document.createElement("article");

            card.className =
                "project-card";


            card.innerHTML = `

                <div class="project-card-image">

                    <img
                        src="${project.image || "images/project2.png"}"
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

                    <a class="text-link"
                       href="${project.github || "#"}"
                       target="_blank"
                       rel="noopener">

                        View GitHub

                        <i class="fa-solid fa-arrow-right"></i>

                    </a>

                </div>

            `;

            projectGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Projects could not be loaded:",
            error
        );

    }
}


// ==================== MOBILE MENU ====================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        const nav =
            document.querySelector(".desktop-nav");

        nav.classList.toggle("mobile-open");

    });

}


document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener("click", () => {

            document
                .querySelector(".desktop-nav")
                ?.classList.remove("mobile-open");

        });

    });


// ==================== LOAD CONTENT ====================

loadSite();
loadProjects();


// ==================== SCROLL REVEAL ====================

const sections =
    document.querySelectorAll("main section[id]");

const navLinks =
    document.querySelectorAll(".desktop-nav a");


const observer =
    new IntersectionObserver(
        entries => {

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