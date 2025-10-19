// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Burger Menu Toggle
   */
  const burgerButton = document.getElementById("burger-menu-button");
  const navigationMenu = document.getElementById("navigation-menu");

  if (burgerButton && navigationMenu) {
    burgerButton.addEventListener("click", () => {
      // Toggle 'is-active' class on the button for animations
      burgerButton.classList.toggle("is-active");

      // Toggle 'is-open' class on the navigation menu
      navigationMenu.classList.toggle("is-open");

      // Update ARIA attribute for accessibility
      const isExpanded = burgerButton.getAttribute("aria-expanded") === "true";
      burgerButton.setAttribute("aria-expanded", !isExpanded);
    });
  }

  /**
   * Theme Toggler (with localStorage and system preference)
   */
  const themeToggleButton = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement; // Get the <html> element

  // Function to apply the theme
  const applyTheme = (theme) => {
    if (theme === "dark") {
      htmlElement.classList.add("dark-mode");
      themeToggleButton.setAttribute("aria-checked", "true");
    } else {
      htmlElement.classList.remove("dark-mode");
      themeToggleButton.setAttribute("aria-checked", "false");
    }
  };

  // Check for saved theme in localStorage
  let savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    // If no saved theme, check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    savedTheme = prefersDark ? "dark" : "light";
  }

  // Apply the determined theme on page load
  applyTheme(savedTheme);

  // Add click listener for the toggle button
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      // Check if dark-mode is currently on
      const isDarkMode = htmlElement.classList.contains("dark-mode");

      if (isDarkMode) {
        applyTheme("light");
        localStorage.setItem("theme", "light"); // Save preference
      } else {
        applyTheme("dark");
        localStorage.setItem("theme", "dark"); // Save preference
      }
    });
  }
});

// --- 1. Select Elements ---
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navigation__link");

// (Assuming you have these defined for the mobile menu part)
// const navigationMenu = document.querySelector(".navigation__menu");
// const burgerButton = document.querySelector(".burger-button");

// --- 2. Define the Observer Callback Function ---
// This function runs WHEN a section's visibility changes
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    // Check if the section is intersecting (at least 60% visible)
    if (entry.isIntersecting) {
      const visibleSectionId = entry.target.id;

      // Remove 'active' class from ALL nav links
      navLinks.forEach((link) => {
        link.classList.remove("navigation__link--active");
      });

      // Find the ONE nav link that matches the visible section
      const activeLink = document.querySelector(
        `.navigation__link[href="#${visibleSectionId}"]`
      );

      // Add the 'active' class to that specific link
      if (activeLink) {
        activeLink.classList.add("navigation__link--active");
      }
    }
  });
};

// --- 3. Setup and Run the Observer (Scrollspy) ---
// Only run this if we found sections and links
if (sections.length > 0 && navLinks.length > 0) {
  // A. Define the options
  const observerOptions = {
    root: null, // observes intersections relative to the viewport
    rootMargin: "0px",
    threshold: 0.6, // Fire callback when 60% of the section is visible
  };

  // B. Create the observer
  const sectionObserver = new IntersectionObserver(
    observerCallback,
    observerOptions
  );

  // C. Tell the observer to watch each section
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// --- 4. Setup Mobile Menu Clicks ---
// (This part was correct, just assuming 'navigationMenu' and 'burgerButton' exist)
if (navigationMenu && burgerButton) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // If the mobile menu is open, close it
      if (navigationMenu.classList.contains("is-open")) {
        burgerButton.classList.remove("is-active");
        navigationMenu.classList.remove("is-open");
        burgerButton.setAttribute("aria-expanded", "false");
      }
    });
  });
}
