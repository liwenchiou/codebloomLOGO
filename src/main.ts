interface LogoOption {
  id: string;
  name: string;
  src: string;
  selected: boolean;
}

// 使用 Vite 的 import.meta.glob 抓取所有 png
const logoModules = import.meta.glob('/src/logos/*.png', { eager: true });

let logoList: LogoOption[] = [];

// 初始化：讀取 localStorage 或建立新清單
function initLogos() {
  const saved = localStorage.getItem('logoList');
  if (saved) {
    logoList = JSON.parse(saved);
  } else {
    logoList = Object.keys(logoModules).map((path, index) => {
      const fileName = path.split('/').pop() || `logo${index + 1}.png`;
      return {
        id: `logo${index + 1}`,
        name: fileName.replace('.png', ''),
        src: (logoModules[path] as any).default,
        selected: false,
      };
    });
    saveLogos();
  }
}


// 儲存到 localStorage
function saveLogos() {
  console.log(logoList);
  localStorage.setItem('logoList', JSON.stringify(logoList));
}

// 渲染左右區塊
function renderLogos() {
  const unconfirmed = document.getElementById('logo-unconfirmed');
  const confirmed = document.getElementById('logo-confirmed');
  if (!unconfirmed || !confirmed) return;

  unconfirmed.innerHTML = '';
  confirmed.innerHTML = '';

  logoList.forEach((logo) => {
    const img = document.createElement('img');
    img.src = logo.src;
    img.alt = logo.name;
    img.className = 'logo-preview m-2';
    img.style.width = '250px';
    img.onclick = () => selectLogo(logo.id);

    if (logo.selected) {
      confirmed.appendChild(img);
    } else {
      unconfirmed.appendChild(img);
    }
  });
}

// 選擇 Logo
function selectLogo(id: string) {
  logoList.forEach((logo) => {
    if (logo.id === id) {
      logo.selected = !logo.selected; // 切換狀態
    }
  });
  saveLogos();
  renderLogos();
}

// 初始化流程
document.addEventListener('DOMContentLoaded', () => {
  initLogos();
  renderLogos();
});
