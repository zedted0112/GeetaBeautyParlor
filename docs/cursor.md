

✅ Hero Image (Responsive Background with Overlay)

If you’re using a background image on a div:

<section
  class="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
  style="background-image: url('/your-image-path.jpg');"
>
  <!-- Optional overlay -->
  <div class="absolute inset-0 bg-black/30"></div>

  <!-- Content on top -->
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
    <h1 class="text-4xl md:text-5xl font-bold">Geeeta Makeovers</h1>
    <p class="mt-4 max-w-xl">Artistry that reflects your true beauty...</p>
    <!-- Buttons -->
  </div>
</section>


⸻

✅ OR: Using <img> Tag (Full-Width, Full-Screen Responsive)

<section class="relative w-full h-screen overflow-hidden">
  <img
    src="/your-image-path.jpg"
    alt="Bridal Banner"
    class="w-full h-full object-cover object-center"
  />
  <!-- Optional overlay -->
  <div class="absolute inset-0 bg-black/20"></div>

  <!-- Content over image -->
  <div class="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
    <h1 class="text-4xl md:text-5xl font-bold">Geeeta Makeovers</h1>
    <p class="mt-4 max-w-xl">Artistry that reflects your true beauty...</p>
  </div>
</section>


⸻

🔧 Optional Tailwind Fixes

If you still see white/gray borders:

/* in global.css or tailwind config */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

And in index.html or top-most wrapper:

<div class="w-full overflow-hidden">
  <!-- rest of your layout -->
</div>


⸻

🔍 Quick GitHub Deploy Check

If your assets like images fail to load on GitHub Pages:
	1.	Ensure paths are relative:
./assets/image.jpg instead of /assets/image.jpg
	2.	Use this in vite.config.js if using Vite:

export default defineConfig({
  base: '/GeetaBeautyParlor/',
  // ...
})

Then re-build:

npm run build

Push the dist/ to gh-pages or set deployment source to main/root.

⸻
