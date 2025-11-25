/**
 * Hero block customization for Velu Chits.
 * Overrides the hero image using an external URL.
 */
export default function decorate(block) {
  // Find the first image inside the hero block
  const img = block.querySelector('picture img, img');
  if (!img) return;

  // Use the external Shutterstock hero image
  img.src = 'https://images.ctfassets.net/hrltx12pl8hq/URFxmWAdYfRkltZ1la9fe/d02e06f90a3770f9165143e8e8eb9096/royalty-free-video-shutterstock.jpg';
  img.removeAttribute('srcset'); // prevent AEM from replacing it back

  // Add a clean alt text if missing
  if (!img.alt || !img.alt.trim()) {
    img.alt = 'Growth concept jar with plant and coins';
  }
}
