/* ============================================================
   ⚙️ CẤU HÌNH — sửa mọi thứ về liên hệ / bản đồ ở ĐÚNG khối này
   ------------------------------------------------------------
   • social: dán link thật vào. Để chuỗi rỗng '' thì kênh đó tự
     hiện "Đang cập nhật" và không bấm được (không còn link chết).
   • mapsUrl / mapsEmbed: đang trỏ đúng toạ độ điểm GREEN GO
     trên Google Maps (16.0416078, 108.2117355).
   ============================================================ */
const MAPS_PLACE_URL =
  'https://www.google.com/maps/place/GREEN+GO+-+Thu%C3%AA+Xe+%C4%90i%E1%BB%87n+%C4%90%C3%A0+N%E1%BA%B5ng/@16.0416129,108.2091606,17z/data=!3m1!4b1!4m6!3m5!1s0x314219ffeb8a66d5:0x1453a139dc269bad!8m2!3d16.0416078!4d108.2117355!16s%2Fg%2F11z9fs7qy8';

/* Link trang đánh giá. Nếu anh/chị có link rút gọn "Viết đánh giá"
   (lấy trong Google Business Profile → Nhận thêm bài đánh giá) thì
   dán vào đây, còn không vẫn mở đúng trang địa điểm. */
const MAPS_REVIEW_URL = MAPS_PLACE_URL;

const BRANCHES = [
  {
    id: 'da-nang',
    nameKey: 'branch.name',
    areaKey: 'branch.area',
    addressKey: 'branch.address',
    hotline: ['0787.533.445', '0988.169.232'],
    hotlineName: ['Mr Huy', 'Ms Hạnh'],
    mapsUrl: MAPS_PLACE_URL,
    mapsEmbed: 'https://www.google.com/maps?q=16.0416078,108.2117355&z=17&hl=vi&output=embed',
    social: {
      zalo:      'https://zalo.me/0988169232',
      whatsapp:  'https://wa.me/84988169232',
      facebook:  '',   // TODO: dán link Fanpage / m.me của GreenGO
      kakaotalk: '',   // TODO: dán link open.kakao.com hoặc ảnh QR
      wechat:    '',   // TODO: dán ảnh QR WeChat (đặt trong qr: {...})
      telegram:  ''    // TODO: dán link t.me/<username>
    }
    /* Muốn hiện mã QR thay vì link, thêm:
       qr: { wechat: 'assets/socials/qr-wechat.png', kakaotalk: '...' } */
  }
];

let currentBranch = BRANCHES[0];

/* Dựng danh sách chi nhánh cho mọi dropdown */
function buildBranchMenus() {
  const single = BRANCHES.length < 2;
  document.querySelectorAll('[data-branch-dd]').forEach(dd => {
    dd.classList.toggle('is-static', single);
    const toggle = dd.querySelector('[data-dd-toggle]');
    if (toggle) {
      toggle.disabled = single;
      toggle.removeAttribute('aria-expanded');
      if (single) toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('[data-branch-dd] .branch-menu').forEach(menu => {
    menu.innerHTML = '';
    BRANCHES.forEach(b => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'dd-item' + (b.id === currentBranch.id ? ' active' : '');
      item.dataset.branchId = b.id;
      item.innerHTML = '<span class="nm">' + t(b.nameKey) + '</span><span class="ar">' + t(b.areaKey) + '</span>';
      item.addEventListener('click', () => {
        selectBranch(b.id);
        closeAllDropdowns();
      });
      menu.appendChild(item);
    });
  });
}

/* Đổi chi nhánh → cập nhật hotline, địa chỉ, bản đồ, mạng xã hội */
function selectBranch(id) {
  const branch = BRANCHES.find(b => b.id === id);
  if (!branch) return;
  currentBranch = branch;

  document.querySelectorAll('[data-branch-name]').forEach(el => { el.textContent = t(branch.nameKey); });
  document.querySelectorAll('[data-hotline]').forEach(el => {
    el.textContent = branch.hotline[Number(el.dataset.hotline)] || branch.hotline[0];
  });
  document.querySelectorAll('[data-hotline-name]').forEach(el => {
    const nameOf = (branch.hotlineName || [])[Number(el.dataset.hotlineName)];
    el.textContent = nameOf ? t('label.hotline') + ' · ' + nameOf : t('label.hotline');
  });
  document.querySelectorAll('[data-tel]').forEach(el => {
    const num = branch.hotline[Number(el.dataset.tel)] || branch.hotline[0];
    el.setAttribute('href', 'tel:' + num.replace(/\s/g, ''));
  });
  document.querySelectorAll('[data-address]').forEach(el => { el.textContent = t(branch.addressKey); });
  document.querySelectorAll('[data-maps-link]').forEach(el => { el.setAttribute('href', branch.mapsUrl); });
  document.querySelectorAll('[data-maps-review]').forEach(el => { el.setAttribute('href', MAPS_REVIEW_URL); });

  /* Kênh chưa có link thật thì khoá lại + ghi "Đang cập nhật",
     thay vì để href="#" bấm vào không đi đâu cả. */
  document.querySelectorAll('[data-social]').forEach(el => {
    const link = branch.social[el.dataset.social];
    const usable = Boolean(link) && link !== '#';
    el.classList.toggle('is-off', !usable);
    const note = el.querySelector('.sb');
    if (usable) {
      el.setAttribute('href', link);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
      el.removeAttribute('aria-disabled');
      if (note) note.textContent = '';
    } else {
      el.removeAttribute('href');
      el.removeAttribute('target');
      el.setAttribute('aria-disabled', 'true');
      if (note) note.textContent = t('chan.soon');
    }
  });
  const map = document.querySelector('[data-map]');
  if (map && map.getAttribute('src') !== branch.mapsEmbed) map.setAttribute('src', branch.mapsEmbed);

  buildBranchMenus();
  if (typeof renderChannels === 'function') renderChannels();
}

/* ============================================================
   Dropdown (ngôn ngữ + chi nhánh)
   ============================================================ */
function closeAllDropdowns() {
  document.querySelectorAll('[data-dd].open').forEach(dd => {
    dd.classList.remove('open');
    const t = dd.querySelector('[data-dd-toggle]');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('[data-dd]').forEach(dd => {
  const toggle = dd.querySelector('[data-dd-toggle]');
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    if (dd.classList.contains('is-static')) return;
    const wasOpen = dd.classList.contains('open');
    closeAllDropdowns();
    if (!wasOpen) {
      dd.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', closeAllDropdowns);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeAllDropdowns();
  closeMobileMenu();
  if (typeof qrView !== 'undefined' && qrView && qrView.classList.contains('open')) { closeQr(); return; }
  if (typeof bookingModal !== 'undefined' && bookingModal && bookingModal.classList.contains('open')) closeBooking();
});

/* ============================================================
   Đa ngôn ngữ: Việt / Anh / Hàn / Trung / Nhật
   ============================================================ */
const LANGS = {
  vi: { label: 'Tiếng Việt', flag: 'assets/vn.png', htmlLang: 'vi' },
  en: { label: 'English',    flag: 'assets/gb.png', htmlLang: 'en' },
  ko: { label: '한국어',      flag: 'assets/kr.png', htmlLang: 'ko' },
  zh: { label: '中文',        flag: 'assets/cn.png', htmlLang: 'zh' },
  ja: { label: '日本語',      flag: 'assets/jp.png', htmlLang: 'ja' }
};

const I18N = {
  'meta.title': {
    vi: 'GreenGO — Thuê Xe Điện Đà Nẵng | VinFast Evo Lite Đổi Pin, Không Cọc, Không Bằng Lái',
    en: 'GreenGO — Electric Scooter Rental in Da Nang | VinFast Evo Lite, No Deposit, No Licence',
    ko: 'GreenGO — 다낭 전기 스쿠터 렌탈 | VinFast Evo Lite 배터리 교체형, 보증금 없음, 면허 불필요',
    zh: 'GreenGO — 岘港电动车租赁 | VinFast Evo Lite 换电版、免押金、免驾照',
    ja: 'GreenGO — ダナン電動バイクレンタル | VinFast Evo Lite バッテリー交換式・保証金不要・免許不要'
  },
  'meta.desc': {
    vi: 'GreenGO — cho thuê xe máy điện VinFast Evo Lite bản Đổi Pin tại Đà Nẵng. Không cọc, không bằng lái, đổi pin 2 phút ở trạm VinFast 24/7, giao xe tận sân bay và ga tàu. Từ 150.000đ/ngày.',
    en: 'GreenGO — VinFast Evo Lite battery-swap scooters for rent in Da Nang. No deposit, no licence, two-minute swaps at VinFast stations 24/7, delivery to the airport and train station. From 150,000 VND a day.',
    ko: 'GreenGO — 다낭에서 VinFast Evo Lite 배터리 교체형 스쿠터 대여. 보증금 없음, 면허 불필요, VinFast 스테이션에서 24시간 2분 만에 교체, 공항·기차역 배달. 하루 150,000동부터.',
    zh: 'GreenGO — 岘港 VinFast Evo Lite 换电版电动车租赁。免押金、免驾照，VinFast 换电站 24 小时 2 分钟换电，送车到机场和火车站。每天 150.000 越南盾起。',
    ja: 'GreenGO — ダナンでVinFast Evo Liteバッテリー交換式スクーターをレンタル。保証金不要、免許不要、VinFastステーションで24時間2分交換、空港・鉄道駅まで配達。1日150,000ドンから。'
  },

  'nav.range':     { vi:'Xe & Đổi Pin', en:'The Bike & Battery Swaps', ko:'차량 & 배터리 교체', zh:'车型与换电', ja:'車両とバッテリー交換' },
  'nav.month':     { vi:'Thuê Tháng', en:'Monthly Rental', ko:'월 단위 대여', zh:'包月租车', ja:'月極レンタル' },
  'nav.pricing':   { vi:'Bảng Giá', en:'Pricing', ko:'요금 안내', zh:'价格表', ja:'料金表' },
  'nav.procedure': { vi:'Thủ Tục Thuê Xe', en:'How to Rent', ko:'대여 절차', zh:'租车流程', ja:'レンタルの流れ' },
  'nav.about':     { vi:'Giới Thiệu', en:'About', ko:'소개', zh:'关于我们', ja:'会社案内' },
  'cta.book':      { vi:'Đặt Xe', en:'Book Now', ko:'예약하기', zh:'立即预订', ja:'予約する' },
  'cta.call':      { vi:'Gọi Ngay', en:'Call Now', ko:'지금 전화', zh:'立即致电', ja:'今すぐ電話' },

  'hero.badge':  { vi:'GreenGO — Đi xanh. Đi tự do.', en:'GreenGO — Ride green. Ride free.', ko:'GreenGO — 친환경으로, 자유롭게', zh:'GreenGO — 绿色出行，自由随行', ja:'GreenGO — グリーンに、自由に。' },
  'hero.title2': { vi:'Thuê Xe Điện Đà Nẵng', en:'Electric Scooter Rental in Da Nang', ko:'다낭 전기 스쿠터 렌탈', zh:'岘港电动车租赁', ja:'ダナン電動バイクレンタル' },
  'hero.title2a': { vi:'Thuê Xe Điện', en:'Electric Scooter', ko:'다낭', zh:'岘港', ja:'ダナン' },
  'hero.title2b': { vi:'Đà Nẵng', en:'Rental in Da Nang', ko:'전기 스쿠터 렌탈', zh:'电动车租赁', ja:'電動バイクレンタル' },
  'hero.lead':   { vi:'Không Cọc – Không Bằng Lái – Đổi Pin 2 Phút', en:'No Deposit – No Licence – Two-Minute Battery Swaps', ko:'보증금 없음 – 면허 불필요 – 2분 배터리 교체', zh:'免押金 – 免驾照 – 2 分钟换电', ja:'保証金不要 – 免許不要 – 2分でバッテリー交換' },
  'hero.desc': {
    vi:'GreenGO cho thuê xe máy điện VinFast Evo Lite bản Đổi Pin tại Đà Nẵng. Giao xe tận nơi, hướng dẫn kỹ trước khi đi, hỗ trợ đổi pin và cứu hộ 24/7. Phù hợp khách du lịch, người đi học, đi làm và thuê dài hạn.',
    en:'GreenGO rents VinFast Evo Lite battery-swap scooters in Da Nang. We deliver to you, walk you through the bike before you ride, and back you up with battery help and roadside rescue 24/7 — for travellers, students, commuters and long stays alike.',
    ko:'GreenGO는 다낭에서 VinFast Evo Lite 배터리 교체형 스쿠터를 대여합니다. 원하는 곳으로 배달하고, 출발 전 사용법을 자세히 안내하며, 배터리 지원과 긴급 출동을 24시간 제공합니다. 여행객은 물론 통학·출퇴근·장기 이용에도 잘 맞습니다.',
    zh:'GreenGO 在岘港出租 VinFast Evo Lite 换电版电动车。送车上门，出发前细致讲解，换电与道路救援 24 小时待命。适合游客，也适合上学、通勤和长期租用。',
    ja:'GreenGOはダナンでVinFast Evo Liteバッテリー交換式スクーターをレンタルしています。ご希望の場所までお届けし、出発前に使い方を丁寧にご説明。バッテリー対応とロードサービスは24時間体制です。観光はもちろん、通学・通勤・長期利用にも。'
  },
  'hero.cta':   { vi:'Liên hệ ngay để đặt xe', en:'Contact us to book', ko:'지금 문의하고 예약하기', zh:'立即联系预订', ja:'今すぐ問い合わせて予約' },
  'hero.float': { vi:'Pin đầy, sẵn sàng đi', en:'Full battery, ready to go', ko:'완충 상태로 준비 완료', zh:'满电待发', ja:'フル充電で準備完了' },
  'branch.label': { vi:'Địa điểm', en:'Location', ko:'지점', zh:'门店', ja:'店舗' },

  'stat.deposit.t': { vi:'Không Cọc', en:'No Deposit', ko:'보증금 없음', zh:'免押金', ja:'保証金不要' },
  'stat.deposit.d': { vi:'Không cần đặt cọc', en:'No deposit required', ko:'보증금이 필요 없습니다', zh:'无需支付押金', ja:'保証金は必要ありません' },
  'stat.battery.t': { vi:'Đổi Pin 2 Phút', en:'Two-Minute Swap', ko:'2분 교체', zh:'2 分钟换电', ja:'2分で交換' },
  'stat.battery.d': { vi:'Trạm VinFast, 24/7', en:'VinFast stations, 24/7', ko:'VinFast 스테이션, 24시간', zh:'VinFast 换电站，24 小时', ja:'VinFastステーション、24時間' },
  'stat.range.t':   { vi:'100+ km', en:'100+ km', ko:'100km+', zh:'100+ 公里', ja:'100km以上' },
  'stat.range.d':   { vi:'Mỗi lần đầy pin', en:'Per full battery', ko:'완충 1회 기준', zh:'每次满电', ja:'満充電あたり' },

  /* ---------- Khối "Xe & Đổi Pin" trên trang chủ ---------- */
  'range.h':     { vi:'Xe & Đổi Pin', en:'The Bike & Battery Swaps', ko:'차량 & 배터리 교체', zh:'车型与换电', ja:'車両とバッテリー交換' },
  'range.sub':   { vi:'VinFast Evo Lite bản Đổi Pin — không phải cắm sạc, không phải chờ', en:'VinFast Evo Lite, battery-swap edition — no plugging in, no waiting', ko:'VinFast Evo Lite 배터리 교체형 — 충전 플러그도, 기다림도 없습니다', zh:'VinFast Evo Lite 换电版 — 不用插电，不用等', ja:'VinFast Evo Lite バッテリー交換仕様 — 充電も待ち時間も不要' },
  'range.c1.t':  { vi:'Quãng Đường', en:'Range', ko:'주행거리', zh:'续航里程', ja:'走行距離' },
  'range.c1.d':  { vi:'Mỗi lần đầy pin đi được hơn 100 km. Thực tế khoảng 50–100 km tuỳ cách chạy và số người ngồi.', en:'Over 100 km on a full battery — in practice 50–100 km depending on how you ride and how many are on board.', ko:'완충 시 100km 이상 주행합니다. 실제로는 주행 습관과 탑승 인원에 따라 약 50~100km입니다.', zh:'满电可跑 100 公里以上，实际约 50–100 公里，视骑法和载人数量而定。', ja:'満充電で100km以上走行できます。実際は走り方や乗車人数により約50〜100kmです。' },
  'range.c2.t':  { vi:'Đổi Pin 2 Phút', en:'Two-Minute Swap', ko:'2분이면 교체', zh:'2 分钟换电', ja:'2分で交換' },
  'range.c2.d':  { vi:'Hết pin thì đổi pin, không phải cắm sạc chờ 5 tiếng như xe đời cũ.', en:'When the battery runs down you swap it — no five-hour charging wait like the older bikes.', ko:'배터리가 떨어지면 교체하면 됩니다. 구형처럼 5시간을 기다릴 필요가 없습니다.', zh:'没电就换电池，不用像老款那样插着等 5 个小时。', ja:'バッテリーが減ったら交換するだけ。旧型のように5時間の充電待ちはありません。' },
  'range.c3.t':  { vi:'Trạm Ở Khắp Nơi', en:'Stations Everywhere', ko:'어디에나 있는 스테이션', zh:'换电站遍布各处', ja:'ステーションは至る所に' },
  'range.c3.d':  { vi:'Trụ đổi pin VinFast phủ khắp Đà Nẵng và các tỉnh lân cận — đi Hội An vẫn đổi được, không cần quay lại GreenGO.', en:'VinFast swap stations cover Da Nang and the provinces around it — you can swap on a day trip to Hoi An without coming back to GreenGO.', ko:'VinFast 교체 스테이션이 다낭과 인근 지역에 널리 있습니다. 호이안에 다녀오는 길에도 GreenGO로 돌아올 필요 없이 교체할 수 있습니다.', zh:'VinFast 换电柜遍布岘港及周边省份，去会安路上也能换，不必回 GreenGO 门店。', ja:'VinFastの交換ステーションはダナンと近隣省に広く設置されています。ホイアンへ行った先でも交換でき、GreenGOに戻る必要はありません。' },
  'range.c4.t':  { vi:'Xe Đời Mới', en:'The Newer Model', ko:'최신 모델', zh:'新款车型', ja:'新型モデル' },
  'range.c4.d':  { vi:'Rộng và êm hơn bản đời cũ, chỗ ngồi thoải mái cho hai người và cốp đựng đồ.', en:'Roomier and smoother than the older version, with comfortable seating for two and storage under the seat.', ko:'구형보다 넓고 부드럽습니다. 두 명이 앉아도 편하고 시트 아래 수납공간이 있습니다.', zh:'比老款更宽敞、更平顺，两人乘坐舒服，座下还有储物空间。', ja:'旧型より広く、乗り心地も滑らか。2人でも快適で、シート下に収納があります。' },

  /* ---------- Khối hướng dẫn đổi pin ---------- */
  'swap.h':   { vi:'Đổi Pin Thế Nào', en:'How a Battery Swap Works', ko:'배터리 교체 방법', zh:'怎么换电池', ja:'バッテリー交換の手順' },
  'swap.sub': { vi:'Bốn bước, mất khoảng hai phút, làm được bất cứ giờ nào trong ngày', en:'Four steps, about two minutes, at any hour of the day', ko:'네 단계, 약 2분, 하루 중 언제든지', zh:'四步，大约两分钟，一天中任何时候都行', ja:'4ステップ、約2分、時間を問わずいつでも' },
  'swap.1.t': { vi:'Tải app VinFast', en:'Install the VinFast app', ko:'VinFast 앱 설치', zh:'下载 VinFast App', ja:'VinFastアプリをインストール' },
  'swap.1.d': { vi:'Lúc giao xe nhân viên GreenGO hướng dẫn tải và cài đặt giúp bạn.', en:'Our staff install it with you when we hand over the bike.', ko:'차량을 인도할 때 GreenGO 직원이 설치를 도와드립니다.', zh:'交车时 GreenGO 员工会帮您下载安装。', ja:'車両のお渡し時にGreenGOスタッフが一緒にインストールします。' },
  'swap.2.t': { vi:'Tìm trạm gần nhất', en:'Find the nearest station', ko:'가장 가까운 스테이션 찾기', zh:'找最近的换电站', ja:'最寄りのステーションを探す' },
  'swap.2.d': { vi:'App hiện bản đồ các trụ đổi pin VinFast quanh bạn, chạy tới trụ gần nhất.', en:'The app maps every VinFast swap station near you — ride to the closest one.', ko:'앱이 주변 VinFast 교체 스테이션을 지도로 보여 줍니다. 가장 가까운 곳으로 가세요.', zh:'App 会在地图上显示附近所有 VinFast 换电柜，骑到最近的一个。', ja:'アプリが周辺のVinFast交換ステーションを地図に表示します。最寄りへ向かってください。' },
  'swap.3.t': { vi:'Gửi mã QR của trụ', en:'Send us the station QR', ko:'스테이션 QR 전송', zh:'把柜机二维码发给我们', ja:'ステーションのQRを送信' },
  'swap.3.d': { vi:'Chụp mã QR trên trụ pin gửi cho GreenGO, chúng tôi quét mở trụ từ xa cho bạn.', en:'Photograph the QR code on the cabinet and send it to GreenGO — we scan it remotely to open the station for you.', ko:'교체기에 있는 QR 코드를 찍어 GreenGO에 보내 주시면, 저희가 원격으로 스캔해 열어 드립니다.', zh:'拍下柜机上的二维码发给 GreenGO，我们远程扫码帮您开柜。', ja:'キャビネットのQRコードを撮影してGreenGOへ送ってください。こちらで遠隔スキャンして開けます。' },
  'swap.4.t': { vi:'Đổi pin và đi tiếp', en:'Swap and ride on', ko:'교체 후 계속 주행', zh:'换好电继续骑', ja:'交換して出発' },
  'swap.4.d': { vi:'Lấy pin đầy, gắn vào xe, khoảng hai phút là xong. Làm được 24/7, kể cả sau 22 giờ.', en:'Take the full battery, slot it in, and you are done in about two minutes. Available 24/7, including after 10pm.', ko:'완충 배터리를 꺼내 장착하면 약 2분이면 끝납니다. 밤 10시 이후를 포함해 24시간 가능합니다.', zh:'取出满电电池装上车，大约两分钟搞定。24 小时都行，晚上 10 点以后也可以。', ja:'満充電のバッテリーを取り出して装着、約2分で完了。22時以降を含め24時間ご利用いただけます。' },
  'swap.fee.t': { vi:'Phí đổi pin: 9.000đ mỗi lần', en:'Swap fee: 9,000 VND each time', ko:'교체 비용: 회당 9,000동', zh:'换电费用：每次 9.000 越南盾', ja:'交換手数料：1回9,000ドン' },
  'swap.fee.d': { vi:'Đây là phí trả cho trụ pin VinFast. GreenGO ứng trước cho bạn, đến khi trả xe mới tính lại — bạn không phải trả gì tại trạm.', en:'This is the fee the VinFast station charges. GreenGO pays it up front for you and settles up when you return the bike — you pay nothing at the station.', ko:'VinFast 스테이션에 지불하는 비용입니다. GreenGO가 먼저 결제하고 반납 시 정산하므로, 현장에서 내실 것은 없습니다.', zh:'这是付给 VinFast 换电柜的费用。GreenGO 先替您垫付，还车时再结算，您在柜机前不用付钱。', ja:'VinFastステーションに支払う料金です。GreenGOが立て替え、返却時に精算しますので、現地でのお支払いは不要です。' },

  'pricing.sub':  { vi:'Giá thuê xe máy điện GreenGO phù hợp mọi nhu cầu', en:'GreenGO rental rates for every kind of trip', ko:'모든 일정에 맞는 GreenGO 대여 요금', zh:'满足各种需求的 GreenGO 租车价格', ja:'あらゆるご予定に合うGreenGOの料金' },
  'pricing.best': { vi:'Giá Tốt Nhất', en:'Best Value', ko:'최저가', zh:'最优惠', ja:'一番お得' },
  'unit.day':     { vi:'/ngày', en:'/day', ko:'/일', zh:'/天', ja:'/日' },
  'plan.week':    { vi:'7+ Ngày', en:'7+ Days', ko:'7일 이상', zh:'7 天以上', ja:'7日以上' },
  'plan.week.d':  { vi:'Giá tốt nhất cho lịch trình Đà Nẵng trọn tuần.', en:'The best rate for a full week in Da Nang.', ko:'다낭에서 일주일을 보내기에 가장 좋은 요금입니다.', zh:'在岘港待满一周最划算的价格。', ja:'ダナンで1週間過ごすなら一番お得な料金です。' },
  'plan.d13':     { vi:'1–3 Ngày', en:'1–3 Days', ko:'1~3일', zh:'1–3 天', ja:'1〜3日' },
  'plan.d13.d':   { vi:'Thuê nhanh để đi biển, đi phố và thử trải nghiệm xe điện.', en:'A quick rental for the beach, the city and a first taste of riding electric.', ko:'해변과 시내를 둘러보고 전기 스쿠터를 처음 경험해 보기 좋은 단기 대여입니다.', zh:'短租体验：去海边、逛市区，第一次尝试电动车。', ja:'ビーチや街歩き、電動バイクのお試しにぴったりの短期レンタル。' },
  'plan.d46':     { vi:'4–6 Ngày', en:'4–6 Days', ko:'4~6일', zh:'4–6 天', ja:'4〜6日' },
  'plan.d46.d':   { vi:'Đủ nhịp để đi xa hơn một chút mà không phải tính toán thời gian.', en:'Enough time to venture a little further without watching the clock.', ko:'시간에 쫓기지 않고 조금 더 멀리 다녀올 수 있습니다.', zh:'天数够您走远一点，不必赶时间。', ja:'時間に追われず、少し遠出するのに十分な日数です。' },
  'plan.month':   { vi:'1 Tháng', en:'1 Month', ko:'1개월', zh:'1 个月', ja:'1ヶ月' },
  'plan.month.d': { vi:'Phù hợp sinh viên, người đi làm và khách ở dài ngày tại Đà Nẵng.', en:'For students, commuters and anyone staying in Da Nang a while.', ko:'학생, 직장인, 다낭에 오래 머무는 분께 적합합니다.', zh:'适合学生、上班族和在岘港长住的人。', ja:'学生、通勤の方、ダナンに長く滞在する方に。' },
  'plan.month.promo': { vi:'Đang khuyến mãi', en:'On promotion', ko:'프로모션 중', zh:'优惠中', ja:'キャンペーン中' },
  'label.oldprice':   { vi:'Giá niêm yết', en:'List price', ko:'정가', zh:'原价', ja:'定価' },

  'perk.deposit': { vi:'Không cọc', en:'No deposit', ko:'보증금 없음', zh:'免押金', ja:'保証金不要' },
  'perk.license': { vi:'Không bằng lái', en:'No licence', ko:'면허 불필요', zh:'免驾照', ja:'免許不要' },
  'perk.battery': { vi:'Đổi pin 2 phút', en:'Two-minute swaps', ko:'2분 배터리 교체', zh:'2 分钟换电', ja:'2分でバッテリー交換' },
  'perk.delivery':{ vi:'Giao sân bay, ga tàu', en:'Airport & station delivery', ko:'공항·기차역 배달', zh:'送机场、火车站', ja:'空港・駅までお届け' },
  'perk.support': { vi:'Hỗ trợ & cứu hộ 24/7', en:'Support & rescue 24/7', ko:'24시간 지원·긴급출동', zh:'24 小时支持与救援', ja:'24時間サポート・救援' },
  'perk.newbike': { vi:'VinFast Evo Lite', en:'VinFast Evo Lite', ko:'VinFast Evo Lite', zh:'VinFast Evo Lite', ja:'VinFast Evo Lite' },

  'proc.sub': { vi:'Chỉ 4 bước đơn giản để có xe', en:'Just four simple steps', ko:'단 4단계면 끝', zh:'只需简单四步', ja:'たった4ステップ' },
  'step1.t':  { vi:'Liên Hệ & Đặt Xe', en:'Contact & Book', ko:'문의 및 예약', zh:'联系并预订', ja:'問い合わせ・予約' },
  'step1.d':  { vi:'Liên hệ qua các nền tảng bên dưới để chọn xe và thời gian thuê phù hợp.', en:'Message us on any channel below to pick your bike and rental dates.', ko:'아래 채널로 연락해 차량과 대여 기간을 정하세요.', zh:'通过下方任一渠道联系我们，选择车辆和租期。', ja:'下記のいずれかの方法でご連絡いただき、車両とレンタル期間をお選びください。' },
  'step2.t':  { vi:'Xác Nhận Thông Tin', en:'Verify Details', ko:'정보 확인', zh:'确认信息', ja:'情報の確認' },
  'step2.d':  { vi:'Quý khách cung cấp hình ảnh CCCD, hộ chiếu hoặc giấy tờ tùy thân để xác nhận.', en:'Send a photo of your ID card or passport so we can confirm the booking.', ko:'신분증 또는 여권 사진을 보내 주시면 예약을 확정합니다.', zh:'请提供身份证或护照照片，以便我们确认预订。', ja:'身分証またはパスポートの写真をお送りいただき、予約を確定します。' },
  'step3.t':  { vi:'Nhận Xe Tận Nơi', en:'We Bring the Bike', ko:'현장에서 차량 인수', zh:'送车到您手上', ja:'ご指定の場所で受け取り' },
  'step3.d':  { vi:'Miễn phí giao tại sân bay, ga tàu, khách sạn khu vực biển và quận Hải Châu. Nhân viên hướng dẫn cách chạy và cách đổi pin trước khi bạn đi.', en:'Free delivery to the airport, the train station and hotels around the beach and Hai Chau district. We show you how to ride and how to swap the battery before you set off.', ko:'공항, 기차역, 해변 지역과 하이쩌우군 호텔까지 무료 배달합니다. 출발 전에 주행 방법과 배터리 교체 방법을 안내해 드립니다.', zh:'免费送到机场、火车站，以及海滩一带和海洲郡的酒店。出发前我们会教您怎么骑、怎么换电池。', ja:'空港、鉄道駅、ビーチエリアとハイチャウ区のホテルまで無料でお届けします。出発前に運転方法とバッテリー交換の方法をご説明します。' },
  'step4.t':  { vi:'Trả Xe & Đánh Giá', en:'Return & Review', ko:'반납 및 리뷰', zh:'还车与评价', ja:'返却・レビュー' },
  'step4.d':  { vi:'Trả xe đúng giờ và để lại đánh giá trên Google Maps.', en:'Return the bike on time and leave us a review on Google Maps.', ko:'정해진 시간에 반납하고 Google 지도에 후기를 남겨 주세요.', zh:'按时还车，并在 Google 地图上留下评价。', ja:'時間どおりに返却し、Googleマップにレビューをお願いします。' },

  'contact.h':    { vi:'Liên Hệ', en:'Contact', ko:'문의하기', zh:'联系我们', ja:'お問い合わせ' },
  'contact.sub':  { vi:'Chúng tôi luôn sẵn sàng hỗ trợ bạn', en:'We are here to help, any time', ko:'언제든지 도와드리겠습니다', zh:'我们随时为您提供帮助', ja:'いつでもサポートいたします' },
  'contact.or':   { vi:'Hoặc liên hệ qua', en:'Or reach us on', ko:'다른 채널로 문의', zh:'或通过以下方式联系', ja:'その他の連絡方法' },
  'label.address':{ vi:'Địa chỉ', en:'Address', ko:'주소', zh:'地址', ja:'住所' },
  'label.hotline':{ vi:'Hotline', en:'Hotline', ko:'핫라인', zh:'热线', ja:'ホットライン' },

  'booking.h':      { vi:'Đặt Xe Ngay', en:'Book Now', ko:'지금 예약', zh:'立即预订', ja:'今すぐ予約' },
  'booking.sub':    { vi:'Ghé cửa hàng hoặc gọi trực tiếp', en:'Drop by the shop or give us a call', ko:'매장 방문 또는 전화 문의', zh:'到店或直接致电', ja:'店舗へお越しいただくか、お電話ください' },
  'booking.findus': { vi:'Tìm Chúng Tôi', en:'Find Us', ko:'오시는 길', zh:'找到我们', ja:'アクセス' },

  'footer.links':  { vi:'Liên Kết Nhanh', en:'Quick Links', ko:'빠른 링크', zh:'快速链接', ja:'クイックリンク' },
  'footer.rights': { vi:'Mọi quyền được bảo lưu', en:'All rights reserved', ko:'모든 권리 보유', zh:'保留所有权利', ja:'無断転載を禁じます' },
  'footer.top':    { vi:'Về đầu trang', en:'Back to top', ko:'맨 위로', zh:'返回顶部', ja:'ページ上部へ' },
  'fab.call':      { vi:'Gọi hotline', en:'Call hotline', ko:'핫라인 전화', zh:'拨打热线', ja:'ホットラインに電話' },

  'modal.title':     { vi:'Đặt xe ngay hôm nay!', en:'Book your ride today!', ko:'오늘 바로 예약하세요!', zh:'今天就来订车吧！', ja:'今日から乗ってみませんか？' },
  'modal.sub':       { vi:'Chọn kênh — chúng tôi phản hồi trong vài phút', en:'Pick a channel — we reply within minutes', ko:'채널을 선택하세요 — 몇 분 안에 답변드립니다', zh:'选择一个联系方式 — 我们几分钟内回复', ja:'ご希望の方法をお選びください — 数分以内に返信します' },
  'modal.answerNow': { vi:'Có người nghe máy ngay', en:'Someone picks up right away', ko:'바로 연결됩니다', zh:'马上有人接听', ja:'すぐにつながります' },
  'modal.orMessage': { vi:'Hoặc nhắn tin qua', en:'Or message us on', ko:'다른 채널로 메시지', zh:'或通过以下方式留言', ja:'メッセージで問い合わせ' },
  'modal.back':      { vi:'Quay lại', en:'Back', ko:'뒤로', zh:'返回', ja:'戻る' },
  'chan.qr':         { vi:'Quét mã QR', en:'Scan QR code', ko:'QR 코드 스캔', zh:'扫描二维码', ja:'QRコードを読み取る' },
  'chan.msg':        { vi:'Nhắn tin', en:'Send a message', ko:'메시지 보내기', zh:'发送消息', ja:'メッセージを送る' },
  'chan.fanpage':    { vi:'Fanpage chính thức', en:'Official page', ko:'공식 페이지', zh:'官方主页', ja:'公式ページ' },
  'chan.soon':       { vi:'Đang cập nhật', en:'Coming soon', ko:'준비 중', zh:'即将开放', ja:'準備中' },
  'aria.close':      { vi:'Đóng', en:'Close', ko:'닫기', zh:'关闭', ja:'閉じる' },

  'aria.lang': { vi:'Chọn ngôn ngữ', en:'Select language', ko:'언어 선택', zh:'选择语言', ja:'言語を選択' },
  'aria.menu': { vi:'Menu', en:'Menu', ko:'메뉴', zh:'菜单', ja:'メニュー' },
  'aria.fab':  { vi:'Mở menu liên hệ', en:'Open contact menu', ko:'문의 메뉴 열기', zh:'打开联系菜单', ja:'連絡メニューを開く' },

  'branch.name':    { vi:'GreenGO Đà Nẵng', en:'GreenGO Da Nang', ko:'GreenGO 다낭', zh:'GreenGO 岘港', ja:'GreenGO ダナン' },
  'branch.area':    { vi:'Cho thuê xe máy điện toàn thành phố Đà Nẵng', en:'Electric scooter rental across Da Nang', ko:'다낭 전역 전기 스쿠터 대여', zh:'岘港全城电动车租赁', ja:'ダナン全域で電動バイクレンタル' },
  'branch.address': { vi:'Đà Nẵng — địa chỉ đang cập nhật', en:'Da Nang — address coming soon', ko:'다낭 — 주소 업데이트 예정', zh:'岘港 — 地址更新中', ja:'ダナン — 住所は準備中' }
};

/* ============================================================
   Nội dung riêng của các trang con
   ============================================================ */
Object.assign(I18N, {
  'meta.title.pricing': {
    vi:'Bảng Giá Thuê Xe Điện Đà Nẵng | GreenGO',
    en:'Electric Scooter Rental Prices in Da Nang | GreenGO',
    ko:'다낭 전기 스쿠터 렌탈 요금 | GreenGO',
    zh:'岘港电动车租赁价格 | GreenGO',
    ja:'ダナン電動バイクレンタル料金 | GreenGO'
  },
  'meta.desc.pricing': {
    vi:'Giá thuê xe máy điện GreenGO tại Đà Nẵng: từ 100.000đ/ngày, thuê tháng còn 1.800.000đ. Không cọc, không bằng lái, đổi pin 2 phút ở trạm VinFast.',
    en:'GreenGO electric scooter rental rates in Da Nang: from 100,000 VND a day, 1,800,000 VND a month. No deposit, no licence, two-minute swaps at VinFast stations.',
    ko:'다낭 GreenGO 전기 스쿠터 대여 요금: 하루 100,000동부터, 월 1,800,000동. 보증금 없음, 면허 불필요, VinFast 스테이션에서 2분 교체.',
    zh:'岘港 GreenGO 电动车租赁价格：每天 100.000 越南盾起，包月 1.800.000 越南盾。免押金、免驾照，VinFast 换电站 2 分钟换电。',
    ja:'ダナンのGreenGO電動バイクレンタル料金：1日100,000ドンから、1ヶ月1,800,000ドン。保証金不要・免許不要、VinFastステーションで2分交換。'
  },
  'meta.title.procedure': {
    vi:'Thủ Tục Thuê Xe Điện Đà Nẵng | GreenGO',
    en:'How to Rent an Electric Scooter in Da Nang | GreenGO',
    ko:'다낭 전기 스쿠터 대여 절차 | GreenGO',
    zh:'岘港电动车租车流程 | GreenGO',
    ja:'ダナン電動バイクレンタルの流れ | GreenGO'
  },
  'meta.desc.procedure': {
    vi:'Năm bước thuê xe máy điện tại GreenGO Đà Nẵng: liên hệ, gửi giấy tờ, nhận xe tận nơi, đi chơi và trả xe. Không cọc, giao miễn phí tại sân bay và ga tàu.',
    en:'Five steps to rent an electric scooter from GreenGO in Da Nang: get in touch, send an ID, take delivery, ride, return. No deposit, free delivery to the airport and train station.',
    ko:'다낭 GreenGO에서 전기 스쿠터를 빌리는 다섯 단계: 문의, 신분증 전송, 배달 수령, 주행, 반납. 보증금 없음, 공항·기차역 무료 배달.',
    zh:'在岘港 GreenGO 租电动车的五个步骤：联系、发证件、送车上门、骑行、还车。免押金，机场和火车站免费送车。',
    ja:'ダナンのGreenGOで電動バイクを借りる5ステップ：連絡、身分証送付、受け取り、走行、返却。保証金不要、空港・鉄道駅まで無料配達。'
  },
  'meta.title.about': {
    vi:'Về GreenGO — Thuê Xe Điện Đà Nẵng',
    en:'About GreenGO — Electric Scooter Rental in Da Nang',
    ko:'GreenGO 소개 — 다낭 전기 스쿠터 렌탈',
    zh:'关于 GreenGO — 岘港电动车租赁',
    ja:'GreenGOについて — ダナン電動バイクレンタル'
  },
  'meta.desc.about': {
    vi:'GreenGO cho thuê xe máy điện VinFast Evo Lite tại Đà Nẵng: giao tận nơi, hướng dẫn kỹ, hỗ trợ đổi pin và cứu hộ 24/7, hỗ trợ 5 thứ tiếng. Phục vụ cả khách du lịch, người đi học, đi làm và thuê dài hạn.',
    en:'GreenGO rents VinFast Evo Lite electric scooters in Da Nang: delivery to you, a proper hand-over, battery help and roadside rescue 24/7, support in five languages — for travellers, students, commuters and long-term renters.',
    ko:'GreenGO는 다낭에서 VinFast Evo Lite 전기 스쿠터를 대여합니다. 배달, 꼼꼼한 인수 안내, 24시간 배터리 지원과 긴급 출동, 5개 언어 지원. 여행객·학생·직장인·장기 이용자 모두 환영합니다.',
    zh:'GreenGO 在岘港出租 VinFast Evo Lite 电动车：送车上门、细致交车讲解、24 小时换电与救援、五种语言支持。服务游客，也服务上学、通勤和长租的人。',
    ja:'GreenGOはダナンでVinFast Evo Lite電動バイクをレンタル。お届け、丁寧な引き渡し説明、24時間のバッテリー対応とロードサービス、5言語対応。観光・通学・通勤・長期利用の方に。'
  },
  'nav.home': { vi:'Trang chủ', en:'Home', ko:'홈', zh:'首页', ja:'ホーム' },

  /* ---------- Trang bảng giá ---------- */
  'pricing.badge': { vi:'GreenGO · Đà Nẵng · VinFast Evo Lite bản Đổi Pin', en:'GreenGO · Da Nang · VinFast Evo Lite, battery-swap edition', ko:'GreenGO · 다낭 · VinFast Evo Lite 배터리 교체형', zh:'GreenGO · 岘港 · VinFast Evo Lite 换电版', ja:'GreenGO · ダナン · VinFast Evo Lite バッテリー交換仕様' },
  'pricing.h1': { vi:'Chi Tiết Bảng Giá', en:'Full Price List', ko:'전체 요금 안내', zh:'详细价格表', ja:'料金表の詳細' },
  'pricing.lead': {
    vi:'Giá niêm yết rõ ràng, không phí ẩn, không phụ thu. Chọn gói vừa với chuyến đi của bạn.',
    en:'Listed prices with no hidden fees and no surcharges. Pick the plan that matches your trip.',
    ko:'표시된 요금 그대로, 숨은 비용도 추가 요금도 없습니다. 일정에 맞는 요금제를 골라 보세요.',
    zh:'明码标价，没有隐藏费用，也没有额外加价。挑一个适合您行程的方案就好。',
    ja:'表示価格そのまま、追加料金も手数料もありません。ご旅程に合うプランをお選びください。'
  },
  'pricing.byday.h': { vi:'Giá Theo Ngày', en:'Daily Rates', ko:'일별 요금', zh:'按天计价', ja:'日別料金' },
  'pricing.byday.sub': { vi:'Thuê càng nhiều ngày, giá mỗi ngày càng rẻ', en:'The longer you rent, the less each day costs', ko:'대여 기간이 길수록 하루 요금이 저렴해집니다', zh:'租的天数越多，每天越便宜', ja:'借りる日数が長いほど、1日あたりが安くなります' },
  'pricing.popular': { vi:'Được chọn nhiều nhất', en:'Most popular', ko:'가장 인기 있는 요금제', zh:'最多人选', ja:'一番人気' },

  'plan.d13.long': {
    vi:'Vừa đủ cho một kỳ nghỉ ngắn: ra biển buổi sáng, đi phố buổi tối, và thử xem chạy xe điện khác gì xe số.',
    en:'Right for a short break: the beach in the morning, the city at night, and a first feel for riding electric.',
    ko:'짧은 휴가에 알맞습니다. 아침엔 해변, 저녁엔 시내, 그리고 전기 스쿠터가 어떤 느낌인지 처음 경험해 보세요.',
    zh:'适合短假：早上去海边，晚上逛市区，顺便试试电动车骑起来是什么感觉。',
    ja:'短い休暇にちょうど。朝はビーチ、夜は街へ。電動バイクの乗り心地もお試しいただけます。'
  },
  'plan.d46.long': {
    vi:'Đủ ngày để đi xa hơn một chút mà không phải tính toán thời gian, kể cả những chặng ra ngoài thành phố.',
    en:'Enough days to venture further without watching the clock, including runs outside the city.',
    ko:'시간에 쫓기지 않고 조금 더 멀리, 시외까지 다녀올 수 있는 일정입니다.',
    zh:'天数够您走远一点，不必赶时间，连出城的路线也安排得下。',
    ja:'時間に追われず少し遠くまで、市外へのお出かけも入る日数です。'
  },
  'plan.week.long': {
    vi:'Mức giá mỗi ngày tốt nhất. Phù hợp khi bạn muốn có xe suốt chuyến đi và đi đâu cũng chủ động.',
    en:'The best per-day rate. Made for having the bike all trip long and going wherever you like.',
    ko:'하루 요금이 가장 저렴합니다. 여행 내내 차량을 두고 원하는 곳으로 다니기에 좋습니다.',
    zh:'每天单价最划算。适合整趟旅程都留着车，想去哪就去哪。',
    ja:'1日あたりが最もお得。旅の間ずっと手元に置いて、好きな場所へ行きたい方に。'
  },
  'plan.month.long': {
    vi:'Dành cho người ở lại Đà Nẵng: sinh viên đi học, người đi làm, khách làm việc từ xa hoặc mới chuyển tới sống một thời gian.',
    en:'For people staying on in Da Nang — students, commuters, remote workers, or anyone who has just moved here for a while.',
    ko:'다낭에 머무는 분들을 위한 요금제입니다. 통학하는 학생, 출퇴근하는 직장인, 원격 근무자, 이제 막 이곳에 자리 잡은 분까지.',
    zh:'给留在岘港的人：上学的学生、通勤的上班族、远程工作的人，或刚搬来住一段时间的人。',
    ja:'ダナンに滞在する方へ。通学中の学生、通勤の方、リモートワークの方、移り住んで間もない方に。'
  },

  'incl.h':   { vi:'Đã Bao Gồm', en:'What Is Included', ko:'포함 사항', zh:'已包含', ja:'料金に含まれるもの' },
  'incl.sub': { vi:'Mọi gói thuê đều có sẵn những điều dưới đây', en:'Every rental comes with all of the following', ko:'모든 대여에 아래 항목이 모두 포함됩니다', zh:'每一份租约都包含以下内容', ja:'すべてのレンタルに以下がすべて付きます' },
  'incl.1.t': { vi:'Không đặt cọc', en:'No deposit', ko:'보증금 없음', zh:'免押金', ja:'保証金不要' },
  'incl.1.d': { vi:'Thanh toán khi nhận xe', en:'Pay when you collect the bike', ko:'차량 인수 시 결제', zh:'取车时付款', ja:'受け取り時にお支払い' },
  'incl.2.t': { vi:'Không cần bằng lái', en:'No licence needed', ko:'면허 불필요', zh:'免驾照', ja:'免許不要' },
  'incl.2.d': { vi:'Xe máy điện dưới 50cc, người từ 16 tuổi trở lên', en:'Under-50cc class e-scooter, riders 16 and over', ko:'50cc 미만급 전기 스쿠터, 만 16세 이상', zh:'50cc 以下级别电动车，年满 16 岁可骑', ja:'50cc未満クラスの電動バイク、16歳以上' },
  'incl.3.t': { vi:'Đổi pin 2 phút', en:'Two-minute battery swaps', ko:'2분 배터리 교체', zh:'2 分钟换电', ja:'2分でバッテリー交換' },
  'incl.3.d': { vi:'Trạm VinFast 24/7, phí 9.000đ/lần do GreenGO ứng trước', en:'VinFast stations 24/7 — 9,000 VND a swap, paid up front by GreenGO', ko:'VinFast 스테이션 24시간, 회당 9,000동은 GreenGO가 선결제', zh:'VinFast 换电站 24 小时，每次 9.000 越南盾由 GreenGO 垫付', ja:'VinFastステーション24時間、1回9,000ドンはGreenGOが立て替え' },
  'incl.4.t': { vi:'Giao xe tận nơi', en:'Delivery to you', ko:'배달 서비스', zh:'送车上门', ja:'お届けサービス' },
  'incl.4.d': { vi:'Miễn phí tại sân bay, ga tàu, khách sạn khu vực biển và Hải Châu', en:'Free to the airport, train station and hotels around the beach and Hai Chau', ko:'공항, 기차역, 해변 지역과 하이쩌우군 호텔까지 무료', zh:'机场、火车站，以及海滩一带和海洲郡的酒店免费', ja:'空港、鉄道駅、ビーチエリアとハイチャウ区のホテルまで無料' },
  'incl.5.t': { vi:'Hỗ trợ 5 ngôn ngữ', en:'Support in five languages', ko:'5개 언어 지원', zh:'五种语言支持', ja:'5言語対応' },
  'incl.5.d': { vi:'Việt · Anh · Hàn · Trung · Nhật', en:'Vietnamese · English · Korean · Chinese · Japanese', ko:'베트남어 · 영어 · 한국어 · 중국어 · 일본어', zh:'越南语 · 英语 · 韩语 · 中文 · 日语', ja:'ベトナム語 · 英語 · 韓国語 · 中国語 · 日本語' },
  'incl.6.t': { vi:'VinFast Evo Lite', en:'VinFast Evo Lite', ko:'VinFast Evo Lite', zh:'VinFast Evo Lite', ja:'VinFast Evo Lite' },
  'incl.6.d': { vi:'Bản Đổi Pin, xe đời mới, kèm mũ bảo hiểm', en:'Battery-swap edition, the newer model, helmet included', ko:'배터리 교체형 최신 모델, 헬멧 포함', zh:'换电版新款车型，含头盔', ja:'バッテリー交換仕様の新型、ヘルメット付き' },

  'faq.h': { vi:'Câu Hỏi Thường Gặp', en:'Frequently Asked Questions', ko:'자주 묻는 질문', zh:'常见问题', ja:'よくあるご質問' },
  'faq.1.q': { vi:'Tôi có cần bằng lái không?', en:'Do I need a licence?', ko:'면허가 필요한가요?', zh:'需要驾照吗？', ja:'免許は必要ですか？' },
  'faq.1.a': {
    vi:'Không. Xe GreenGO cho thuê là xe máy điện thuộc nhóm dưới 50cc, người từ 16 tuổi trở lên được phép điều khiển mà không cần bằng lái. Bạn chỉ cần một giấy tờ tuỳ thân để xác nhận đơn thuê.',
    en:'No. The bikes we rent fall in the under-50cc class, which riders aged 16 and over may ride without a licence. You only need one ID document so we can confirm the booking.',
    ko:'아니요. GreenGO가 대여하는 차량은 50cc 미만급 전기 스쿠터로, 만 16세 이상이면 면허 없이 운전할 수 있습니다. 예약 확인을 위한 신분증 한 가지만 준비해 주세요.',
    zh:'不需要。GreenGO 出租的是 50cc 以下级别的电动车，年满 16 岁即可无证驾驶。您只需提供一份身份证件供我们确认订单。',
    ja:'いりません。GreenGOがお貸しするのは50cc未満クラスの電動バイクで、16歳以上であれば免許なしで運転できます。ご予約確認のため身分証を1点だけご用意ください。'
  },
  'faq.2.q': { vi:'Có phải đặt cọc không?', en:'Is there a deposit?', ko:'보증금이 있나요?', zh:'需要押金吗？', ja:'保証金は必要ですか？' },
  'faq.2.a': {
    vi:'Không cần cọc. Bạn chỉ gửi ảnh chụp CCCD hoặc hộ chiếu để chúng tôi xác nhận, và thanh toán khi nhận xe.',
    en:'No deposit. Send a photo of your ID card or passport so we can confirm, and pay when you collect the bike.',
    ko:'보증금은 없습니다. 신분증이나 여권 사진만 보내 주시면 확인 후, 차량 인수 시 결제하시면 됩니다.',
    zh:'不用押金。把身份证或护照照片发给我们确认，取车时再付款即可。',
    ja:'保証金はありません。身分証またはパスポートの写真をお送りいただき、受け取り時にお支払いください。'
  },
  'faq.3.q': { vi:'Đang đi mà hết pin thì sao?', en:'What if the battery runs out?', ko:'주행 중 배터리가 떨어지면 어떻게 하나요?', zh:'骑到一半没电怎么办？', ja:'走行中にバッテリーが切れたら？' },
  'faq.3.a': {
    vi:'Mở app VinFast tìm trụ đổi pin gần nhất, chụp mã QR trên trụ gửi cho GreenGO, chúng tôi quét mở trụ từ xa. Bạn lấy pin đầy gắn vào xe, khoảng hai phút là đi tiếp. Làm được 24/7 ở bất cứ trụ nào, không cần quay lại cửa hàng.',
    en:'Open the VinFast app to find the nearest swap station, photograph the QR code on the cabinet and send it to GreenGO — we scan it remotely to open it. Take the full battery, slot it in, and you are riding again in about two minutes. This works 24/7 at any station, with no trip back to the shop.',
    ko:'VinFast 앱으로 가장 가까운 교체 스테이션을 찾고, 교체기의 QR 코드를 찍어 GreenGO에 보내 주세요. 저희가 원격으로 스캔해 열어 드립니다. 완충 배터리를 장착하면 약 2분 만에 다시 출발할 수 있습니다. 매장에 돌아올 필요 없이 어느 스테이션에서든 24시간 가능합니다.',
    zh:'打开 VinFast App 找最近的换电柜，拍下柜机上的二维码发给 GreenGO，我们远程扫码开柜。取出满电电池装上车，大约两分钟就能继续骑。任何柜机 24 小时都行，不用回门店。',
    ja:'VinFastアプリで最寄りの交換ステーションを探し、キャビネットのQRコードを撮影してGreenGOへお送りください。こちらで遠隔スキャンして開けます。満充電のバッテリーを装着すれば約2分で再出発。店舗に戻る必要はなく、どのステーションでも24時間対応です。'
  },
  'faq.4.q': { vi:'Đổi pin có mất phí không?', en:'Is there a charge for swapping?', ko:'배터리 교체 비용이 있나요?', zh:'换电池要收费吗？', ja:'バッテリー交換に費用はかかりますか？' },
  'faq.4.a': {
    vi:'Mỗi lần đổi pin có phí 9.000đ trả cho trụ VinFast. GreenGO ứng trước khoản này, đến khi bạn trả xe mới tính lại một lần — tại trạm bạn không phải thanh toán gì.',
    en:'Each swap costs 9,000 VND, paid to the VinFast station. GreenGO covers it up front and settles the total once, when you return the bike — you pay nothing at the station itself.',
    ko:'교체 1회당 9,000동이 VinFast 스테이션에 지불됩니다. GreenGO가 먼저 부담하고 반납 시 한 번에 정산하므로, 스테이션에서는 결제하실 것이 없습니다.',
    zh:'每次换电需向 VinFast 柜机支付 9.000 越南盾。GreenGO 先替您垫付，还车时一次结清，您在柜机前不用付钱。',
    ja:'交換1回につき9,000ドンをVinFastステーションに支払います。GreenGOが立て替え、返却時にまとめて精算しますので、ステーションでのお支払いは不要です。'
  },
  'faq.5.q': { vi:'Giao xe ở đâu thì miễn phí?', en:'Where is delivery free?', ko:'어디까지 무료로 배달되나요?', zh:'送到哪里免费？', ja:'配達が無料なのはどこまでですか？' },
  'faq.5.a': {
    vi:'Miễn phí giao tận nơi tại sân bay Đà Nẵng, ga tàu, và các khách sạn thuộc khu vực biển cùng quận Hải Châu. Ngoài những khu vực này bạn cứ nhắn trước, chúng tôi báo lại cụ thể.',
    en:'Delivery is free to Da Nang airport, the train station, and hotels around the beach area and Hai Chau district. Outside those areas, message us first and we will confirm what is possible.',
    ko:'다낭 공항, 기차역, 해변 지역과 하이쩌우군의 호텔까지는 무료 배달입니다. 그 외 지역은 먼저 문의해 주시면 안내해 드리겠습니다.',
    zh:'送到岘港机场、火车站，以及海滩一带和海洲郡的酒店免费。其他区域请先留言，我们再具体答复。',
    ja:'ダナン空港、鉄道駅、ビーチエリアとハイチャウ区のホテルまでは無料でお届けします。それ以外の地域はまずご連絡ください、個別にご案内します。'
  },
  'faq.6.q': { vi:'Một ngày thuê được tính thế nào?', en:'How is a rental day counted?', ko:'대여 1일은 어떻게 계산하나요?', zh:'一天租期怎么算？', ja:'レンタル1日はどう数えますか？' },
  'faq.6.a': {
    vi:'Một ngày thuê là 24 giờ tính từ lúc bạn nhận xe, không tính theo ngày lịch. Nhận xe 15h hôm nay thì trả xe trước 15h ngày mai. Cần giữ thêm vài tiếng thì nhắn trước, thường chúng tôi linh động được.',
    en:'A rental day is 24 hours from the moment you take the bike, not a calendar day. Collect at 3pm today and the bike is due back before 3pm tomorrow. If you need a few extra hours, message us first — we can usually be flexible.',
    ko:'대여 1일은 차량을 받은 시점부터 24시간이며, 달력 기준이 아닙니다. 오늘 15시에 받으셨다면 내일 15시 전에 반납하시면 됩니다. 몇 시간 더 필요하시면 미리 알려 주세요, 대개 조정해 드립니다.',
    zh:'一天租期是从取车那一刻起算 24 小时，不按自然日。今天 15 点取车，明天 15 点前还车即可。需要多用几个小时请先说一声，一般都能通融。',
    ja:'レンタル1日は受け取り時刻から24時間で、暦日ではありません。本日15時に受け取られたら、翌日15時までにご返却ください。数時間延長が必要な場合は事前にご連絡いただければ、多くの場合調整できます。'
  },
  'faq.7.q': { vi:'Xe gặp sự cố giữa đường thì liên hệ ai?', en:'Who do I call if something goes wrong?', ko:'문제가 생기면 누구에게 연락하나요?', zh:'路上出问题找谁？', ja:'途中で不具合が出たら？' },
  'faq.7.a': {
    vi:'Gọi một trong hai hotline ở cuối trang, bất cứ giờ nào. Chúng tôi sẽ tới xử lý hoặc đổi xe khác cho bạn.',
    en:'Call either hotline at the bottom of this page, any time of day. We will come and fix it or swap the bike.',
    ko:'페이지 하단의 두 핫라인 중 아무 번호로든 언제든 전화 주세요. 저희가 가서 수리하거나 다른 차량으로 교체해 드립니다.',
    zh:'随时拨打页面底部任一条热线。我们会过去处理，或者给您换一辆。',
    ja:'ページ下部のホットラインへ、時間を問わずお電話ください。現場で対応、または別の車両に交換します。'
  },

  /* ---------- Trang thủ tục ---------- */
  'proc.h1': { vi:'Quy Trình Thuê Xe', en:'How Renting Works', ko:'대여 절차', zh:'租车流程', ja:'レンタルの流れ' },
  'proc.lead': {
    vi:'Thuê xe ở GreenGO gọn nhẹ: một cuộc gọi hoặc một tin nhắn, gửi giấy tờ, nhận xe và đi.',
    en:'Renting from GreenGO is light on paperwork: one call or message, send an ID, take the bike and go.',
    ko:'GreenGO의 대여는 간단합니다. 전화나 메시지 한 번, 신분증 전송, 차량 인수 후 출발.',
    zh:'在 GreenGO 租车很省事：一个电话或一条消息，发份证件，取车就走。',
    ja:'GreenGOのレンタルは手続きが軽いです。電話かメッセージ1回、身分証を送り、車両を受け取って出発。'
  },
  'pstep.1.t': { vi:'Liên Hệ & Đặt Xe', en:'Get in Touch', ko:'문의 및 예약', zh:'联系并预订', ja:'問い合わせ・予約' },
  'pstep.1.d': {
    vi:'Gọi hotline hoặc nhắn qua Messenger, Zalo, WhatsApp, KakaoTalk, WeChat, Telegram. Cho chúng tôi biết ngày thuê và nơi bạn muốn nhận xe. Chúng tôi trả lời được bằng tiếng Việt, Anh, Hàn, Trung và Nhật.',
    en:'Call a hotline or message us on Messenger, Zalo, WhatsApp, KakaoTalk, WeChat or Telegram. Tell us your dates and where you would like the bike. We reply in Vietnamese, English, Korean, Chinese and Japanese.',
    ko:'핫라인으로 전화하시거나 Messenger, Zalo, WhatsApp, KakaoTalk, WeChat, Telegram으로 메시지를 보내세요. 대여 날짜와 차량을 받을 장소를 알려 주시면 됩니다. 베트남어, 영어, 한국어, 중국어, 일본어로 응대합니다.',
    zh:'打热线，或用 Messenger、Zalo、WhatsApp、KakaoTalk、WeChat、Telegram 给我们留言。告诉我们租车日期和取车地点。我们能用越南语、英语、韩语、中文和日语回复。',
    ja:'ホットラインにお電話、またはMessenger・Zalo・WhatsApp・KakaoTalk・WeChat・Telegramでご連絡ください。ご希望の日程と受け取り場所をお知らせください。ベトナム語・英語・韓国語・中国語・日本語で対応します。'
  },
  'pstep.2.t': { vi:'Xác Nhận Giấy Tờ', en:'Confirm Your Details', ko:'서류 확인', zh:'确认证件', ja:'書類の確認' },
  'pstep.2.d': {
    vi:'Gửi ảnh chụp rõ CCCD, hộ chiếu hoặc giấy tờ tuỳ thân. Chúng tôi không giữ giấy tờ gốc của bạn — chỉ lưu bản ảnh để đối chiếu, và xoá sau khi bạn trả xe.',
    en:'Send a clear photo of your ID card, passport or other identity document. We never hold your original papers — only the photo, for reference, and we delete it after you return the bike.',
    ko:'신분증, 여권 등 신분 증명 서류의 선명한 사진을 보내 주세요. 원본 서류는 절대 보관하지 않습니다. 대조용 사진만 보관하며, 반납 후 삭제합니다.',
    zh:'发一张清晰的身份证、护照或其他身份证件照片。我们绝不扣留您的原件，只保留照片用于核对，还车后即删除。',
    ja:'身分証やパスポートなど、本人確認書類の鮮明な写真をお送りください。原本はお預かりしません。照合用の写真のみ保管し、返却後に削除します。'
  },
  'pstep.3.t': { vi:'Nhận Xe Tận Nơi', en:'Take Delivery', ko:'현장에서 인수', zh:'收车', ja:'車両の受け取り' },
  'pstep.3.d': {
    vi:'Miễn phí giao tận nơi tại sân bay, ga tàu, và khách sạn khu vực biển cùng quận Hải Châu. Lúc giao, nhân viên hướng dẫn bạn cách chạy, cách dùng app VinFast và cách đổi pin ở trạm.',
    en:'Free delivery to the airport, the train station and hotels around the beach and Hai Chau district. At hand-over we show you how to ride, how to use the VinFast app and how to swap a battery at a station.',
    ko:'공항, 기차역, 해변 지역과 하이쩌우군 호텔까지 무료로 배달합니다. 인수 시 주행 방법, VinFast 앱 사용법, 스테이션에서 배터리 교체하는 방법을 안내해 드립니다.',
    zh:'免费送到机场、火车站，以及海滩一带和海洲郡的酒店。交车时我们会教您怎么骑、怎么用 VinFast App，以及怎么在换电柜换电池。',
    ja:'空港、鉄道駅、ビーチエリアとハイチャウ区のホテルまで無料でお届けします。お渡し時に、運転方法、VinFastアプリの使い方、ステーションでのバッテリー交換方法をご説明します。'
  },
  'pstep.4.t': { vi:'Đi Chơi Thoải Mái', en:'Enjoy the Ride', ko:'자유롭게 라이딩', zh:'尽情骑行', ja:'自由にお出かけ' },
  'pstep.4.d': {
    vi:'Mỗi lần đầy pin xe đi được hơn 100 km. Gần hết pin thì ghé trụ VinFast gần nhất, gửi mã QR cho chúng tôi quét mở từ xa, hai phút sau là đi tiếp — 24/7, ở bất cứ đâu.',
    en:'A full battery takes you over 100 km. When it runs low, stop at the nearest VinFast station, send us the QR code so we can open it remotely, and two minutes later you are on your way — 24/7, anywhere.',
    ko:'완충 시 100km 이상 주행합니다. 배터리가 줄면 가까운 VinFast 스테이션에 들러 QR 코드를 보내 주세요. 저희가 원격으로 열어 드리면 2분 뒤 다시 출발할 수 있습니다. 장소와 시간에 관계없이 24시간 가능합니다.',
    zh:'满电可跑 100 公里以上。电量不足就到最近的 VinFast 换电柜，把二维码发给我们远程开柜，两分钟后继续上路，24 小时、任何地方都行。',
    ja:'満充電で100km以上走ります。残量が減ったら最寄りのVinFastステーションへ。QRコードをお送りいただければ遠隔で開錠し、2分後には再出発できます。24時間、どこでも可能です。'
  },
  'pstep.5.t': { vi:'Trả Xe & Đánh Giá', en:'Return & Review', ko:'반납 및 리뷰', zh:'还车与评价', ja:'返却・レビュー' },
  'pstep.5.d': {
    vi:'Trả xe đúng giờ và đúng nơi đã hẹn. Nếu chuyến đi ổn, để lại cho chúng tôi một đánh giá trên Google Maps — khách sau sẽ dễ tìm thấy GreenGO hơn.',
    en:'Return the bike at the time and place agreed. If the trip went well, leave us a review on Google Maps — it helps the next traveller find GreenGO.',
    ko:'약속한 시간과 장소에 반납해 주세요. 여행이 좋았다면 Google 지도에 후기를 남겨 주세요. 다음 여행자가 GreenGO를 찾는 데 도움이 됩니다.',
    zh:'按约定的时间和地点还车。如果这趟骑得顺心，请在 Google 地图上留个评价，让后来的旅客更容易找到 GreenGO。',
    ja:'お約束の時間と場所でご返却ください。旅が良かったら、Googleマップにレビューを残していただけると、次の旅行者がGreenGOを見つけやすくなります。'
  },

  'tips.h': { vi:'Mẹo Nhỏ Khi Đi Đường', en:'A Few Tips for the Road', ko:'라이딩 팁', zh:'上路小提示', ja:'走行時のコツ' },
  'tip.1': { vi:'Cài sẵn app VinFast và bật định vị để tìm trụ đổi pin nhanh hơn.', en:'Install the VinFast app and turn location on — it finds swap stations much faster.', ko:'VinFast 앱을 설치하고 위치 기능을 켜 두면 교체 스테이션을 더 빨리 찾을 수 있습니다.', zh:'装好 VinFast App 并开启定位，找换电柜会快很多。', ja:'VinFastアプリを入れて位置情報をオンにしておくと、交換ステーションをすぐ見つけられます。' },
  'tip.2': { vi:'Đi đường dài thì ghé đổi pin khi còn khoảng 20%, đừng đợi cạn hẳn.', en:'On a longer ride, swap at around 20% rather than waiting for empty.', ko:'장거리 주행 시에는 완전히 방전되기 전, 20% 정도에서 교체하세요.', zh:'跑远路时电量到 20% 左右就去换，别等彻底没电。', ja:'長距離を走るときは、空になるまで待たず20%ほどで交換しましょう。' },
  'tip.3': { vi:'Luôn đội mũ bảo hiểm, kể cả khi chỉ đi một đoạn ngắn.', en:'Always wear a helmet, even for a short hop.', ko:'짧은 거리라도 항상 헬멧을 착용하세요.', zh:'哪怕只骑一小段，也请戴好头盔。', ja:'短い距離でも必ずヘルメットを着用してください。' },
  'tip.4': { vi:'Khoá xe mỗi lần đậu ở nơi công cộng.', en:'Lock the bike whenever you park in public.', ko:'공공장소에 주차할 때는 반드시 잠그세요.', zh:'在公共场所停车时记得上锁。', ja:'公共の場所に駐車するときは必ず施錠してください。' },
  'tip.5': { vi:'Lưu sẵn hai số hotline vào điện thoại trước khi khởi hành.', en:'Save both hotline numbers to your phone before you set off.', ko:'출발 전에 두 개의 핫라인 번호를 휴대폰에 저장해 두세요.', zh:'出发前把两条热线号码存进手机。', ja:'出発前に2つのホットライン番号を携帯に保存しておきましょう。' },

  /* ---------- Trang giới thiệu ---------- */
  'about.h1': { vi:'Về GreenGO', en:'About GreenGO', ko:'GreenGO 소개', zh:'关于 GreenGO', ja:'GreenGOについて' },
  'about.lead': {
    vi:'Cho thuê xe máy điện tại Đà Nẵng — thủ tục nhẹ, giá rõ ràng, và một chiếc xe sẵn sàng đưa bạn đi.',
    en:'Electric scooter rental in Da Nang — light on paperwork, clear on price, with a bike ready to take you out.',
    ko:'다낭의 전기 스쿠터 렌탈 — 간단한 절차, 명확한 요금, 그리고 언제든 출발할 준비가 된 차량.',
    zh:'岘港的电动摩托车租赁 — 手续简单，价格清楚，车随时能载您出发。',
    ja:'ダナンの電動バイクレンタル — 手続きは簡単、料金は明快、いつでも出発できる一台とともに。'
  },
  'about.who.t': { vi:'GreenGO Là Ai', en:'Who We Are', ko:'GreenGO는', zh:'我们是谁', ja:'GreenGOとは' },
  'about.who.d': {
    vi:'GreenGO cho thuê xe máy điện tại Đà Nẵng: du khách ghé thành phố vài ngày, sinh viên đi học, người đi làm hằng ngày và cả khách thuê dài hạn theo tháng. Xe là VinFast Evo Lite bản Đổi Pin — đời mới, rộng và êm hơn bản cũ, chạy êm, không mùi xăng.',
    en:'GreenGO rents electric scooters in Da Nang — to travellers here for a few days, to students riding to class, to people commuting daily, and to anyone renting by the month. The bike is the VinFast Evo Lite battery-swap edition: the newer model, roomier and smoother than the old one, quiet and with no smell of petrol.',
    ko:'GreenGO는 다낭에서 전기 스쿠터를 대여합니다. 며칠 머무는 여행자, 통학하는 학생, 매일 출퇴근하는 분, 월 단위 장기 이용자까지 함께합니다. 차량은 VinFast Evo Lite 배터리 교체형으로, 구형보다 넓고 부드러운 최신 모델이며 조용하고 기름 냄새가 없습니다.',
    zh:'GreenGO 在岘港做电动摩托车租赁：待几天的旅客、上学的学生、每天通勤的人，还有按月长租的客人。车是 VinFast Evo Lite 换电版，新款，比老款更宽敞更平顺，安静且没有汽油味。',
    ja:'GreenGOはダナンで電動バイクをレンタルしています。数日滞在の旅行者、通学する学生、毎日通勤する方、月単位で長期利用する方まで。車両はVinFast Evo Liteバッテリー交換仕様。旧型より広く滑らかな新型で、静かでガソリンの匂いもありません。'
  },
  'about.why.t': { vi:'Cách Chúng Tôi Làm Việc', en:'How We Work', ko:'저희가 일하는 방식', zh:'我们怎么做事', ja:'私たちの進め方' },
  'about.why.d': {
    vi:'Chúng tôi bỏ đi những thứ khiến việc thuê xe trở nên mệt: không đặt cọc, không giữ giấy tờ gốc, không yêu cầu bằng lái, không phí ẩn. Xe được giao tận nơi và hướng dẫn kỹ trước khi bạn chạy. Hết pin thì đổi ở trụ VinFast gần nhất, chúng tôi mở trụ từ xa cho bạn; hỏng xe giữa đường thì gọi, chúng tôi tới cứu hộ — cả hai việc này đều 24/7.',
    en:'We removed the parts that make renting tiring: no deposit, no holding your original documents, no licence required, no hidden fees. We deliver the bike and walk you through it properly before you ride. Out of charge? Swap at the nearest VinFast station and we open it for you remotely. Broken down? Call and we come out — both, 24/7.',
    ko:'대여를 번거롭게 만드는 것들을 없앴습니다. 보증금 없음, 원본 서류 보관 없음, 면허 요구 없음, 숨은 비용 없음. 차량은 원하는 곳으로 배달하고 출발 전 사용법을 꼼꼼히 안내합니다. 배터리가 떨어지면 가까운 VinFast 스테이션에서 교체하시면 되고, 저희가 원격으로 열어 드립니다. 고장이 나면 전화 주세요, 저희가 출동합니다. 두 가지 모두 24시간입니다.',
    zh:'我们把让租车变麻烦的环节都去掉了：不收押金、不扣原件、不要驾照、没有隐藏费用。车送到您手上，出发前讲解清楚。没电就到最近的 VinFast 换电柜换，我们远程帮您开柜；路上抛锚就打电话，我们过去救援。两件事都是 24 小时。',
    ja:'レンタルを面倒にする部分を取り除きました。保証金なし、原本の預かりなし、免許の確認なし、隠れた費用なし。車両はご指定の場所へお届けし、走り出す前に丁寧にご説明します。バッテリーが切れたら最寄りのVinFastステーションで交換、遠隔で開錠します。故障時はお電話いただければ救援に向かいます。どちらも24時間対応です。'
  },
  'about.mission.t': { vi:'Điều Chúng Tôi Muốn', en:'What We Are After', ko:'저희가 바라는 것', zh:'我们想做到的', ja:'目指していること' },
  'about.mission.d': {
    vi:'Một thành phố biển thì nên đi bằng thứ không thải khói ra biển. Chúng tôi muốn xe điện là lựa chọn dễ nhất cho bất kỳ ai tới Đà Nẵng — dễ thuê, dễ chạy, dễ gọi khi cần giúp, bằng thứ tiếng mà khách nói.',
    en:'A city by the sea deserves to be seen from something that does not smoke into it. We want an electric bike to be the easiest choice for anyone arriving in Da Nang — easy to rent, easy to ride, easy to get help with, in the language the rider speaks.',
    ko:'바다를 품은 도시라면, 그 바다에 연기를 내뿜지 않는 것으로 둘러보는 편이 좋습니다. 다낭에 오는 누구에게나 전기 스쿠터가 가장 쉬운 선택이 되길 바랍니다. 빌리기 쉽고, 타기 쉽고, 손님이 쓰는 언어로 도움을 받기 쉬운 선택으로.',
    zh:'临海的城市，理当用不朝它冒烟的方式去看。我们希望电动车成为每位来岘港的人最省心的选择：好租、好骑，需要帮忙时能用自己的语言找到人。',
    ja:'海のある街は、その海に煙を出さないもので巡るのがふさわしい。ダナンに来るすべての人にとって、電動バイクが最も手軽な選択になってほしいと考えています。借りやすく、乗りやすく、必要なときに自分の言葉で助けを求められるように。'
  },

  'why.h': { vi:'Vì Sao Chọn GreenGO', en:'Why Choose GreenGO', ko:'GreenGO를 선택하는 이유', zh:'为什么选 GreenGO', ja:'GreenGOが選ばれる理由' },
  'why.1.t': { vi:'Không Khí Thải', en:'Zero Emissions', ko:'배출가스 없음', zh:'零排放', ja:'排出ガスゼロ' },
  'why.1.d': { vi:'Xe điện hoàn toàn, không xả khói ra phố và ra biển.', en:'Fully electric — nothing coming out of the exhaust.', ko:'완전 전기 구동으로 배기가스가 없습니다.', zh:'纯电动，不往街上和海边排废气。', ja:'完全電動で、排気ガスが出ません。' },
  'why.2.t': { vi:'Thủ Tục Nhẹ', en:'Light Paperwork', ko:'간단한 절차', zh:'手续简单', ja:'手続きが簡単' },
  'why.2.d': { vi:'Một ảnh giấy tờ tuỳ thân là đủ. Không cọc, không giữ bản gốc.', en:'One photo of an ID is enough. No deposit, no originals held.', ko:'신분증 사진 한 장이면 충분합니다. 보증금도, 원본 보관도 없습니다.', zh:'一张身份证件照片就够。不收押金，不扣原件。', ja:'身分証の写真1枚で十分。保証金も原本の預かりもありません。' },
  'why.3.t': { vi:'Giá Rõ Ràng', en:'Clear Pricing', ko:'명확한 요금', zh:'价格透明', ja:'明快な料金' },
  'why.3.d': { vi:'Giá trên bảng là giá thanh toán, không phụ thu phát sinh.', en:'The listed price is what you pay — no surcharges later.', ko:'표시된 요금이 결제 금액입니다. 추가 청구는 없습니다.', zh:'标价就是付款价，事后不加收。', ja:'表示価格がお支払い額。後からの追加請求はありません。' },
  'why.4.t': { vi:'Đổi Pin & Cứu Hộ 24/7', en:'Swaps & Rescue, 24/7', ko:'배터리 교체 · 긴급출동 24시간', zh:'换电与救援 24 小时', ja:'交換・救援は24時間' },
  'why.4.d': { vi:'Hai hotline trực suốt ngày, hỗ trợ bằng 5 thứ tiếng.', en:'Two hotlines all day, help in five languages.', ko:'두 개의 핫라인이 하루 종일, 5개 언어로 지원합니다.', zh:'两条热线全天在线，五种语言支持。', ja:'2つのホットラインが終日対応、5言語でサポート。' },

  /* ---------- Khối kêu gọi cuối trang con ---------- */
  'ctaband.h':   { vi:'Sẵn sàng nhận xe chưa?', en:'Ready to pick up a bike?', ko:'차량을 받으실 준비가 되셨나요?', zh:'准备取车了吗？', ja:'車両を受け取る準備はできましたか？' },
  'ctaband.sub': { vi:'Gọi hotline hoặc nhắn tin, chúng tôi phản hồi trong vài phút.', en:'Call a hotline or send a message — we reply within minutes.', ko:'핫라인으로 전화하거나 메시지를 보내 주세요. 몇 분 안에 답변드립니다.', zh:'打热线或发消息给我们，几分钟内回复。', ja:'ホットラインへお電話かメッセージをどうぞ。数分以内に返信します。' }
});

/* ============================================================
   Nội dung các khối mới: dòng xe, thuê tháng, đánh giá, ngày thuê
   ============================================================ */
Object.assign(I18N, {
  /* ---------- Dòng xe ---------- */
  'bike.h':    { vi:'Xe Bạn Sẽ Nhận', en:'The Bike You Get', ko:'받으시게 될 차량', zh:'您会拿到的车', ja:'お渡しする車両' },
  'bike.name': { vi:'VinFast Evo Lite — bản Đổi Pin', en:'VinFast Evo Lite — battery-swap edition', ko:'VinFast Evo Lite — 배터리 교체형', zh:'VinFast Evo Lite — 换电版', ja:'VinFast Evo Lite — バッテリー交換仕様' },
  'bike.lead': {
    vi:'Toàn bộ xe GreenGO cho thuê là VinFast Evo Lite bản Đổi Pin, dán tem thương hiệu GreenGO. Đây là bản đời mới: rộng hơn, chạy êm hơn bản cũ, và quan trọng nhất là không phải cắm sạc chờ 5 tiếng — chỉ đổi pin trong hai phút.',
    en:'Every bike GreenGO rents is a VinFast Evo Lite battery-swap edition in GreenGO livery. It is the newer model: roomier, smoother than the old one, and — the part that matters most — no five-hour charging wait, just a two-minute battery swap.',
    ko:'GreenGO가 대여하는 모든 차량은 GreenGO 브랜드 데칼이 붙은 VinFast Evo Lite 배터리 교체형입니다. 구형보다 넓고 부드러운 최신 모델이며, 무엇보다 5시간 충전을 기다릴 필요 없이 2분이면 배터리를 교체합니다.',
    zh:'GreenGO 出租的每一辆都是贴有 GreenGO 品牌贴纸的 VinFast Evo Lite 换电版。这是新款：更宽敞、比老款更平顺，最要紧的是不用插电等 5 个小时，两分钟换块电池就好。',
    ja:'GreenGOがお貸しする車両はすべて、GreenGOのブランドデカールを施したVinFast Evo Liteバッテリー交換仕様です。旧型より広く滑らかな新型で、何より5時間の充電待ちが不要。2分でバッテリーを交換できます。'
  },
  'bike.s1.t': { vi:'Loại xe', en:'Type', ko:'차종', zh:'车型类别', ja:'車種' },
  'bike.s1.d': { vi:'Xe máy điện dưới 50cc, không cần bằng lái, người từ 16 tuổi', en:'Under-50cc class e-scooter — no licence, riders 16 and over', ko:'50cc 미만급 전기 스쿠터, 면허 불필요, 만 16세 이상', zh:'50cc 以下级别电动车，免驾照，16 岁以上可骑', ja:'50cc未満クラスの電動バイク、免許不要、16歳以上' },
  'bike.s2.t': { vi:'Pin', en:'Battery', ko:'배터리', zh:'电池', ja:'バッテリー' },
  'bike.s2.d': { vi:'Pin rời, đổi tại trụ VinFast trong khoảng 2 phút', en:'Removable pack, swapped at a VinFast station in about two minutes', ko:'탈착식 배터리, VinFast 스테이션에서 약 2분 만에 교체', zh:'可拆卸电池，在 VinFast 换电柜约 2 分钟换好', ja:'着脱式バッテリー、VinFastステーションで約2分交換' },
  'bike.s3.t': { vi:'Quãng đường', en:'Range', ko:'주행거리', zh:'续航', ja:'走行距離' },
  'bike.s3.d': { vi:'Hơn 100 km mỗi lần đầy pin, thực tế 50–100 km tuỳ cách chạy', en:'Over 100 km on a full battery; 50–100 km in real use depending on how you ride', ko:'완충 시 100km 이상, 실제 주행은 방식에 따라 50~100km', zh:'满电 100 公里以上，实际约 50–100 公里，视骑法而定', ja:'満充電で100km以上、実走行は走り方により50〜100km' },
  'bike.s4.t': { vi:'Nhận kèm', en:'Comes with', ko:'함께 제공', zh:'随车附带', ja:'付属品' },
  'bike.s4.d': { vi:'Mũ bảo hiểm GreenGO, sạc dự phòng nếu cần, khoá xe', en:'A GreenGO helmet, a charger if you want one, and a lock', ko:'GreenGO 헬멧, 필요 시 충전기, 잠금장치', zh:'GreenGO 头盔、需要的话可配充电器、车锁', ja:'GreenGOヘルメット、ご希望に応じて充電器、ロック' },

  /* ---------- Thuê tháng ---------- */
  'month.h':    { vi:'Thuê Theo Tháng', en:'Renting by the Month', ko:'월 단위 대여', zh:'按月租车', ja:'月極レンタル' },
  'month.lead': {
    vi:'Không phải ai ở Đà Nẵng cũng là khách du lịch. Gói tháng dành cho sinh viên đi học, người mới chuyển tới, người đi làm hằng ngày và khách lưu trú dài hạn — có xe riêng mà không phải mua xe, không phải lo sạc, không phải lo bảo dưỡng.',
    en:'Not everyone in Da Nang is here on holiday. The monthly plan is for students riding to class, for people who have just moved here, for daily commuters and long-stay guests — your own bike without buying one, without charging it, without maintaining it.',
    ko:'다낭에 있는 모두가 여행자는 아닙니다. 월 요금제는 통학하는 학생, 막 이사 온 분, 매일 출퇴근하는 분, 장기 체류 고객을 위한 것입니다. 차를 사지 않고도, 충전 걱정도 정비 걱정도 없이 내 차처럼 쓰실 수 있습니다.',
    zh:'在岘港的人不都是来旅游的。包月方案给上学的学生、刚搬来的人、每天通勤的人和长住客：有一辆自己的车，不用买、不用管充电、不用管保养。',
    ja:'ダナンにいる人が皆、旅行者とは限りません。月額プランは、通学する学生、引っ越してきたばかりの方、毎日通勤する方、長期滞在の方のためのもの。買わずに自分の一台を持て、充電も整備も気にせずに済みます。'
  },
  'month.1': { vi:'Giao xe tận nơi ở, không cần tới cửa hàng', en:'Delivered to where you live — no trip to the shop', ko:'거주지까지 배달, 매장에 오실 필요 없습니다', zh:'送到您住的地方，不用跑门店', ja:'お住まいまでお届け、来店不要' },
  'month.2': { vi:'Bảo dưỡng và cứu hộ trong suốt thời gian thuê', en:'Servicing and roadside rescue for the whole rental', ko:'대여 기간 내내 정비와 긴급 출동 지원', zh:'租期内包含保养与道路救援', ja:'レンタル期間中の整備とロードサービス込み' },
  'month.3': { vi:'Đổi pin ở trụ VinFast, không phải cắm sạc ở nhà', en:'Swap at VinFast stations — no charging at home', ko:'VinFast 스테이션에서 교체, 집에서 충전할 필요 없음', zh:'在 VinFast 换电柜换电，不用在家充电', ja:'VinFastステーションで交換、自宅充電は不要' },
  'month.4': { vi:'Thuê tiếp tháng sau chỉ cần một tin nhắn', en:'Extending for another month takes one message', ko:'다음 달 연장은 메시지 한 통이면 됩니다', zh:'续租下个月，一条消息就行', ja:'翌月の延長はメッセージ1本で完了' },

  /* ---------- Quy định ngày thuê ---------- */
  'rentday.t': { vi:'Một ngày thuê tính thế nào', en:'How a rental day is counted', ko:'대여 1일 계산 방식', zh:'一天租期怎么算', ja:'レンタル1日の数え方' },
  'rentday.d': {
    vi:'Một ngày thuê là 24 giờ kể từ lúc bạn nhận xe, không tính theo ngày lịch. Nhận xe 15h hôm nay thì trả trước 15h ngày mai.',
    en:'A rental day is 24 hours from the moment you take the bike, not a calendar day. Collect at 3pm today and it is due back before 3pm tomorrow.',
    ko:'대여 1일은 차량을 받은 시점부터 24시간이며 달력 기준이 아닙니다. 오늘 15시에 받으셨다면 내일 15시 전에 반납해 주세요.',
    zh:'一天租期是从取车那一刻起算 24 小时，不按自然日。今天 15 点取车，明天 15 点前还车。',
    ja:'レンタル1日は受け取り時刻から24時間で、暦日ではありません。本日15時に受け取られたら、翌日15時までにご返却ください。'
  },

  /* ---------- Đánh giá khách hàng ---------- */
  'review.h':   { vi:'Đánh Giá Của Khách', en:'What Riders Say', ko:'고객 후기', zh:'客户评价', ja:'お客様の声' },
  'review.d':   { vi:'Đánh giá của GreenGO nằm công khai trên Google Maps — mời bạn đọc trực tiếp ở đó, và nếu đã thuê xe của chúng tôi thì để lại vài dòng nhé.', en:'GreenGO reviews are public on Google Maps — read them there, and if you have rented from us, leave a few lines of your own.', ko:'GreenGO의 후기는 Google 지도에 공개되어 있습니다. 그곳에서 직접 확인해 보시고, 이용해 보셨다면 후기도 남겨 주세요.', zh:'GreenGO 的评价都公开在 Google 地图上，欢迎直接去看；如果您租过我们的车，也请留几句。', ja:'GreenGOのレビューはGoogleマップで公開されています。ぜひそちらでご覧ください。ご利用いただいた方は、ひとことお寄せいただけると嬉しいです。' },
  'review.cta': { vi:'Xem đánh giá trên Google Maps', en:'Read the reviews on Google Maps', ko:'Google 지도에서 후기 보기', zh:'在 Google 地图上看评价', ja:'Googleマップでレビューを見る' },
  'review.write': { vi:'Viết đánh giá', en:'Write a review', ko:'후기 작성', zh:'写评价', ja:'レビューを書く' }
});

let currentLang = 'vi';

function t(key) {
  const entry = I18N[key];
  if (!entry) return key;
  return entry[currentLang] || entry.vi;
}

/* Giá quy đổi sang USD — chỉ hiện với khách nước ngoài.
   Muốn cập nhật tỉ giá thì sửa đúng một hằng số dưới đây. */
const USD_RATE = 25000;

function renderUsd() {
  document.querySelectorAll('[data-usd]').forEach(el => {
    if (currentLang === 'vi') { el.hidden = true; el.textContent = ''; return; }
    const vnd = Number(el.dataset.usd);
    if (!vnd) { el.hidden = true; return; }
    let usd = vnd / USD_RATE;
    usd = usd < 10 ? Math.round(usd * 2) / 2 : Math.round(usd / 5) * 5;
    const amount = '≈ $' + (Number.isInteger(usd) ? usd : usd.toFixed(1));
    el.textContent = el.dataset.usdUnit === 'day' ? amount + t('unit.day') : amount;
    el.hidden = false;
  });
}

function setLang(code) {
  if (!LANGS[code]) code = 'vi';
  currentLang = code;
  const meta = LANGS[code];

  document.documentElement.lang = meta.htmlLang;
  const page = document.documentElement.dataset.page || '';
  document.title = I18N['meta.title.' + page] ? t('meta.title.' + page) : t('meta.title');
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', I18N['meta.desc.' + page] ? t('meta.desc.' + page) : t('meta.desc'));

  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });

  document.querySelectorAll('[data-lang-label]').forEach(el => { el.textContent = meta.label; });
  document.querySelectorAll('.lang-btn img').forEach(el => { el.src = meta.flag; el.alt = meta.label; });
  document.querySelectorAll('[data-lang]').forEach(el => { el.classList.toggle('active', el.dataset.lang === code); });

  try { localStorage.setItem('greengo-lang', code); } catch (e) {}

  selectBranch(currentBranch.id);
  renderUsd();
}

document.querySelectorAll('[data-lang]').forEach(item => {
  item.addEventListener('click', () => { setLang(item.dataset.lang); closeAllDropdowns(); });
});

/* ============================================================
   Header đổi nền khi cuộn
   ============================================================ */
const header = document.getElementById('siteHeader');
const onScroll = () => { header.classList.toggle('scrolled', window.scrollY > 16); };
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ============================================================
   Menu mobile
   ============================================================ */
const menuBtn = document.getElementById('menuBtn');
const mobilePanel = document.getElementById('mobilePanel');
function closeMobileMenu() {
  mobilePanel.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.querySelector('.material-symbols-rounded').textContent = 'menu';
}
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  const open = mobilePanel.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.querySelector('.material-symbols-rounded').textContent = open ? 'close' : 'menu';
});
mobilePanel.addEventListener('click', e => { if (e.target.closest('a')) closeMobileMenu(); });
document.addEventListener('click', e => {
  if (!mobilePanel.contains(e.target) && !menuBtn.contains(e.target)) closeMobileMenu();
});

/* ============================================================
   Hiệu ứng hiện dần khi cuộn
   ============================================================ */
const revealTargets = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      /* Các phần tử cùng hàng thì hiện lần lượt, tạo cảm giác trôi vào */
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'))
        : [];
      const idx = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
      el.classList.add('is-in');
      /* Xong hiệu ứng thì bỏ độ trễ, tránh ảnh hưởng các transition khác */
      el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-in'));
}


/* ============================================================
   Modal đặt xe
   ============================================================ */
const CHANNELS = [
  { key:'zalo',      name:'Zalo',      icon:'assets/socials/zalo.png' },
  { key:'facebook',  name:'Facebook',  icon:'assets/socials/messenger.png', labelKey:'chan.fanpage' },
  { key:'whatsapp',  name:'WhatsApp',  icon:'assets/socials/whatsapp.png' },
  { key:'kakaotalk', name:'KakaoTalk', icon:'assets/socials/kakaotalk.png' },
  { key:'wechat',    name:'WeChat',    icon:'assets/socials/wechat.png' },
  { key:'telegram',  name:'Telegram',  icon:'assets/socials/telegram.png' }
];

const bookingModal = document.getElementById('bookingModal');
const qrView  = document.getElementById('qrView');
const qrImage = document.getElementById('qrImage');
const qrName  = document.getElementById('qrName');
let lastFocused = null;

/* Dựng lưới kênh nhắn tin theo chi nhánh đang chọn */
function renderChannels() {
  const grid = document.getElementById('chanGrid');
  if (!grid) return;
  const branch = currentBranch;
  grid.innerHTML = '';

  CHANNELS.forEach(chan => {
    const qr   = (branch.qr || {})[chan.key];
    const link = (branch.social || {})[chan.key];
    const hasLink = Boolean(link) && link !== '#';
    const usable = Boolean(qr) || hasLink;

    const el = document.createElement(usable ? 'a' : 'div');
    el.className = 'chan' + (usable ? '' : ' is-off');

    if (qr) {
      el.href = '#';
      el.addEventListener('click', e => { e.preventDefault(); openQr(chan.name, qr); });
    } else if (hasLink) {
      el.href = link;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }

    const sub = qr ? t('chan.qr') : (hasLink ? t(chan.labelKey || 'chan.msg') : t('chan.soon'));
    const box  = document.createElement('span'); box.className = 'bx';
    const img  = document.createElement('img'); img.src = chan.icon; img.alt = ''; img.loading = 'lazy';
    const name = document.createElement('span'); name.className = 'nm'; name.textContent = chan.name;
    const note = document.createElement('span'); note.className = 'sb'; note.textContent = sub;
    box.appendChild(img);
    el.append(box, name, note);
    grid.appendChild(el);
  });
}

function openQr(name, src) {
  qrImage.src = src;
  qrImage.alt = name;
  qrName.textContent = name;
  qrView.classList.add('open');
}
function closeQr() { qrView.classList.remove('open'); qrImage.src = ''; }

function openBooking() {
  lastFocused = document.activeElement;
  closeQr();
  bookingModal.classList.add('open');
  document.body.classList.add('modal-open');
  const close = document.getElementById('modalClose');
  if (close) close.focus({ preventScroll: true });
}
function closeBooking() {
  bookingModal.classList.remove('open');
  document.body.classList.remove('modal-open');
  closeQr();
  if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
}

document.querySelectorAll('[data-open-booking]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); closeMobileMenu(); openBooking(); });
});
document.getElementById('modalClose').addEventListener('click', closeBooking);
document.getElementById('qrBack').addEventListener('click', closeQr);
bookingModal.addEventListener('click', e => { if (e.target === bookingModal) closeBooking(); });

/* Giữ tiêu điểm bàn phím bên trong modal */
bookingModal.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const items = bookingModal.querySelectorAll('a[href], button:not([disabled])');
  const visible = Array.from(items).filter(el => el.offsetParent !== null);
  if (!visible.length) return;
  const first = visible[0], last = visible[visible.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ============================================================
   Khởi tạo
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
buildBranchMenus();

let savedLang = 'vi';
try { savedLang = localStorage.getItem('greengo-lang') || 'vi'; } catch (e) {}
setLang(savedLang);
