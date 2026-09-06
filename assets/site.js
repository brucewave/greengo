/* ============================================================
   Dữ liệu chi nhánh
   ============================================================ */
const BRANCHES = [
  {
    id: 'da-nang',
    nameKey: 'branch.name',
    areaKey: 'branch.area',
    addressKey: 'branch.address',
    hotline: ['0988.169.232', '0787.533.445'],
    hotlineName: ['Ms Hạnh', 'Mr Huy'],
    mapsUrl: 'https://maps.google.com/?q=%C4%90%C3%A0+N%E1%BA%B5ng',
    mapsEmbed: 'https://www.google.com/maps?q=%C4%90%C3%A0+N%E1%BA%B5ng&output=embed',
    social: { facebook: '#', zalo: '#', whatsapp: '#', kakaotalk: '#', wechat: '#', telegram: '#' }
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
  document.querySelectorAll('[data-social]').forEach(el => {
    el.setAttribute('href', branch.social[el.dataset.social] || '#');
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
    vi: 'GreenGo — Thuê Xe Điện Đà Nẵng | Không Cọc, Không Bằng Lái, Đổi Pin Miễn Phí',
    en: 'GreenGo — Electric Scooter Rental in Da Nang | No Deposit, No Licence, Free Battery Swap',
    ko: 'GreenGo — 다낭 전기 스쿠터 렌탈 | 보증금 없음, 면허 불필요, 배터리 무료 교체',
    zh: 'GreenGo — 岘港电动车租赁 | 免押金、免驾照、免费换电池',
    ja: 'GreenGo — ダナン電動バイクレンタル | 保証金不要・免許不要・バッテリー交換無料'
  },
  'meta.desc': {
    vi: 'GreenGo — cho thuê xe máy điện tại Đà Nẵng. Không cọc, không bằng lái, đổi pin miễn phí, giao xe tận nơi. Giá chỉ từ 150.000đ/ngày.',
    en: 'GreenGo — electric scooter rental in Da Nang. No deposit, no licence, free battery swaps and delivery to you. From 150,000 VND a day.',
    ko: 'GreenGo — 다낭 전기 스쿠터 렌탈. 보증금 없음, 면허 불필요, 배터리 무료 교체, 배달 서비스. 하루 150,000동부터.',
    zh: 'GreenGo — 岘港电动摩托车租赁。免押金、免驾照、免费换电池、送车上门。每天仅需 150.000 越南盾起。',
    ja: 'GreenGo — ダナンの電動バイクレンタル。保証金不要、免許不要、バッテリー交換無料、配達あり。1日150,000ドンから。'
  },

  'nav.range':     { vi:'Quãng Đường & Phạm Vi', en:'Range & Coverage', ko:'주행거리 & 이용 범위', zh:'续航与范围', ja:'走行距離とエリア' },
  'nav.pricing':   { vi:'Bảng Giá', en:'Pricing', ko:'요금 안내', zh:'价格表', ja:'料金表' },
  'nav.procedure': { vi:'Thủ Tục Thuê Xe', en:'How to Rent', ko:'대여 절차', zh:'租车流程', ja:'レンタルの流れ' },
  'nav.about':     { vi:'Giới Thiệu', en:'About', ko:'소개', zh:'关于我们', ja:'会社案内' },
  'cta.book':      { vi:'Đặt Xe', en:'Book Now', ko:'예약하기', zh:'立即预订', ja:'予約する' },
  'cta.call':      { vi:'Gọi Ngay', en:'Call Now', ko:'지금 전화', zh:'立即致电', ja:'今すぐ電話' },

  'hero.badge':  { vi:'GreenGo — Đi xanh. Đi tự do.', en:'GreenGo — Ride green. Ride free.', ko:'GreenGo — 친환경으로, 자유롭게', zh:'GreenGo — 绿色出行，自由随行', ja:'GreenGo — グリーンに、自由に。' },
  'hero.title2': { vi:'Thuê Xe Điện Đà Nẵng', en:'Electric Scooter Rental in Da Nang', ko:'다낭 전기 스쿠터 렌탈', zh:'岘港电动车租赁', ja:'ダナン電動バイクレンタル' },
  'hero.title2a': { vi:'Thuê Xe Điện', en:'Electric Scooter', ko:'다낭', zh:'岘港', ja:'ダナン' },
  'hero.title2b': { vi:'Đà Nẵng', en:'Rental in Da Nang', ko:'전기 스쿠터 렌탈', zh:'电动车租赁', ja:'電動バイクレンタル' },
  'hero.lead':   { vi:'Không Cọc – Không Bằng Lái – Đổi Pin Miễn Phí', en:'No Deposit – No Licence – Free Battery Swap', ko:'보증금 없음 – 면허 불필요 – 배터리 무료 교체', zh:'免押金 – 免驾照 – 免费换电池', ja:'保証金不要 – 免許不要 – バッテリー交換無料' },
  'hero.desc': {
    vi:'GreenGo cho thuê xe máy điện tại Đà Nẵng. Xe mới – chạy êm – tiết kiệm – thân thiện môi trường. Phù hợp khách du lịch, đi biển, đi phố cực chill.',
    en:'GreenGo rents electric scooters in Da Nang. New bikes, quiet, economical and easy on the environment — ideal for travellers, beach runs and cruising the city.',
    ko:'GreenGo는 다낭에서 전기 스쿠터를 대여합니다. 새 차량으로 조용하고 경제적이며 친환경적입니다. 여행객, 해변 나들이, 시내 라이딩에 딱 맞습니다.',
    zh:'GreenGo 在岘港提供电动摩托车租赁。车辆全新，行驶安静、省钱又环保，适合游客、去海边或在城里悠闲穿行。',
    ja:'GreenGoはダナンで電動バイクをレンタルしています。新車で静か、経済的で環境にもやさしく、観光やビーチ、街乗りにぴったりです。'
  },
  'hero.cta':   { vi:'Liên hệ ngay để đặt xe', en:'Contact us to book', ko:'지금 문의하고 예약하기', zh:'立即联系预订', ja:'今すぐ問い合わせて予約' },
  'hero.float': { vi:'Sạc đầy sẵn sàng', en:'Fully charged, ready to go', ko:'완충 상태로 준비 완료', zh:'满电待发', ja:'フル充電で準備完了' },
  'branch.label': { vi:'Chi nhánh đang chọn', en:'Selected location', ko:'선택된 지점', zh:'当前门店', ja:'選択中の店舗' },

  'stat.deposit.t': { vi:'Không Cọc', en:'No Deposit', ko:'보증금 없음', zh:'免押金', ja:'保証金不要' },
  'stat.deposit.d': { vi:'Không cần đặt cọc', en:'No deposit required', ko:'보증금이 필요 없습니다', zh:'无需支付押金', ja:'保証金は必要ありません' },
  'stat.battery.t': { vi:'Đổi Pin Free', en:'Free Battery Swap', ko:'배터리 무료 교체', zh:'免费换电池', ja:'バッテリー交換無料' },
  'stat.battery.d': { vi:'Đổi pin miễn phí', en:'Battery swaps at no cost', ko:'배터리 교체 비용 없음', zh:'换电池不收费', ja:'バッテリー交換は無料' },
  'stat.range.d':   { vi:'Quãng đường tối đa', en:'Maximum range', ko:'최대 주행거리', zh:'最大续航', ja:'最大走行距離' },

  'range.h':     { vi:'Quãng Đường & Phạm Vi', en:'Range & Coverage', ko:'주행거리 & 이용 범위', zh:'续航与范围', ja:'走行距離とエリア' },
  'range.c1.t':  { vi:'Quãng Đường', en:'Range', ko:'주행거리', zh:'续航里程', ja:'走行距離' },
  'range.c1.d':  { vi:'Mỗi xe có thể di chuyển tối đa khoảng 120 km cho mỗi lần sạc', en:'Each bike covers up to about 120 km on a single charge.', ko:'한 번 충전으로 약 120km까지 주행할 수 있습니다.', zh:'每次充满电可行驶约 120 公里。', ja:'1回の充電で約120km走行できます。' },
  'range.c2.t':  { vi:'Phạm Vi', en:'Coverage', ko:'이용 범위', zh:'出行范围', ja:'走行エリア' },
  'range.c2.d':  { vi:'Phù hợp di chuyển đi Bà Nà, Hội An và trong khu vực Đà Nẵng', en:'Ideal for trips to Ba Na, Hoi An and around Da Nang.', ko:'바나힐, 호이안, 다낭 시내 이동에 적합합니다.', zh:'适合前往巴拿山、会安以及岘港市区。', ja:'バナヒルズやホイアン、ダナン市内の移動に最適です。' },
  'range.c3.t':  { vi:'Lưu Ý Dốc', en:'Hill Notice', ko:'경사로 주의', zh:'坡道提示', ja:'坂道のご注意' },
  'range.c3.d':  { vi:'Đối với khu vực Sơn Trà, xe có thể không phù hợp với những đoạn dốc quá cao', en:'Around Son Tra the bike may struggle on very steep climbs.', ko:'선짜 지역의 매우 가파른 경사로에서는 주행이 어려울 수 있습니다.', zh:'在山茶半岛，坡度过陡的路段可能不适合骑行。', ja:'ソンチャー半島の急な坂道では走行が難しい場合があります。' },
  'range.c4.t':  { vi:'Hỗ Trợ Pin', en:'Battery Support', ko:'배터리 지원', zh:'电池支持', ja:'バッテリーサポート' },
  'range.c4.d':  { vi:'Hỗ trợ đổi pin miễn phí trong suốt thời gian thuê', en:'Free battery swaps for the whole rental period.', ko:'대여 기간 내내 배터리를 무료로 교체해 드립니다.', zh:'租赁期间可免费更换电池。', ja:'レンタル期間中はバッテリー交換が無料です。' },

  'pricing.sub':  { vi:'Giá thuê xe máy điện GreenGo phù hợp mọi nhu cầu', en:'GreenGo rental rates for every kind of trip', ko:'모든 일정에 맞는 GreenGo 대여 요금', zh:'满足各种需求的 GreenGo 租车价格', ja:'あらゆるご予定に合うGreenGoの料金' },
  'pricing.best': { vi:'Giá Tốt Nhất', en:'Best Value', ko:'최저가', zh:'最优惠', ja:'一番お得' },
  'unit.day':     { vi:'/ngày', en:'/day', ko:'/일', zh:'/天', ja:'/日' },
  'plan.week':    { vi:'7+ Ngày', en:'7+ Days', ko:'7일 이상', zh:'7 天以上', ja:'7日以上' },
  'plan.week.d':  { vi:'Giá tốt nhất cho lịch trình Đà Nẵng trọn tuần.', en:'The best rate for a full week in Da Nang.', ko:'다낭에서 일주일을 보내기에 가장 좋은 요금입니다.', zh:'在岘港待满一周最划算的价格。', ja:'ダナンで1週間過ごすなら一番お得な料金です。' },
  'plan.d13':     { vi:'1–3 Ngày', en:'1–3 Days', ko:'1~3일', zh:'1–3 天', ja:'1〜3日' },
  'plan.d13.d':   { vi:'Thuê nhanh để đi biển, đi phố và thử trải nghiệm xe điện.', en:'A quick rental for the beach, the city and a first taste of riding electric.', ko:'해변과 시내를 둘러보고 전기 스쿠터를 처음 경험해 보기 좋은 단기 대여입니다.', zh:'短租体验：去海边、逛市区，第一次尝试电动车。', ja:'ビーチや街歩き、電動バイクのお試しにぴったりの短期レンタル。' },
  'plan.d46':     { vi:'4–6 Ngày', en:'4–6 Days', ko:'4~6일', zh:'4–6 天', ja:'4〜6日' },
  'plan.d46.d':   { vi:'Đủ nhịp để đi Hội An, bán đảo Sơn Trà và các điểm xa hơn.', en:'Enough time for Hoi An, the Son Tra peninsula and places further out.', ko:'호이안, 선짜 반도 등 조금 먼 곳까지 다녀오기 충분합니다.', zh:'足够去会安、山茶半岛以及更远的地方。', ja:'ホイアンやソンチャー半島など、少し遠出するのに十分な日数です。' },
  'plan.month':   { vi:'1 Tháng', en:'1 Month', ko:'1개월', zh:'1 个月', ja:'1ヶ月' },
  'plan.month.d': { vi:'Phù hợp khách ở dài ngày, làm việc hoặc sống tại Đà Nẵng.', en:'For long stays, remote work or living in Da Nang.', ko:'장기 체류, 원격 근무, 다낭 거주에 적합합니다.', zh:'适合长住、远程办公或在岘港生活的客人。', ja:'長期滞在やリモートワーク、ダナン在住の方に。' },

  'perk.deposit': { vi:'Không cọc', en:'No deposit', ko:'보증금 없음', zh:'免押金', ja:'保証金不要' },
  'perk.license': { vi:'Không bằng lái', en:'No licence', ko:'면허 불필요', zh:'免驾照', ja:'免許不要' },
  'perk.battery': { vi:'Đổi pin miễn phí', en:'Free battery swap', ko:'배터리 무료 교체', zh:'免费换电池', ja:'バッテリー交換無料' },
  'perk.delivery':{ vi:'Giao xe 3km', en:'Delivery within 3 km', ko:'3km 이내 배달', zh:'3 公里内送车', ja:'3km以内配達' },
  'perk.support': { vi:'Hỗ trợ 24/7', en:'24/7 support', ko:'24시간 지원', zh:'24 小时支持', ja:'24時間サポート' },
  'perk.newbike': { vi:'Xe điện mới', en:'New e-bikes', ko:'신형 전기 스쿠터', zh:'全新电动车', ja:'新型電動バイク' },

  'proc.sub': { vi:'Chỉ 4 bước đơn giản để có xe', en:'Just four simple steps', ko:'단 4단계면 끝', zh:'只需简单四步', ja:'たった4ステップ' },
  'step1.t':  { vi:'Liên Hệ & Đặt Xe', en:'Contact & Book', ko:'문의 및 예약', zh:'联系并预订', ja:'問い合わせ・予約' },
  'step1.d':  { vi:'Liên hệ qua các nền tảng bên dưới để chọn xe và thời gian thuê phù hợp.', en:'Message us on any channel below to pick your bike and rental dates.', ko:'아래 채널로 연락해 차량과 대여 기간을 정하세요.', zh:'通过下方任一渠道联系我们，选择车辆和租期。', ja:'下記のいずれかの方法でご連絡いただき、車両とレンタル期間をお選びください。' },
  'step2.t':  { vi:'Xác Nhận Thông Tin', en:'Verify Details', ko:'정보 확인', zh:'确认信息', ja:'情報の確認' },
  'step2.d':  { vi:'Quý khách cung cấp hình ảnh CCCD, hộ chiếu hoặc giấy tờ tùy thân để xác nhận.', en:'Send a photo of your ID card or passport so we can confirm the booking.', ko:'신분증 또는 여권 사진을 보내 주시면 예약을 확정합니다.', zh:'请提供身份证或护照照片，以便我们确认预订。', ja:'身分証またはパスポートの写真をお送りいただき、予約を確定します。' },
  'step3.t':  { vi:'Nhận Xe & Trải Nghiệm', en:'Pick Up & Ride', ko:'차량 인수 및 라이딩', zh:'取车出发', ja:'受け取り・出発' },
  'step3.d':  { vi:'Giao xe miễn phí trong phạm vi 3 km. Thoải mái trải nghiệm và khám phá.', en:'Free delivery within 3 km — then go explore at your own pace.', ko:'3km 이내 무료 배달 후 자유롭게 다니세요.', zh:'3 公里内免费送车，然后尽情探索。', ja:'3km以内は無料配達。あとは自由にお出かけください。' },
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

  'branch.name':    { vi:'GreenGo Đà Nẵng', en:'GreenGo Da Nang', ko:'GreenGo 다낭', zh:'GreenGo 岘港', ja:'GreenGo ダナン' },
  'branch.area':    { vi:'Cho thuê xe máy điện toàn thành phố Đà Nẵng', en:'Electric scooter rental across Da Nang', ko:'다낭 전역 전기 스쿠터 대여', zh:'岘港全城电动车租赁', ja:'ダナン全域で電動バイクレンタル' },
  'branch.address': { vi:'Đà Nẵng — địa chỉ đang cập nhật', en:'Da Nang — address coming soon', ko:'다낭 — 주소 업데이트 예정', zh:'岘港 — 地址更新中', ja:'ダナン — 住所は準備中' }
};

/* ============================================================
   Nội dung riêng của các trang con
   ============================================================ */
Object.assign(I18N, {
  'meta.title.pricing': {
    vi:'Bảng Giá Thuê Xe Điện Đà Nẵng | GreenGo',
    en:'Electric Scooter Rental Prices in Da Nang | GreenGo',
    ko:'다낭 전기 스쿠터 렌탈 요금 | GreenGo',
    zh:'岘港电动车租赁价格 | GreenGo',
    ja:'ダナン電動バイクレンタル料金 | GreenGo'
  },
  'meta.desc.pricing': {
    vi:'Giá thuê xe máy điện GreenGo tại Đà Nẵng: từ 110.000đ/ngày, thuê tháng 2.100.000đ. Không cọc, không bằng lái, đổi pin miễn phí.',
    en:'GreenGo electric scooter rental rates in Da Nang: from 110,000 VND a day, 2,100,000 VND a month. No deposit, no licence, free battery swaps.',
    ko:'다낭 GreenGo 전기 스쿠터 대여 요금: 하루 110,000동부터, 월 2,100,000동. 보증금 없음, 면허 불필요, 배터리 무료 교체.',
    zh:'岘港 GreenGo 电动车租赁价格：每天 110.000 越南盾起，包月 2.100.000 越南盾。免押金、免驾照、免费换电池。',
    ja:'ダナンのGreenGo電動バイクレンタル料金：1日110,000ドンから、1ヶ月2,100,000ドン。保証金不要・免許不要・バッテリー交換無料。'
  },
  'meta.title.procedure': {
    vi:'Thủ Tục Thuê Xe Điện Đà Nẵng | GreenGo',
    en:'How to Rent an Electric Scooter in Da Nang | GreenGo',
    ko:'다낭 전기 스쿠터 대여 절차 | GreenGo',
    zh:'岘港电动车租车流程 | GreenGo',
    ja:'ダナン電動バイクレンタルの流れ | GreenGo'
  },
  'meta.desc.procedure': {
    vi:'Năm bước thuê xe máy điện tại GreenGo Đà Nẵng: liên hệ, gửi giấy tờ, nhận xe tận nơi, đi chơi và trả xe. Không cọc, giao xe miễn phí trong 3 km.',
    en:'Five steps to rent an electric scooter from GreenGo in Da Nang: get in touch, send an ID, take delivery, ride, return. No deposit, free delivery within 3 km.',
    ko:'다낭 GreenGo에서 전기 스쿠터를 빌리는 다섯 단계: 문의, 신분증 전송, 배달 수령, 주행, 반납. 보증금 없음, 3km 이내 무료 배달.',
    zh:'在岘港 GreenGo 租电动车的五个步骤：联系、发证件、送车上门、骑行、还车。免押金，3 公里内免费送车。',
    ja:'ダナンのGreenGoで電動バイクを借りる5ステップ：連絡、身分証送付、受け取り、走行、返却。保証金不要、3km以内配達無料。'
  },
  'meta.title.about': {
    vi:'Về GreenGo — Thuê Xe Điện Đà Nẵng',
    en:'About GreenGo — Electric Scooter Rental in Da Nang',
    ko:'GreenGo 소개 — 다낭 전기 스쿠터 렌탈',
    zh:'关于 GreenGo — 岘港电动车租赁',
    ja:'GreenGoについて — ダナン電動バイクレンタル'
  },
  'meta.desc.about': {
    vi:'GreenGo cho thuê xe máy điện tại Đà Nẵng: xe mới chạy 120 km mỗi lần sạc, không cọc, không bằng lái, hỗ trợ 5 thứ tiếng.',
    en:'GreenGo rents electric scooters in Da Nang: new bikes with 120 km of range, no deposit, no licence, support in five languages.',
    ko:'GreenGo는 다낭에서 전기 스쿠터를 대여합니다. 1회 충전 120km 신형 차량, 보증금 없음, 면허 불필요, 5개 언어 지원.',
    zh:'GreenGo 在岘港提供电动摩托车租赁：全新车辆续航 120 公里，免押金、免驾照、五种语言支持。',
    ja:'GreenGoはダナンで電動バイクをレンタル。航続120kmの新車、保証金不要、免許不要、5言語対応。'
  },
  'nav.home': { vi:'Trang chủ', en:'Home', ko:'홈', zh:'首页', ja:'ホーム' },

  /* ---------- Trang bảng giá ---------- */
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
    vi:'Dành cho người ở lại Đà Nẵng: đi làm, làm việc từ xa, hoặc chỉ đơn giản là sống ở đây một thời gian.',
    en:'For people staying on in Da Nang — commuting, working remotely, or simply living here a while.',
    ko:'다낭에 머무는 분들을 위한 요금제입니다. 출퇴근, 원격 근무, 또는 한동안 이곳에서 생활하실 때.',
    zh:'给留在岘港的人：通勤、远程工作，或者就是在这里住一段时间。',
    ja:'ダナンに滞在する方へ。通勤、リモートワーク、あるいはしばらく暮らす場合に。'
  },

  'plan.d13.area':  { vi:'Biển Mỹ Khê · Bán đảo Sơn Trà · Phố trung tâm', en:'My Khe beach · Son Tra peninsula · City centre', ko:'미케 비치 · 선짜 반도 · 시내 중심', zh:'美溪海滩 · 山茶半岛 · 市中心', ja:'ミーケービーチ · ソンチャー半島 · 市街地' },
  'plan.d46.area':  { vi:'Hội An · Bà Nà · Ngũ Hành Sơn', en:'Hoi An · Ba Na · Marble Mountains', ko:'호이안 · 바나힐 · 오행산', zh:'会安 · 巴拿山 · 五行山', ja:'ホイアン · バナヒルズ · 五行山' },
  'plan.week.area': { vi:'Khắp Đà Nẵng · Hội An · đèo Hải Vân', en:'All of Da Nang · Hoi An · Hai Van pass', ko:'다낭 전역 · 호이안 · 하이반 고개', zh:'岘港全城 · 会安 · 海云关', ja:'ダナン全域 · ホイアン · ハイヴァン峠' },
  'plan.month.area':{ vi:'Đi lại hằng ngày trong thành phố', en:'Everyday travel around the city', ko:'시내 일상 이동', zh:'城内日常代步', ja:'市内の日常移動' },

  'incl.h':   { vi:'Đã Bao Gồm', en:'What Is Included', ko:'포함 사항', zh:'已包含', ja:'料金に含まれるもの' },
  'incl.sub': { vi:'Mọi gói thuê đều có sẵn những điều dưới đây', en:'Every rental comes with all of the following', ko:'모든 대여에 아래 항목이 모두 포함됩니다', zh:'每一份租约都包含以下内容', ja:'すべてのレンタルに以下がすべて付きます' },
  'incl.1.t': { vi:'Không đặt cọc', en:'No deposit', ko:'보증금 없음', zh:'免押金', ja:'保証金不要' },
  'incl.1.d': { vi:'Thanh toán khi nhận xe', en:'Pay when you collect the bike', ko:'차량 인수 시 결제', zh:'取车时付款', ja:'受け取り時にお支払い' },
  'incl.2.t': { vi:'Không cần bằng lái', en:'No licence needed', ko:'면허 불필요', zh:'免驾照', ja:'免許不要' },
  'incl.2.d': { vi:'Chỉ cần giấy tờ tuỳ thân để xác nhận', en:'Just an ID document to confirm the booking', ko:'예약 확인용 신분증만 있으면 됩니다', zh:'只需身份证件用于确认', ja:'ご予約確認用の身分証のみ' },
  'incl.3.t': { vi:'Đổi pin miễn phí', en:'Free battery swaps', ko:'배터리 무료 교체', zh:'免费换电池', ja:'バッテリー交換無料' },
  'incl.3.d': { vi:'Không giới hạn số lần trong thời gian thuê', en:'As many times as you need while renting', ko:'대여 기간 중 횟수 제한 없음', zh:'租期内不限次数', ja:'レンタル期間中は回数制限なし' },
  'incl.4.t': { vi:'Giao xe tận nơi', en:'Delivery to you', ko:'배달 서비스', zh:'送车上门', ja:'お届けサービス' },
  'incl.4.d': { vi:'Miễn phí trong phạm vi 3 km quanh cửa hàng', en:'Free within 3 km of the shop', ko:'매장 기준 3km 이내 무료', zh:'门店 3 公里内免费', ja:'店舗から3km以内は無料' },
  'incl.5.t': { vi:'Hỗ trợ 5 ngôn ngữ', en:'Support in five languages', ko:'5개 언어 지원', zh:'五种语言支持', ja:'5言語対応' },
  'incl.5.d': { vi:'Việt · Anh · Hàn · Trung · Nhật', en:'Vietnamese · English · Korean · Chinese · Japanese', ko:'베트남어 · 영어 · 한국어 · 중국어 · 일본어', zh:'越南语 · 英语 · 韩语 · 中文 · 日语', ja:'ベトナム語 · 英語 · 韓国語 · 中国語 · 日本語' },
  'incl.6.t': { vi:'Xe điện mới', en:'New electric scooters', ko:'신형 전기 스쿠터', zh:'全新电动车', ja:'新型電動バイク' },
  'incl.6.d': { vi:'Chạy tới 120 km cho mỗi lần sạc', en:'Up to 120 km on a single charge', ko:'한 번 충전으로 최대 120km', zh:'充满电可行驶 120 公里', ja:'1回の充電で最大120km' },

  'faq.h': { vi:'Câu Hỏi Thường Gặp', en:'Frequently Asked Questions', ko:'자주 묻는 질문', zh:'常见问题', ja:'よくあるご質問' },
  'faq.1.q': { vi:'Tôi có cần bằng lái không?', en:'Do I need a licence?', ko:'면허가 필요한가요?', zh:'需要驾照吗？', ja:'免許は必要ですか？' },
  'faq.1.a': {
    vi:'Không. GreenGo không yêu cầu bằng lái khi thuê xe, bạn chỉ cần một giấy tờ tuỳ thân để xác nhận đơn thuê.',
    en:'No. GreenGo does not ask for a licence to rent — you only need one ID document so we can confirm the booking.',
    ko:'아니요. GreenGo는 대여 시 면허를 요구하지 않습니다. 예약 확인을 위한 신분증 한 가지만 준비해 주세요.',
    zh:'不需要。GreenGo 租车不要求驾照，您只需提供一份身份证件供我们确认订单。',
    ja:'いりません。GreenGoではレンタル時に免許を確認しません。ご予約確認のため身分証を1点だけご用意ください。'
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
    vi:'Gọi hotline, chúng tôi mang pin đã sạc tới đổi. Việc đổi pin miễn phí và không giới hạn số lần trong thời gian bạn thuê.',
    en:'Call the hotline and we will bring a charged battery to you. Swaps are free and unlimited for the whole rental.',
    ko:'핫라인으로 전화 주시면 충전된 배터리를 가져다 드립니다. 교체는 대여 기간 내내 무료이며 횟수 제한이 없습니다.',
    zh:'打热线给我们，我们会带充好电的电池过去换。租期内换电池免费且不限次数。',
    ja:'ホットラインにお電話いただければ、充電済みバッテリーをお届けします。交換はレンタル期間中いつでも無料・回数無制限です。'
  },
  'faq.4.q': { vi:'Có giao xe tận nơi không?', en:'Do you deliver?', ko:'배달해 주시나요?', zh:'可以送车上门吗？', ja:'配達はしてもらえますか？' },
  'faq.4.a': {
    vi:'Có. Chúng tôi giao xe miễn phí trong phạm vi 3 km quanh cửa hàng. Xa hơn thì vẫn giao được, có phụ phí nhỏ, cứ hỏi trước khi đặt.',
    en:'Yes — free within 3 km of the shop. We can go further for a small fee, so just ask before you book.',
    ko:'네, 매장에서 3km 이내는 무료입니다. 더 먼 곳도 소액의 추가 요금으로 가능하니 예약 전에 문의해 주세요.',
    zh:'可以。门店 3 公里内免费送车。更远也能送，收取少量费用，下单前问一声就好。',
    ja:'はい。店舗から3km以内は無料です。それより遠方も少額の追加料金で対応しますので、ご予約前にお問い合わせください。'
  },
  'faq.5.q': { vi:'Xe gặp sự cố giữa đường thì liên hệ ai?', en:'Who do I call if something goes wrong?', ko:'문제가 생기면 누구에게 연락하나요?', zh:'路上出问题找谁？', ja:'途中で不具合が出たら？' },
  'faq.5.a': {
    vi:'Gọi một trong hai hotline ở cuối trang, bất cứ giờ nào. Chúng tôi sẽ tới xử lý hoặc đổi xe khác cho bạn.',
    en:'Call either hotline at the bottom of this page, any time of day. We will come and fix it or swap the bike.',
    ko:'페이지 하단의 두 핫라인 중 아무 번호로든 언제든 전화 주세요. 저희가 가서 수리하거나 다른 차량으로 교체해 드립니다.',
    zh:'随时拨打页面底部任一条热线。我们会过去处理，或者给您换一辆。',
    ja:'ページ下部のホットラインへ、時間を問わずお電話ください。現場で対応、または別の車両に交換します。'
  },

  /* ---------- Trang thủ tục ---------- */
  'proc.h1': { vi:'Quy Trình Thuê Xe', en:'How Renting Works', ko:'대여 절차', zh:'租车流程', ja:'レンタルの流れ' },
  'proc.lead': {
    vi:'Thuê xe ở GreenGo gọn nhẹ: một cuộc gọi hoặc một tin nhắn, gửi giấy tờ, nhận xe và đi.',
    en:'Renting from GreenGo is light on paperwork: one call or message, send an ID, take the bike and go.',
    ko:'GreenGo의 대여는 간단합니다. 전화나 메시지 한 번, 신분증 전송, 차량 인수 후 출발.',
    zh:'在 GreenGo 租车很省事：一个电话或一条消息，发份证件，取车就走。',
    ja:'GreenGoのレンタルは手続きが軽いです。電話かメッセージ1回、身分証を送り、車両を受け取って出発。'
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
  'pstep.3.t': { vi:'Nhận Xe', en:'Pick Up the Bike', ko:'차량 인수', zh:'取车', ja:'車両の受け取り' },
  'pstep.3.d': {
    vi:'Chúng tôi giao xe miễn phí trong phạm vi 3 km, xa hơn có phụ phí nhỏ. Lúc giao, nhân viên hướng dẫn bạn cách chạy, cách sạc và cách gọi đổi pin.',
    en:'Delivery is free within 3 km, with a small fee beyond that. When we hand over the bike we show you how to ride it, how to charge it and how to ask for a battery swap.',
    ko:'3km 이내는 무료 배달이며, 그보다 멀면 소액의 추가 요금이 있습니다. 인수 시 주행 방법, 충전 방법, 배터리 교체 요청 방법을 안내해 드립니다.',
    zh:'3 公里内免费送车，更远收取少量费用。交车时我们会教您怎么骑、怎么充电、以及怎么叫人来换电池。',
    ja:'3km以内は無料配達、それ以上は少額の追加料金です。お渡しの際に、運転方法・充電方法・バッテリー交換の依頼方法をご説明します。'
  },
  'pstep.4.t': { vi:'Đi Chơi Thoải Mái', en:'Enjoy the Ride', ko:'자유롭게 라이딩', zh:'尽情骑行', ja:'自由にお出かけ' },
  'pstep.4.d': {
    vi:'Xe chạy tới 120 km cho mỗi lần sạc, đủ cho biển Mỹ Khê, sông Hàn, Hội An hay Bà Nà. Hết pin thì gọi, chúng tôi mang pin tới đổi, miễn phí.',
    en:'The bike covers up to 120 km per charge — enough for My Khe beach, the Han river, Hoi An or Ba Na. Run low and just call: we bring a charged battery, free.',
    ko:'한 번 충전으로 최대 120km를 달립니다. 미케 비치, 한강, 호이안, 바나힐까지 충분합니다. 배터리가 부족하면 전화만 주세요. 충전된 배터리를 무료로 가져다 드립니다.',
    zh:'充满电可跑 120 公里，去美溪海滩、韩江、会安或巴拿山都够。电量不足打个电话，我们免费送充好的电池过去。',
    ja:'1回の充電で最大120km。ミーケービーチ、ハン川、ホイアン、バナヒルズまで十分です。残量が減ったらお電話一本で、充電済みバッテリーを無料でお届けします。'
  },
  'pstep.5.t': { vi:'Trả Xe & Đánh Giá', en:'Return & Review', ko:'반납 및 리뷰', zh:'还车与评价', ja:'返却・レビュー' },
  'pstep.5.d': {
    vi:'Trả xe đúng giờ và đúng nơi đã hẹn. Nếu chuyến đi ổn, để lại cho chúng tôi một đánh giá trên Google Maps — khách sau sẽ dễ tìm thấy GreenGo hơn.',
    en:'Return the bike at the time and place agreed. If the trip went well, leave us a review on Google Maps — it helps the next traveller find GreenGo.',
    ko:'약속한 시간과 장소에 반납해 주세요. 여행이 좋았다면 Google 지도에 후기를 남겨 주세요. 다음 여행자가 GreenGo를 찾는 데 도움이 됩니다.',
    zh:'按约定的时间和地点还车。如果这趟骑得顺心，请在 Google 地图上留个评价，让后来的旅客更容易找到 GreenGo。',
    ja:'お約束の時間と場所でご返却ください。旅が良かったら、Googleマップにレビューを残していただけると、次の旅行者がGreenGoを見つけやすくなります。'
  },

  'tips.h': { vi:'Mẹo Nhỏ Khi Đi Đường', en:'A Few Tips for the Road', ko:'라이딩 팁', zh:'上路小提示', ja:'走行時のコツ' },
  'tip.1': { vi:'Kiểm tra mức pin trước khi đi Hội An hoặc Bà Nà — hai chặng này khá dài.', en:'Check the battery before heading to Hoi An or Ba Na — both are long runs.', ko:'호이안이나 바나힐로 떠나기 전에 배터리를 확인하세요. 두 곳 모두 거리가 깁니다.', zh:'去会安或巴拿山前先看电量，这两条路都不近。', ja:'ホイアンやバナヒルズへ行く前にバッテリー残量を確認してください。どちらも距離があります。' },
  'tip.2': { vi:'Bán đảo Sơn Trà có nhiều đoạn dốc cao, nên đi khi pin còn nhiều.', en:'The Son Tra peninsula has some steep climbs — go with plenty of charge.', ko:'선짜 반도에는 급한 경사가 있습니다. 배터리를 넉넉히 채우고 가세요.', zh:'山茶半岛有不少陡坡，电量充足再去。', ja:'ソンチャー半島には急な坂があります。充電を十分にしてお出かけください。' },
  'tip.3': { vi:'Luôn đội mũ bảo hiểm, kể cả khi chỉ đi một đoạn ngắn.', en:'Always wear a helmet, even for a short hop.', ko:'짧은 거리라도 항상 헬멧을 착용하세요.', zh:'哪怕只骑一小段，也请戴好头盔。', ja:'短い距離でも必ずヘルメットを着用してください。' },
  'tip.4': { vi:'Khoá xe mỗi lần đậu ở nơi công cộng.', en:'Lock the bike whenever you park in public.', ko:'공공장소에 주차할 때는 반드시 잠그세요.', zh:'在公共场所停车时记得上锁。', ja:'公共の場所に駐車するときは必ず施錠してください。' },
  'tip.5': { vi:'Lưu sẵn hai số hotline vào điện thoại trước khi khởi hành.', en:'Save both hotline numbers to your phone before you set off.', ko:'출발 전에 두 개의 핫라인 번호를 휴대폰에 저장해 두세요.', zh:'出发前把两条热线号码存进手机。', ja:'出発前に2つのホットライン番号を携帯に保存しておきましょう。' },

  /* ---------- Trang giới thiệu ---------- */
  'about.h1': { vi:'Về GreenGo', en:'About GreenGo', ko:'GreenGo 소개', zh:'关于 GreenGo', ja:'GreenGoについて' },
  'about.lead': {
    vi:'Cho thuê xe máy điện tại Đà Nẵng — thủ tục nhẹ, giá rõ ràng, và một chiếc xe sẵn sàng đưa bạn đi.',
    en:'Electric scooter rental in Da Nang — light on paperwork, clear on price, with a bike ready to take you out.',
    ko:'다낭의 전기 스쿠터 렌탈 — 간단한 절차, 명확한 요금, 그리고 언제든 출발할 준비가 된 차량.',
    zh:'岘港的电动摩托车租赁 — 手续简单，价格清楚，车随时能载您出发。',
    ja:'ダナンの電動バイクレンタル — 手続きは簡単、料金は明快、いつでも出発できる一台とともに。'
  },
  'about.who.t': { vi:'GreenGo Là Ai', en:'Who We Are', ko:'GreenGo는', zh:'我们是谁', ja:'GreenGoとは' },
  'about.who.d': {
    vi:'GreenGo cho thuê xe máy điện tại Đà Nẵng, phục vụ cả du khách ghé thành phố vài ngày và những người ở lại lâu hơn. Toàn bộ xe đều là xe điện mới: chạy êm, không tiếng động cơ, không mùi xăng, và mỗi lần sạc đi được tới 120 km.',
    en:'GreenGo rents electric scooters in Da Nang, for travellers passing through for a few days and for people who stay longer. Every bike is a new electric one: quiet, no engine noise, no smell of petrol, and up to 120 km on a charge.',
    ko:'GreenGo는 다낭에서 전기 스쿠터를 대여합니다. 며칠 머무는 여행자부터 더 오래 지내는 분들까지 함께 이용합니다. 모든 차량은 신형 전기 스쿠터입니다. 조용하고, 엔진 소음도 기름 냄새도 없으며, 한 번 충전으로 최대 120km를 달립니다.',
    zh:'GreenGo 在岘港做电动摩托车租赁，既服务只待几天的旅客，也服务住得更久的人。所有车都是全新电动车：安静、没有引擎噪音、没有汽油味，充一次电能跑 120 公里。',
    ja:'GreenGoはダナンで電動バイクをレンタルしています。数日滞在の旅行者から、より長く過ごす方まで。車両はすべて新しい電動バイクです。静かでエンジン音も燃料の匂いもなく、1回の充電で最大120km走ります。'
  },
  'about.why.t': { vi:'Cách Chúng Tôi Làm Việc', en:'How We Work', ko:'저희가 일하는 방식', zh:'我们怎么做事', ja:'私たちの進め方' },
  'about.why.d': {
    vi:'Chúng tôi bỏ đi những thứ khiến việc thuê xe trở nên mệt: không đặt cọc, không giữ giấy tờ gốc, không yêu cầu bằng lái, không phí ẩn. Giá trên bảng là giá bạn trả. Pin hết thì chúng tôi mang pin tới đổi, không tính thêm đồng nào.',
    en:'We removed the parts that make renting tiring: no deposit, no holding your original documents, no licence required, no hidden fees. The listed price is the price you pay. When the battery runs low we bring you another one at no extra cost.',
    ko:'대여를 번거롭게 만드는 것들을 없앴습니다. 보증금 없음, 원본 서류 보관 없음, 면허 요구 없음, 숨은 비용 없음. 표시된 요금이 실제 지불 금액입니다. 배터리가 부족하면 추가 비용 없이 새 배터리를 가져다 드립니다.',
    zh:'我们把让租车变麻烦的环节都去掉了：不收押金、不扣原件、不要驾照、没有隐藏费用。标价就是您付的价。电池快没电了，我们免费送一块过去换。',
    ja:'レンタルを面倒にする部分を取り除きました。保証金なし、原本の預かりなし、免許の確認なし、隠れた費用なし。表示価格がお支払い額です。バッテリーが減ったら、追加費用なしで別のものをお届けします。'
  },
  'about.mission.t': { vi:'Điều Chúng Tôi Muốn', en:'What We Are After', ko:'저희가 바라는 것', zh:'我们想做到的', ja:'目指していること' },
  'about.mission.d': {
    vi:'Một thành phố biển thì nên đi bằng thứ không thải khói ra biển. Chúng tôi muốn xe điện là lựa chọn dễ nhất cho bất kỳ ai tới Đà Nẵng — dễ thuê, dễ chạy, dễ gọi khi cần giúp, bằng thứ tiếng mà khách nói.',
    en:'A city by the sea deserves to be seen from something that does not smoke into it. We want an electric bike to be the easiest choice for anyone arriving in Da Nang — easy to rent, easy to ride, easy to get help with, in the language the rider speaks.',
    ko:'바다를 품은 도시라면, 그 바다에 연기를 내뿜지 않는 것으로 둘러보는 편이 좋습니다. 다낭에 오는 누구에게나 전기 스쿠터가 가장 쉬운 선택이 되길 바랍니다. 빌리기 쉽고, 타기 쉽고, 손님이 쓰는 언어로 도움을 받기 쉬운 선택으로.',
    zh:'临海的城市，理当用不朝它冒烟的方式去看。我们希望电动车成为每位来岘港的人最省心的选择：好租、好骑，需要帮忙时能用自己的语言找到人。',
    ja:'海のある街は、その海に煙を出さないもので巡るのがふさわしい。ダナンに来るすべての人にとって、電動バイクが最も手軽な選択になってほしいと考えています。借りやすく、乗りやすく、必要なときに自分の言葉で助けを求められるように。'
  },

  'why.h': { vi:'Vì Sao Chọn GreenGo', en:'Why Choose GreenGo', ko:'GreenGo를 선택하는 이유', zh:'为什么选 GreenGo', ja:'GreenGoが選ばれる理由' },
  'why.1.t': { vi:'Không Khí Thải', en:'Zero Emissions', ko:'배출가스 없음', zh:'零排放', ja:'排出ガスゼロ' },
  'why.1.d': { vi:'Xe điện hoàn toàn, không xả khói ra phố và ra biển.', en:'Fully electric — nothing coming out of the exhaust.', ko:'완전 전기 구동으로 배기가스가 없습니다.', zh:'纯电动，不往街上和海边排废气。', ja:'完全電動で、排気ガスが出ません。' },
  'why.2.t': { vi:'Thủ Tục Nhẹ', en:'Light Paperwork', ko:'간단한 절차', zh:'手续简单', ja:'手続きが簡単' },
  'why.2.d': { vi:'Một ảnh giấy tờ tuỳ thân là đủ. Không cọc, không giữ bản gốc.', en:'One photo of an ID is enough. No deposit, no originals held.', ko:'신분증 사진 한 장이면 충분합니다. 보증금도, 원본 보관도 없습니다.', zh:'一张身份证件照片就够。不收押金，不扣原件。', ja:'身分証の写真1枚で十分。保証金も原本の預かりもありません。' },
  'why.3.t': { vi:'Giá Rõ Ràng', en:'Clear Pricing', ko:'명확한 요금', zh:'价格透明', ja:'明快な料金' },
  'why.3.d': { vi:'Giá trên bảng là giá thanh toán, không phụ thu phát sinh.', en:'The listed price is what you pay — no surcharges later.', ko:'표시된 요금이 결제 금액입니다. 추가 청구는 없습니다.', zh:'标价就是付款价，事后不加收。', ja:'表示価格がお支払い額。後からの追加請求はありません。' },
  'why.4.t': { vi:'Gọi Là Có Người Nghe', en:'Someone Always Answers', ko:'언제나 연결됩니다', zh:'打电话就有人接', ja:'いつでも応答します' },
  'why.4.d': { vi:'Hai hotline trực suốt ngày, hỗ trợ bằng 5 thứ tiếng.', en:'Two hotlines all day, help in five languages.', ko:'두 개의 핫라인이 하루 종일, 5개 언어로 지원합니다.', zh:'两条热线全天在线，五种语言支持。', ja:'2つのホットラインが終日対応、5言語でサポート。' },

  /* ---------- Khối kêu gọi cuối trang con ---------- */
  'ctaband.h':   { vi:'Sẵn sàng nhận xe chưa?', en:'Ready to pick up a bike?', ko:'차량을 받으실 준비가 되셨나요?', zh:'准备取车了吗？', ja:'車両を受け取る準備はできましたか？' },
  'ctaband.sub': { vi:'Gọi hotline hoặc nhắn tin, chúng tôi phản hồi trong vài phút.', en:'Call a hotline or send a message — we reply within minutes.', ko:'핫라인으로 전화하거나 메시지를 보내 주세요. 몇 분 안에 답변드립니다.', zh:'打热线或发消息给我们，几分钟内回复。', ja:'ホットラインへお電話かメッセージをどうぞ。数分以内に返信します。' }
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
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal')) : [];
      const idx = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
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
