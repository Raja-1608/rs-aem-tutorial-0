import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto block `*/fragments/*` references
    const fragments = main.querySelectorAll('a[href*="/fragments/"]');
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(frag.firstElementChild);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Hard override of the home page content so we are not dependent
 * on external authored content (Drive/AEM).
 * This rebuilds <main> with our Velu Chits layout.
 * @param {Element} main The main element
 * @returns {boolean} true if we overrode the page
 */
function overrideHomePage(main) {
  if (!main) return false;

  // Only override the root page (/ or /index)
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path && path !== '/' && path !== '/index') {
    return false;
  }

  // Clear whatever default "Congrats..." content is there
  main.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'vc-page';

  wrapper.innerHTML = `
    <section class="vc-hero">
      <div class="vc-hero-text">
        <h1>Velu Chits – Smart Savings for Everyone</h1>
        <p>Welcome to Velu Chits – a trusted partner for smart and disciplined savings through chit funds.</p>
        <a href="#services" class="vc-btn-primary">Start Your Savings Journey</a>
      </div>
      <div class="vc-hero-image">
        <!-- 🔁 Update this path to your real hero image file in the repo -->
        <img src="/icons/hero.png" alt="Velu Chits Hero" loading="lazy">
      </div>
    </section>

    <section class="vc-section" id="why">
      <h2>Your Smart Savings Journey Starts Here</h2>
      <p>Flexible chit groups, transparent bidding, and secure payouts tailored for working professionals and families.</p>
    </section>

    <section class="vc-section" id="features">
      <h2>Why Choose Velu Chits?</h2>
      <ul class="vc-grid">
        <li>
          <h3>Trusted Management</h3>
          <p>Run with disciplined processes and clear documentation for every member.</p>
        </li>
        <li>
          <h3>Flexible Groups</h3>
          <p>Multiple chit values and tenures to match your monthly budget.</p>
        </li>
        <li>
          <h3>On-time Payouts</h3>
          <p>Committed payout schedules backed by transparent auctions.</p>
        </li>
      </ul>
    </section>

    <section class="vc-section" id="stats">
      <h2>Our Strength in Numbers</h2>
      <div class="vc-stats">
        <div><strong>50+</strong><span>Active Groups</span></div>
        <div><strong>200+</strong><span>Happy Members</span></div>
        <div><strong>₹X L+</strong><span>Total Value Managed</span></div>
      </div>
    </section>

    <section class="vc-section" id="services">
      <h2>Our Services</h2>
      <ul class="vc-grid">
        <li>
          <h3>Regular Chit Plans</h3>
          <p>Monthly contributions with competitive auction discounts and secure payouts.</p>
        </li>
        <li>
          <h3>Short-Term Chits</h3>
          <p>Ideal for immediate needs like education fees, home improvements and functions.</p>
        </li>
        <li>
          <h3>Custom Group Setup</h3>
          <p>Create private chit groups for your friends, family or office colleagues.</p>
        </li>
      </ul>
    </section>

    <section class="vc-section" id="blog">
      <h2>Latest from Velu Chits</h2>
      <p>Coming soon: tips on savings, chit fund basics, and financial discipline.</p>
    </section>
  `;

  main.appendChild(wrapper);
  return true;
}

/**
 * Build custom Velu Chits header if header is empty.
 * @param {Document} doc
 */
function buildVeluHeader(doc) {
  const header = doc.querySelector('header');
  if (!header) return;

  // if something already there, don't override
  if (header.querySelector('.vc-header')) return;

  header.innerHTML = `
    <div class="vc-header">
      <a href="/" class="vc-brand">Velu Chits</a>
      <button class="vc-nav-toggle" aria-label="Toggle navigation">
        ☰
      </button>
      <nav class="vc-menu">
        <a class="vc-menu-link" href="#why">Why Us</a>
        <a class="vc-menu-link" href="#services">Services</a>
        <a class="vc-menu-link" href="#stats">Stats</a>
        <a class="vc-menu-link" href="#blog">Blog</a>
        <a class="vc-menu-link" href="#contact">Contact</a>
      </nav>
    </div>
  `;
}

/**
 * Build custom Velu Chits footer if footer is empty.
 * @param {Document} doc
 */
function buildVeluFooter(doc) {
  const footer = doc.querySelector('footer');
  if (!footer) return;

  if (footer.querySelector('.vc-footer')) return;

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="vc-footer">
      <div class="vc-footer-top">
        <div class="vc-footer-brand">
          <div class="vc-footer-title">Velu Chits</div>
          <p>Smart and disciplined savings through transparent chit funds.</p>
        </div>
        <div class="vc-footer-columns">
          <div class="vc-footer-col">
            <h3>Quick Links</h3>
            <a href="#why">Why Us</a>
            <a href="#services">Services</a>
            <a href="#stats">Stats</a>
            <a href="#blog">Latest</a>
          </div>
          <div class="vc-footer-col">
            <h3>Contact</h3>
            <p>Phone: +91-XXXXXXXXXX</p>
            <p>Email: info@veluchits.com</p>
          </div>
          <div class="vc-footer-col">
            <h3>Location</h3>
            <p>Velu Chits Office</p>
            <p>Your City, India</p>
          </div>
        </div>
      </div>
      <div class="vc-footer-bottom">
        <span>© ${year} Velu Chits. All rights reserved.</span>
      </div>
    </div>
  `;
}

/**
 * Setup mobile header toggle if our custom header is present.
 * @param {Document} doc
 */
function initVeluHeader(doc) {
  const header = doc.querySelector('header');
  if (!header) return;

  const toggle = header.querySelector('.vc-nav-toggle');
  const menu = header.querySelector('.vc-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // First, replace the default tutorial content with our own homepage
  const overridden = overrideHomePage(main);

  // Basic decorations still safe to run
  decorateButtons(main);
  decorateIcons(main);

  // If we overrode the page, we can skip auto hero/block logic
  if (overridden) {
    return;
  }

  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  // Try standard header/footer loading (no harm if it fails)
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  // After header/footer attempt to load, ensure our custom ones exist
  window.setTimeout(() => {
    buildVeluHeader(doc);
    buildVeluFooter(doc);
    initVeluHeader(doc);
  }, 500);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
