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


// ==================== HELPER ====================

function createElementFromHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}


// ==================== SITE CONTENT FROM CMS ====================

async function loadSiteContent() {

    try {

        const response = await fetch("content/site.json");

        if (!response.ok) {
            throw new Error("Could not load site.json");
        }

        const site = await response.json();


        // ====================
        // GENERAL
        // ====================

        if (site.general) {

            if (site.general.siteTitle) {
                document.title = site.general.siteTitle;
            }

            const metaDescription =
                document.querySelector('meta[name="description"]');

            if (metaDescription && site.general.metaDescription) {
                metaDescription.setAttribute(
                    "content",
                    site.general.metaDescription
                );
            }

            const favicon =
                document.querySelector('link[rel="icon"]');

            if (favicon && site.general.favicon) {
                favicon.href = site.general.favicon;
            }
        }


        // ====================
        // HEADER
        // ====================

        if (site.header) {

            const brand =
                document.querySelector(".brand");

            if (brand && site.header.brand) {
                brand.textContent = site.header.brand;
            }

            const headerLinks =
                document.querySelectorAll(".header-actions > a");

            if (headerLinks.length >= 4) {

                // Email
                if (site.header.email) {
                    headerLinks[0].href =
                        `mailto:${site.header.email}`;
                }

                // GitHub
                if (site.header.github) {
                    headerLinks[1].href =
                        site.header.github;
                }

                // LinkedIn
                if (site.header.linkedin) {
                    headerLinks[2].href =
                        site.header.linkedin;
                }

                // Resume
                if (site.header.resume) {
                    headerLinks[3].href =
                        site.header.resume;
                }
            }
        }


        // ====================
        // HERO
        // ====================

        if (site.hero) {

            const hero = site.hero;

            const heroSection =
                document.querySelector("#intro");

            if (heroSection) {

                const eyebrow =
                    heroSection.querySelector(".eyebrow");

                if (eyebrow && hero.eyebrow) {
                    eyebrow.innerHTML =
                        `<span></span>${hero.eyebrow}`;
                }


                const heading =
                    heroSection.querySelector("h1");

                if (heading) {

                    heading.innerHTML = `
                        ${hero.heading || ""}
                        <em>${hero.headingEmphasis || ""}</em><br>
                        I love creating.
                    `;
                }


                const heroText =
                    heroSection.querySelector(".hero-text");

                if (heroText && hero.description) {
                    heroText.textContent =
                        hero.description;
                }


                // Buttons

                const heroButtons =
                    heroSection.querySelectorAll(".hero-actions a");

                if (heroButtons.length >= 2) {

                    if (hero.primaryButton) {

                        heroButtons[0].innerHTML = `
                            ${hero.primaryButton.label || ""}
                            <i class="fa-solid fa-arrow-down"></i>
                        `;

                        if (hero.primaryButton.link) {
                            heroButtons[0].href =
                                hero.primaryButton.link;
                        }
                    }


                    if (hero.secondaryButton) {

                        heroButtons[1].innerHTML = `
                            ${hero.secondaryButton.label || ""}
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        `;

                        if (site.header?.resume) {
                            heroButtons[1].href =
                                site.header.resume;
                        }
                    }
                }


                // Quick stats

                const statBoxes =
                    heroSection.querySelectorAll(".quick-stats > div");

                if (Array.isArray(hero.stats)) {

                    hero.stats.forEach((stat, index) => {

                        if (!statBoxes[index]) return;

                        const number =
                            statBoxes[index].querySelector("strong");

                        const label =
                            statBoxes[index].querySelector("span");

                        if (number) {
                            number.textContent =
                                stat.number || "";
                        }

                        if (label) {
                            label.textContent =
                                stat.label || "";
                        }
                    });
                }


                // Code card

                const codeCard =
                    heroSection.querySelector(".hero-card");

                if (codeCard && hero.codeCard) {

                    const code = codeCard.querySelector("code");
                    const filename =
                        codeCard.querySelector(".code-top small");

                    if (filename) {
                        filename.textContent =
                            hero.codeCard.filename || "";
                    }

                    if (code) {

                        const stack =
                            Array.isArray(hero.codeCard.stack)
                                ? hero.codeCard.stack
                                : [];

                        code.innerHTML = `
<span class="purple">const</span> developer = {
  name: <span class="pink">"${hero.codeCard.name || ""}"</span>,
  focus: <span class="pink">"${hero.codeCard.focus || ""}"</span>,
  stack: [${stack.map(item =>
      `<span class="pink">"${item}"</span>`
  ).join(", ")}],
  mindset: <span class="pink">"${hero.codeCard.mindset || ""}"</span>
};
                        `;
                    }
                }


                // Floating badges

                const badges =
                    heroSection.querySelectorAll(".floating-badge");

                if (Array.isArray(hero.badges)) {

                    hero.badges.forEach((badge, index) => {

                        if (!badges[index]) return;

                        badges[index].innerHTML = `
                            <i class="fa-solid ${badge.icon || ""}"></i>
                            ${badge.label || ""}
                        `;
                    });
                }
            }
        }


        // ====================
        // ABOUT
        // ====================

        if (site.about) {

            const about = site.about;
            const section =
                document.querySelector("#about");

            if (section) {

                const eyebrow =
                    section.querySelector(".section-heading .eyebrow");

                const heading =
                    section.querySelector(".section-heading h2");

                const lead =
                    section.querySelector(".about-content .lead");

                const paragraphs =
                    section.querySelectorAll(".about-content > p:not(.lead)");

                if (eyebrow) {
                    eyebrow.textContent =
                        about.eyebrow || "";
                }

                if (heading) {
                    heading.textContent =
                        about.heading || "";
                }

                if (lead) {
                    lead.textContent =
                        about.lead || "";
                }

                if (Array.isArray(about.paragraphs)) {

                    about.paragraphs.forEach((text, index) => {

                        if (paragraphs[index]) {
                            paragraphs[index].textContent = text;
                        }
                    });
                }


                // Tech pills

                const pillsContainer =
                    section.querySelector(".tech-pills");

                if (pillsContainer &&
                    Array.isArray(about.techPills)) {

                    pillsContainer.innerHTML =
                        about.techPills
                            .map(item => `<span>${item}</span>`)
                            .join("");
                }


                // Portrait

                const portrait =
                    section.querySelector(".portrait-frame img");

                if (portrait && about.photo) {
                    portrait.src = about.photo;
                }

                const caption =
                    section.querySelector(".portrait-caption");

                if (caption && about.photoCaption) {

                    caption.innerHTML = `
                        <span></span>${about.photoCaption}
                    `;
                }
            }
        }


        // ====================
        // EDUCATION
        // ====================

        if (Array.isArray(site.education)) {

            const section =
                document.querySelector("#edu");

            const timeline =
                section?.querySelector(".timeline");

            if (timeline) {

                timeline.innerHTML = "";

                site.education.forEach(education => {

                    const item =
                        document.createElement("article");

                    item.className =
                        "timeline-item";

                    item.innerHTML = `

                        <div class="timeline-dot"></div>

                        <div class="timeline-year">
                            ${education.year || ""}
                        </div>

                        <div class="timeline-card">

                            <span class="card-label">
                                ${education.label || ""}
                            </span>

                            <h3>
                                ${education.degree || ""}
                            </h3>

                            <p>
                                ${education.institution || ""}
                            </p>

                            ${
                                education.description
                                    ? `<p>${education.description}</p>`
                                    : ""
                            }

                            ${
                                education.link
                                    ? `
                                        <a
                                            href="${education.link}"
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            Visit programme
                                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        </a>
                                    `
                                    : ""
                            }

                        </div>
                    `;

                    timeline.appendChild(item);
                });
            }
        }


        // ====================
        // EXPERIENCE
        // ====================

        if (Array.isArray(site.experience)) {

            const section =
                document.querySelector("#exp");

            const grid =
                section?.querySelector(".experience-grid");

            if (grid) {

                grid.innerHTML = "";

                site.experience.forEach((experience, index) => {

                    const card =
                        document.createElement("article");

                    card.className =
                        `experience-card${index === 0 ? " featured" : ""}`;

                    card.innerHTML = `

                        <div class="experience-top">

                            <span class="company-icon">
                                <i class="fa-solid ${experience.icon || ""}"></i>
                            </span>

                            <span>
                                ${experience.date || ""}
                            </span>

                        </div>

                        <h3>
                            ${experience.role || ""}
                        </h3>

                        <p class="company">
                            ${experience.company || ""}
                        </p>

                        <p>
                            ${experience.description || ""}
                        </p>

                        <div class="tags">

                            ${
                                Array.isArray(experience.tags)
                                    ? experience.tags
                                        .map(tag => `<span>${tag}</span>`)
                                        .join("")
                                    : ""
                            }

                        </div>
                    `;

                    grid.appendChild(card);
                });
            }
        }


        // ====================
        // SKILLS
        // ====================

        if (site.skills) {

            const section =
                document.querySelector("#skills");

            if (section) {

                const eyebrow =
                    section.querySelector(".section-heading .eyebrow");

                const heading =
                    section.querySelector(".section-heading h2");

                const subtitle =
                    section.querySelector(".section-subtitle");

                if (eyebrow) {
                    eyebrow.textContent =
                        site.skills.eyebrow || "";
                }

                if (heading) {
                    heading.textContent =
                        site.skills.heading || "";
                }

                if (subtitle) {
                    subtitle.textContent =
                        site.skills.subtitle || "";
                }


                const layout =
                    section.querySelector(".skills-layout");

                if (layout &&
                    Array.isArray(site.skills.categories)) {

                    layout.innerHTML = "";

                    site.skills.categories.forEach(category => {

                        const card =
                            document.createElement("div");

                        card.className =
                            "stack-card";

                        card.innerHTML = `

                            <div class="stack-title">

                                <i class="fa-solid ${category.icon || ""}"></i>

                                <h3>
                                    ${category.title || ""}
                                </h3>

                            </div>

                            <div class="skill-list">

                                ${
                                    Array.isArray(category.items)
                                        ? category.items
                                            .map(item => `<span>${item}</span>`)
                                            .join("")
                                        : ""
                                }

                            </div>
                        `;

                        layout.appendChild(card);
                    });
                }
            }
        }


        // ====================
        // PROJECT SECTION TEXT
        // ====================

        if (site.projectsSection) {

            const section =
                document.querySelector("#projects");

            if (section) {

                const eyebrow =
                    section.querySelector(".eyebrow");

                const heading =
                    section.querySelector("h2");

                const subtitle =
                    section.querySelector(".section-subtitle");

                if (eyebrow) {
                    eyebrow.textContent =
                        site.projectsSection.eyebrow || "";
                }

                if (heading) {
                    heading.textContent =
                        site.projectsSection.heading || "";
                }

                if (subtitle) {
                    subtitle.textContent =
                        site.projectsSection.subtitle || "";
                }
            }
        }


        // ====================
        // FUTURE PROJECTS
        // ====================

        if (site.future) {

            const section =
                document.querySelector("#future");

            if (section) {

                const eyebrow =
                    section.querySelector(".eyebrow");

                const heading =
                    section.querySelector("h2");

                const subtitle =
                    section.querySelector(".section-subtitle");

                if (eyebrow) {
                    eyebrow.textContent =
                        site.future.eyebrow || "";
                }

                if (heading) {
                    heading.textContent =
                        site.future.heading || "";
                }

                if (subtitle) {
                    subtitle.textContent =
                        site.future.subtitle || "";
                }


                const roadmap =
                    section.querySelector(".roadmap");

                if (roadmap &&
                    Array.isArray(site.future.projects)) {

                    roadmap.innerHTML = "";

                    site.future.projects.forEach(project => {

                        const card =
                            document.createElement("article");

                        card.className =
                            "roadmap-card";

                        card.innerHTML = `

                            <div class="roadmap-status">
                                ${project.status || ""}
                            </div>

                            <div class="roadmap-icon">
                                <i class="fa-solid ${project.icon || ""}"></i>
                            </div>

                            <h3>
                                ${project.title || ""}
                            </h3>

                            <p>
                                ${project.description || ""}
                            </p>

                            <div class="roadmap-line">
                                <span></span>
                            </div>
                        `;

                        roadmap.appendChild(card);
                    });
                }
            }
        }


        // ====================
        // CONTACT
        // ====================

        if (site.contact) {

            const section =
                document.querySelector("#contact-section");

            if (section) {

                const eyebrow =
                    section.querySelector(".eyebrow");

                const heading =
                    section.querySelector("h2");

                const description =
                    section.querySelector(".contact-card > div:first-child > p:last-child");

                const emailButton =
                    section.querySelector(".contact-actions .button");

                const contactLinks =
                    section.querySelectorAll(".contact-links a");

                if (eyebrow) {
                    eyebrow.textContent =
                        site.contact.eyebrow || "";
                }

                if (heading) {
                    heading.textContent =
                        site.contact.heading || "";
                }

                if (description) {
                    description.textContent =
                        site.contact.description || "";
                }

                if (emailButton) {

                    emailButton.innerHTML = `
                        ${site.contact.emailButton || ""}
                        <i class="fa-solid fa-arrow-right"></i>
                    `;

                    if (site.header?.email) {
                        emailButton.href =
                            `mailto:${site.header.email}`;
                    }
                }

                if (contactLinks.length >= 2) {

                    contactLinks[0].textContent =
                        site.contact.githubLabel || "GitHub";

                    contactLinks[1].textContent =
                        site.contact.linkedinLabel || "LinkedIn";

                    if (site.header?.github) {
                        contactLinks[0].href =
                            site.header.github;
                    }

                    if (site.header?.linkedin) {
                        contactLinks[1].href =
                            site.header.linkedin;
                    }
                }
            }
        }


        // ====================
        // FOOTER
        // ====================

        if (site.footer) {

            const footer =
                document.querySelector("footer");

            if (footer) {

                const text =
                    footer.querySelector("p");

                const backToTop =
                    footer.querySelector("a");

                if (text) {
                    text.textContent =
                        site.footer.text || "";
                }

                if (backToTop) {
                    backToTop.textContent =
                        site.footer.backToTop || "";
                }
            }
        }


    } catch (error) {

        console.error(
            "Site content could not be loaded:",
            error
        );
    }
}


// ==================== PROJECTS FROM CMS ====================

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


        // ====================
        // FEATURED PROJECT
        // ====================

        const featured =
            projects[0];

        const featuredTags =
            Array.isArray(featured.tags)
                ? featured.tags
                : [];

        const featuredImage =
            featured.image ||
            "content/project1.png";

        const featuredGithub =
            featured.github ||
            "#";


        featuredContainer.innerHTML = `

            <div class="featured-project">

                <div class="project-image">

                    <img
                        src="${featuredImage}"
                        alt="${featured.title || ""}"
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
                        ${featured.title || ""}
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


        // ====================
        // OTHER PROJECTS
        // ====================

        const otherProjects =
            projects.slice(1);

        otherProjects.forEach((project) => {

            const tags =
                Array.isArray(project.tags)
                    ? project.tags
                    : [];

            const image =
                project.image ||
                "content/project2.png";

            const github =
                project.github ||
                "#";


            const card =
                document.createElement("article");

            card.className =
                "project-card";

            card.innerHTML = `

                <div class="project-card-image">

                    <img
                        src="${image}"
                        alt="${project.title || ""}"
                    >

                </div>

                <div class="project-card-body">

                    <span class="card-label">
                        Web / Software Project
                    </span>

                    <h3>
                        ${project.title || ""}
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

        console.error(
            "Projects could not be loaded:",
            error
        );

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


// ==================== LOAD CMS CONTENT
// ====================

loadSiteContent();
loadProjects();


// ==================== SCROLL REVEAL
// ====================

const sections =
    document.querySelectorAll("main section[id]");

const navLinks =
    document.querySelectorAll(".desktop-nav a");

const observer =
    new IntersectionObserver(
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


// ==================== MOBILE MENU
// ====================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        const nav =
            document.querySelector(".desktop-nav");

        nav.classList.toggle("mobile-open");

    });
}


// Close mobile menu

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", () => {

        document
            .querySelector(".desktop-nav")
            ?.classList.remove("mobile-open");

    });

});