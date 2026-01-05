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
 * (kept from boilerplate in case we use it later)
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
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
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
 * Build complete Velu Chits home page inside <main>
 * with full-width hero banner and sections.
 * @param {Element} main
 * @returns {boolean}
 */
function overrideHomePage(main) {
  if (!main) return false;

  // Only override the root page (/ or /index)
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path && path !== '/' && path !== '/index') {
    return false;
  }

  // Clear whatever default content is there
  main.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'vc-page';

  wrapper.innerHTML = `
    <!-- Full-width hero banner with overlay text -->
    <section class="vc-hero-banner">
      <div class="vc-hero-overlay">
        <h1>Your Smart Savings Journey Starts Here</h1>
      </div>
    </section>

    <!-- Intro text under hero -->
    <section class="vc-section vc-section-intro" id="intro">
      <h2>Velu Chits – Smart Savings for Everyone</h2>
      <p>Welcome to Velu Chits – a trusted partner for smart and disciplined savings through chit funds.</p>
    </section>

    <!-- Why choose section -->
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

    <!-- Stats section -->
    <section class="vc-section" id="stats">
      <h2>Our Strength in Numbers</h2>
      <div class="vc-stats">
        <div><strong>50+</strong><span>Active Groups</span></div>
        <div><strong>200+</strong><span>Happy Members</span></div>
        <div><strong>₹X L+</strong><span>Total Value Managed</span></div>
      </div>
    </section>

    <!-- Services section -->
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

    <!-- Blog / latest section -->
    <section class="vc-section" id="blog">
      <h2>Latest from Velu Chits</h2>
      <p>Coming soon: tips on savings, chit fund basics, and financial discipline.</p>
    </section>
  `;

  main.appendChild(wrapper);
  return true;
}

/**
 * Inject custom Velu Chits header and footer directly into
 * the <header> and <footer> elements.
 * @param {Document} doc
 */
function injectVeluHeaderFooter(doc) {
  const header = doc.querySelector('header');
  if (header) {
    header.innerHTML = `
      <div class="vc-header">
        <a href="/" class="vc-brand">Velu Chits</a>

        <button class="vc-nav-toggle" aria-label="Toggle navigation">
          ☰
        </button>

        <nav class="vc-menu">
          <a class="vc-menu-link" href="#features">Why Us</a>
          <a class="vc-menu-link" href="#services">Services</a>
          <a class="vc-menu-link" href="#stats">Stats</a>
          <a class="vc-menu-link" href="#blog">Blog</a>
          <a class="vc-menu-link" href="#contact">Contact</a>
        </nav>
      </div>
    `;
  }

  const footer = doc.querySelector('footer');
  if (footer) {
    footer.innerHTML = `
      <div class="vc-footer">
        <div class="vc-footer-inner">
          <div class="vc-footer-company">
            <h2>Velu Chit Pvt. Ltd.</h2>
            <p>Smart, disciplined chit savings for everyone.</p>
            <ul class="vc-footer-contact-list">
              <li class="vc-footer-contact-item">
                <div class="vc-footer-icon"><span>📍</span></div>
                <div class="vc-footer-contact-lines">
                  <span>RS Tower, Raja Nagar</span>
                  <span>Chennai, Tamil Nadu – 123321</span>
                  <span>India</span>
                </div>
              </li>
              <li class="vc-footer-contact-item">
                <div class="vc-footer-icon"><span>📞</span></div>
                <div class="vc-footer-contact-lines">
                  <span>+91 98765 43210</span>
                </div>
              </li>
              <li class="vc-footer-contact-item">
                <div class="vc-footer-icon"><span>✉️</span></div>
                <div class="vc-footer-contact-lines">
                  <span>support@veluchit.com</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="vc-footer-about" id="contact">
            <h3>About the company</h3>wd
            <p>With 50+ years of excellence, Velu Chit continues to serve customers with honest, secure investments and personal support. Trust built over decades — and we proudly grow that trust every day.</p>
            <div class="vc-footer-social">
              <a href="#" class="vc-footer-social-link" aria-label="Facebook">Fb</a>
              <a href="#" class="vc-footer-social-link" aria-label="X">X</a>
              <a href="#" class="vc-footer-social-link" aria-label="LinkedIn">In</a>
              <a href="#" class="vc-footer-social-link" aria-label="GitHub">Gh</a>
            </div>
          </div>
        </div>
        <div class="vc-footer-bottom">
          <span>© 2025 Velu Chits. All rights reserved.</span>
        </div>
      </div>
    `;
  }
}

/**
 * Setup mobile header toggle when our header exists.
 * @param {Document} doc
 */
function initVeluHeader(doc) {
  const header = doc.querySelector('.vc-header');
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
  const overridden = overrideHomePage(main);

  decorateButtons(main);
  decorateIcons(main);

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

  // inject our header + footer early
  injectVeluHeaderFooter(doc);

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
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

  // we control header/footer in JS, so skip AEM versions
  // loadHeader(doc.querySelector('header'));
  // loadFooter(doc.querySelector('footer'));

  initVeluHeader(doc);

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
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
