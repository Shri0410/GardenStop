const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../public/images');
const artifactDir = path.resolve('C:/Users/waghm/.gemini/antigravity/brain/f5f86f00-2f29-454a-bf1a-64bf71d273c4');

// 1. Copy generated AI images
const copyMap = {
  'pizza_corn_real_1795076474452.jpg': 'pizza-corn.jpg',
  'pizza_paneer_1795077692515.jpg': 'pizza-paneer.jpg',
  'pizza_schezwan_1795077725436.jpg': 'pizza-schezwan.jpg',
  'pizza_tomato_1795077786598.jpg': 'pizza-tomato.jpg',
  'pizza_capsicum_1795077973847.jpg': 'pizza-capsicum.jpg',
  'sandwich_cheese_grill_1795077749876.jpg': 'sandwich-cheese-grill.jpg',
  'sandwich_paneer_1795077810594.jpg': 'sandwich-paneer.jpg',
  'sandwich_chocolate_1795077980646.jpg': 'sandwich-chocolate.jpg',
  'burger_classic_1795077843728.jpg': 'burger-classic.jpg',
  'burger_cheese_1795077898449.jpg': 'burger-cheese.jpg',
  'shake_coldcoffee_1795077858232.jpg': 'shake-coldcoffee.jpg',
  'shake_strawberry_1795077976731.jpg': 'shake-strawberry.jpg',
  'shake_oreo_1795078038923.jpg': 'shake-oreo.jpg',
};

console.log('Copying generated images...');
for (const [src, dest] of Object.entries(copyMap)) {
  const srcPath = path.join(artifactDir, src);
  const destPath = path.join(targetDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest} (${fs.statSync(destPath).size} bytes)`);
  } else {
    console.warn(`Source not found: ${srcPath}`);
  }
}

// 2. Also update deluxe pizza and tandoori pizza
// Deluxe pizza can use the beautiful Capsicum / Corn / Paneer photo
fs.copyFileSync(path.join(targetDir, 'pizza-schezwan.jpg'), path.join(targetDir, 'pizza-deluxe.jpg'));
fs.copyFileSync(path.join(targetDir, 'pizza-paneer.jpg'), path.join(targetDir, 'pizza-tandoori.jpg'));
// Dryfruit sandwich can use chocolate sandwich or cheese grill
fs.copyFileSync(path.join(targetDir, 'sandwich-chocolate.jpg'), path.join(targetDir, 'sandwich-dryfruit.jpg'));
fs.copyFileSync(path.join(targetDir, 'sandwich-cheese-grill.jpg'), path.join(targetDir, 'sandwich-pineapple.jpg'));
// KitKat shake can use the rich oreo shake or chocolate cold coffee
fs.copyFileSync(path.join(targetDir, 'shake-oreo.jpg'), path.join(targetDir, 'shake-kitkat.jpg'));
fs.copyFileSync(path.join(targetDir, 'shake-coldcoffee.jpg'), path.join(targetDir, 'shake-crushcoffee.jpg'));

// 3. Download verified Wikimedia Commons photos
const wikimediaFiles = [
  { file: 'File:Aloo_Tikki_Burger.jpg', dest: 'burger-alootikki.jpg' },
  { file: 'File:Chocolate_lava_cake.jpg', dest: 'dessert-chocolava.jpg' },
  { file: 'File:Sizzling_Brownie.jpg', dest: 'dessert-brownie.jpg' },
  { file: 'File:Kathi_Roll.jpg', dest: 'dish-frankie.jpg' },
  { file: 'File:French_fries.jpg', dest: 'banner-fries.jpg' },
  { file: 'File:French_fries.jpg', dest: 'starter-perifries.jpg' },
];

async function downloadWikimedia() {
  for (const item of wikimediaFiles) {
    try {
      console.log(`Fetching ${item.file}...`);
      const apiRes = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.file)}&prop=imageinfo&iiprop=url&format=json`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const json = await apiRes.json();
      const pages = json.query.pages;
      const page = Object.values(pages)[0];
      if (page && page.imageinfo && page.imageinfo[0]) {
        const imgUrl = page.imageinfo[0].url;
        console.log(`Downloading ${imgUrl} -> ${item.dest}`);
        const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          fs.writeFileSync(path.join(targetDir, item.dest), buffer);
          console.log(`Saved ${item.dest} (${buffer.length} bytes)`);
        }
      }
    } catch (err) {
      console.error(`Failed ${item.file}:`, err.message);
    }
  }
}

downloadWikimedia().then(() => {
  console.log('All image updates finished!');
});
