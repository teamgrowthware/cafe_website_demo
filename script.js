document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Light/Dark Theme Toggle
    const themeBtn = document.getElementById("theme-toggle");
    const moonIcon = document.getElementById("moon-icon");
    const sunIcon = document.getElementById("sun-icon");

    // Check local storage for theme preference
    const savedTheme = localStorage.getItem("lumina_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateToggleIcons(savedTheme);

    themeBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("lumina_theme", newTheme);
        updateToggleIcons(newTheme);
    });

    function updateToggleIcons(theme) {
        if (theme === "dark") {
            moonIcon.classList.add("active");
            sunIcon.classList.remove("active");
        } else {
            sunIcon.classList.add("active");
            moonIcon.classList.remove("active");
        }
    }

    // 2. Navbar Scroll Effect & Mobile Hamburger Menu
    const navbar = document.getElementById("navbar");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-active");
        hamburger.classList.toggle("toggle");
    });
    
    // Auto close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("mobile-active");
            hamburger.classList.remove("toggle");
        });
    });

    // 3. Smooth Scroll Reveal (Intersection Observer)
    const fadeElements = document.querySelectorAll(".fade-up");
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => appearOnScroll.observe(el));


    // 4. Form Submissions (Demo intercept)
    const resForm = document.getElementById("reservation-form");
    const resSuccess = document.getElementById("res-success");

    if(resForm) {
        resForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = resForm.querySelector('button');
            btn.textContent = "Confirming...";
            btn.style.opacity = "0.7";
            
            setTimeout(() => {
                btn.style.display = "none";
                resSuccess.classList.remove("hidden");
            }, 1000); // 1s fake loading
        });
    }

    const newsForm = document.getElementById("news-form");
    const newsSuccess = document.getElementById("news-success");

    if (newsForm) {
        newsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            newsForm.style.display = "none";
            newsSuccess.classList.remove("hidden");
        });
    }


    // 5. SVG Timeline Plotting (Responsive)
    const svgPath = document.getElementById("connection-path");
    const wrapper = document.querySelector(".timeline-wrapper");
    
    function drawTimeline() {
        if (!svgPath || !wrapper) return;
        if (window.innerWidth <= 900) return; // Hidden on tablet/mobile via CSS
        
        const images = document.querySelectorAll(".dish-img");
        if (images.length < 2) return;

        let pathD = "";
        
        // Find absolute top position of wrapper to offset the SVG coordinates correctly
        const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;

        for (let i = 0; i < images.length; i++) {
            const rect = images[i].getBoundingClientRect();
            // Get center X relative to viewport
            const x = rect.left + rect.width / 2;
            
            // Get center Y relative to the timeline-wrapper
            const y = (rect.top + window.scrollY + rect.height / 2) - wrapperTop;

            if (i === 0) {
                // Start path slightly higher than the center
                pathD += `M ${x} ${y - 150} `; 
                // Line down to center
                pathD += `L ${x} ${y} `;
            } else {
                const prevRect = images[i-1].getBoundingClientRect();
                const prevX = prevRect.left + prevRect.width / 2;
                const prevY = (prevRect.top + window.scrollY + prevRect.height / 2) - wrapperTop;
                
                const midY = (prevY + y) / 2;
                
                // Draw S-curve from previous to current using Cubic Bezier
                pathD += `C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y} `;
            }
        }
        
        // Add a line trailing off at the bottom
        const lastRect = images[images.length - 1].getBoundingClientRect();
        const lastX = lastRect.left + lastRect.width / 2;
        const lastY = (lastRect.top + window.scrollY + lastRect.height / 2) - wrapperTop;
        pathD += `L ${lastX} ${lastY + 150}`;

        svgPath.setAttribute("d", pathD);
    }

    // Draw on resize and load
    window.addEventListener("resize", drawTimeline);
    window.addEventListener("load", drawTimeline);
    
    // Fallback draw in case images take a moment to load their dimensions
    setTimeout(drawTimeline, 100);
    setTimeout(drawTimeline, 500);
});
