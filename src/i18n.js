const translations = {
  tr: {
    // ===== APP.JSX - Header =====
    appName: 'beni-iceri-al-DPI',
    statusActive: 'AKTİF',
    statusInactive: 'KAPALI',
    statusReady: 'HAZIR',

    // ===== APP.JSX - Main Status =====
    statusConnected: 'GÜVENLİ',
    statusConnecting: 'BAĞLANIYOR...',
    statusDisconnecting: 'KESİLİYOR...',
    statusReady2: 'HAZIR',
    descConnected: 'Bağlantınız şifrelendi ve korunuyor.',
    descConnecting: 'İşlem yapılıyor, lütfen bekleyin.',
    descReady: 'DPI Bypass için bağlanın.',

    // ===== APP.JSX - Buttons =====
    btnConnect: 'BAĞLAN',
    btnDisconnect: 'BAĞLANTIYI KES',
    btnConnecting: 'BAĞLANIYOR...',
    btnApplyingSettings: 'AYAR UYGULANIYOR...',
    btnDisconnecting: 'KESİLİYOR...',
    btnConnectDevices: 'Diğer Cihazları Bağla',

    // ===== APP.JSX - Bottom Nav =====
    navSettings: 'AYARLAR',
    navLogs: 'LOGLAR',
    navExit: 'ÇIKIŞ',

    // ===== APP.JSX - Logs Panel =====
    logsTitle: 'SİSTEM LOGLARI',
    logsClear: 'TEMİZLE',
    logsCopy: 'KOPYALA',
    logsCopied: 'KOPYALANDI!',
    logsCopyError: 'HATA!',

    // ===== APP.JSX - Connection Modal =====
    modalTitle: 'Cihaz Bağlama',
    modalSubtitle: 'LAN Paylaşımı',
    modalDesc: 'Cihazınızın Wi-Fi ayarlarında <strong>Proxy</strong> kısmını <strong>Manuel</strong> yapın ve bilgileri girin.',
    modalDescPac: 'Diğer cihazlarda <strong>Otomatik (PAC)</strong> kullanımı önerilir.',
    modalPacQrHint: 'QR\'ı tarayıp adresi kopyalayın ve telefonunuzun <strong>Wi-Fi → Proxy → Otomatik URL</strong> kısmına yapıştırın.<br><br><span class="text-red-500 font-semibold">⚠ ÖNEMLİ:</span> Bağlantıyı sonlandırdıktan sonra internet sorunu yaşarsanız, Wi-Fi bağlantınızı kapatıp açın.',
    modalPacUrl: 'PAC Adresi (Önerilen)',
    modalManualFallback: 'Alternatif: Manuel proxy',
    modalTabPac: 'Otomatik (PAC)',
    modalTabManual: 'Manuel',
    modalPacStep1Title: '1. Kurulum Rehberini Açın',
    modalPacStep1Desc: 'Kameranızla QR kodu okutarak adım adım anlatım sayfasına gidin.',
    modalPacStep2Title: '2. PAC Adresini Kopyalayın',
    modalPacStep2Desc: 'Rehberde gösterilen "Otomatik URL" alanına bu kodu yapıştırın:',
    modalPacWarningTitle: 'DİKKAT:',
    modalPacWarningDesc: 'beni-iceri-al-DPI kapatıldıktan sonra YouTube vb. uygulamalarda internet sorunu yaşarsanız (eski önbellek nedeniyle), Wi-Fi bağlantısını kapatıp açmanız yeterlidir.',
    modalManualWarningTitle: 'DİKKAT:',
    modalManualWarningDesc: 'beni-iceri-al-DPI kapatıldığında internet bağlantısı tamamen kesilir. İnternete tekrar girmek için cihazınızın Wi-Fi ayarlarından Proxy\'i eski haline (Yok) getirmelisiniz.',
    modalPacQrCaption: 'QR → Kurulum sayfası (tara ve kopyala)',
    modalHost: 'Sunucu (Host)',
    modalPort: 'Port',
    modalTutorial: 'Nasıl Yapılır? (Rehber)',

    // ===== APP.JSX - Admin Modal =====
    adminTitle: 'Yönetici İzni Gerekli',
    adminDesc: 'beni-iceri-al-DPI\'ın düzgün çalışması için yönetici olarak çalıştırılması gereklidir.',
    adminStep: 'Uygulamaya sağ tıklayın → <strong>"Yönetici olarak çalıştır"</strong> seçin',
    adminClose: 'KAPAT',

    // ===== APP.JSX - No Internet =====
    noInternetTitle: 'İnternet Bağlantısı Yok',
    noInternetDesc: 'Lütfen internet bağlantınızı kontrol edin.',
    noInternetRetry: 'Tekrar Dene',

    // ===== APP.JSX - Log Messages =====
    logEngineStarting: (port) => `beni-iceri-al-DPI Motoru başlatılıyor (Port: ${port})...`,
    logDnsUsed: (name, ip) => `Kullanılan DNS: ${name} (${ip})`,
    logDnsDefault: 'DNS: Sistem Varsayılanı',
    logConnected: 'Bağlantı başarılı! Trafik şifreleniyor.',
    logDisconnected: 'Bağlantı kesildi.',
    logProxySet: (port) => `Sistem Proxy ayarlandı: 127.0.0.1:${port}`,
    logProxyCleared: 'Sistem Proxy Temizlendi',
    logEngineStopped: (code) => `beni-iceri-al-DPI motoru beklenmedik şekilde durduruldu (Kod: ${code})`,
    logEngineStartError: (err) => `Motor başlatılamadı: ${err}`,
    logAutoReconnect: 'Otomatik yeniden bağlanma aktif...',
    logReconnecting: (n) => `Yeniden bağlanılıyor... (Deneme ${n}/5)`,
    logReconnectWait: (sec, n) => `${sec} saniye sonra yeniden denenecek... (Deneme ${n}/5)`,
    logReconnectNow: 'Yeniden bağlanılıyor...',
    logMaxRetries: 'Bağlantı kurulamadı. Maksimum deneme sayısına ulaşıldı.',
    logPossibleReasons: 'Olası sebepler:',
    logReasonInternet: 'İnternet bağlantınız kesilmiş olabilir',
    logReasonFirewall: 'Firewall/Antivirüs beni-iceri-al-DPI\'ı engelliyor olabilir',
    logReasonPorts: '8080-8084 portları sistem tarafından kullanılıyor',
    logSolutions: 'Çözüm önerileri:',
    logSolInternet: 'İnternet bağlantınızı kontrol edin',
    logSolFirewall: 'Firewall ayarlarınızı kontrol edin',
    logSolAdmin: 'Uygulamayı yönetici olarak çalıştırın',
    logSolLogs: 'Logları kopyalayıp destek için paylaşabilirsiniz',
    logLanRestart: 'Yerel ağ paylaşımı değişti, bağlantı yeniden başlatılıyor...',
    logDpiRestart: 'DPI modu değişti, bağlantı yeniden başlatılıyor...',
    logEngineStoppedGrace: 'beni-iceri-al-DPI motoru kapatıldı.',
    logServiceStopped: 'Servis durduruldu.',
    logShutdownStarting: 'Kapatma başlatılıyor...',
    logProcessStopped: 'İşlem sonlandırıldı.',
    logSpoofReady: (port) => `✓ SpoofDPI Motoru başlatıldı (Port: ${port})`,
    logPacStarted: '✓ PAC sunucusu başlatıldı (Yerel ağ cihazları için)',
    logPacStartError: (err) => `PAC sunucusu başlatılamadı: ${err}`,
    logEngineActive: '✓ beni-iceri-al-DPI motoru aktif',
    logPortBusy: (port) => `⚠ Port ${port} dolu, başka port deneniyor...`,
    logInitializing: '⏳ Motor başlatılıyor...',
    logPortRetryOpen: (port) => `Port ${port} açılamadı, yeniden deneniyor...`,
    logProxyClearError: (err) => `Proxy temizleme hatası: ${err}`,
    logProxySetError: (err) => `Proxy ayarlanamadı: ${err}`,
    logServiceStopError: (err) => `Servis durdurma hatası: ${err}`,
    logConfigError: (err) => `Yapılandırma hatası: ${err}`,
    logAdminMissing: 'Yönetici izni eksik! Uygulama düzgün çalışmayabilir.',
    logInternetBack: 'İnternet bağlantısı tekrar sağlandı.',
    logInternetLost: 'İnternet bağlantısı kesildi!',
    logPortRetry: (count) => `Port çakışması, yeni port deneniyor... (${count}/20)`,
    logNoPort: 'Uygun port bulunamadı.',
    logWinHttpEnabled: 'Oyun Modu (WinHTTP) proxy tüneli uygulandı.',
    logWpcapMissing: 'SpoofDPI, wpcap.dll kütüphanesini bulamadı. Lütfen Npcap veya WinPcap kurun ve ardından uygulamayı yeniden başlatın.',
    logAntivirusWarning: 'Windows Defender veya antivirüs yazılımınız \'beni-iceri-al-DPI-proxy.exe\' dosyasını engellemiş olabilir. Lütfen dosyayı antivirüs dışlama listesine (exclusion) ekleyin.',

    // ===== SETTINGS.JSX =====
    settingsTitle: 'AYARLAR',

    // Section: Connection Method
    sectionMethod: 'BAĞLANTI YÖNTEMİ',
    sectionMethodWhy: 'Tek ayar, tüm ISS\'ler. LAN ile tüm cihazlarda kullanın. Proxy tabanlı olduğu için oyunlarda ping/jitter yapmaz.',
    methodStrong: 'Güçlü Mod',
    methodStrongDesc: 'En güçlü bypass, zor ISP\'ler için (latency ekler)',
    methodTurbo: 'Turbo Mod',
    methodTurboDesc: 'En düşük gecikme, hafif DPI için',
    methodBalanced: 'Dengeli Mod (Önerilen)',
    methodBalancedDesc: 'Hızlı + güçlü bypass, çoğu ISP\'de çalışır',

    // Section: Advanced (Güçlü mod)
    sectionAdvanced: 'GELİŞMİŞ',
    chunkSizeLabel: 'Parça boyutu (chunk size)',
    chunkSizeDesc: 'HTTPS trafiğini kaç parçaya böleceğini belirler. ISS\'e göre 4 veya 16 daha hızlı olabilir; 8 çoğu zaman dengeli (varsayılan). Deneyerek en iyisini seçebilirsiniz.',
    chunkSize4: '4 — En güçlü (bazı ISS\'ler)',
    chunkSize8: '8 — Dengeli (varsayılan)',
    chunkSize16: '16 — Daha hızlı (bazı ISS\'ler)',

    // Section: Network
    sectionNetwork: 'AĞ AYARLARI',
    lanSharing: 'Yerel Ağ Paylaşımı',
    lanSharingDesc: 'Diğer cihazlardan (Tel, Konsol) bağlanmaya izin ver',

    // Section: Automation
    sectionAutomation: 'OTOMASYON',
    autoConnect: 'Otomatik Bağlan',
    autoConnectDesc: 'Uygulama açılır açılmaz bağlan',
    autoReconnect: 'Otomatik Yeniden Bağlan',
    autoReconnectDesc: 'Bağlantı koparsa otomatik yeniden dene',

    // Section: General
    sectionGeneral: 'GENEL',
    autoStart: 'Başlangıçta Çalıştır',
    autoStartDesc: 'Windows açılınca beni-iceri-al-DPI\'ı başlat',
    minimizeToTray: 'Tepsiye Küçült',
    minimizeToTrayDesc: 'Kapatıldığında arka planda çalışsın',
    alwaysOnTop: 'Her Şeyin Üzerinde Tut',
    alwaysOnTopDesc: 'Pencere her zaman diğer pencerelerin üzerinde kalır',
    requireConfirmation: 'İşlem Onayı',
    requireConfirmationDesc: 'Bağlantıyı keserken veya çıkarken sor',
    language: 'UYGULAMA DILI',
    languageDesc: 'Arayüz dilini değiştirin',

    // Section: Notifications
    sectionNotifications: 'BİLDİRİMLER',
    notifications: 'Masaüstü Bildirimleri',
    notificationsDesc: 'Ana bildirim anahtarı (Tümünü Aç/Kapat)',
    notifyOnConnect: 'Bağlantı Kurulduğunda',
    notifyOnConnectDesc: 'Bağlantı başarıyla sağlandığında bildir',
    notifyOnDisconnect: 'Bağlantı Koptuğunda',
    notifyOnDisconnectDesc: 'Beklenmedik kopmalarda bildir',
    notifDisconnectManual: 'Bağlantı başarıyla sonlandırıldı.',

    // Section: DNS
    sectionDns: 'DNS LİSTESİ',
    dnsAutoSelect: 'Otomatik Seçim (Önerilen)',
    dnsAutoSelectDesc: 'En hızlı sunucuyu otomatik bulur',
    dnsSystemDefault: 'Sistem Varsayılanı',
    dnsSystemDefaultDesc: 'SpoofDPI Varsayılan DNS',
    dnsCfDesc: 'Hızlı ve Gizli',
    dnsAdguardDesc: 'Reklam Engelleyici',
    dnsGoogleDesc: 'Güvenilir',
    dnsQuad9Desc: 'Güvenlik Odaklı',
    dnsOpenDnsDesc: 'Cisco Güvencesi',
    dnsCheckSpeed: 'DNS Ping Test',
    dnsChecking: 'Ölçülüyor...',

    // Section: Driver
    driverStatusInstalled: 'Gelişmiş Filtreleme Aktif',
    driverStatusMissing: 'Bypass çalışmazsa gelişmiş özellikleri açın',
    driverInstallBtn: 'SÜRÜCÜYÜ KUR (ÖNERİLEN)',
    driverIspWarning: 'Eğer bağlantı sorunu yaşıyorsanız, sürücü yükleyerek çok daha gelişmiş DPI aşma özelliklerini açabilirsiniz.',

    // ISS Overlay (İlk Giriş)
    issOverlayTitle: 'İnternet Sağlayıcınızı Seçin',
    issOverlayDesc: 'En iyi performans için sağlayıcınıza özel ayarları otomatik uygulayalım.',
    issOverlayApply: 'UYGULA VE BAĞLAN',
    issOverlaySkip: 'Atla',
    issProfileActive: 'Profil Aktif',
    issProfileSee: 'Tavsiye edilen ayarı gör',
    issApplyBtn: 'Ayarları Otomatik Uygula',
    issAppliedMsg: 'Bu ayar şu an kullanılıyor',

    // ISS Rehberi (Settings)
    issGuideTitle: 'İNTERNET SAĞLAYICI REHBERİ',
    issLightName: 'TurkNet',
    issLightDesc: 'Hafif filtreleme yaparlar. Turbo Mod sayesinde oyunlarda ping artışı veya hız kaybı yaşamazsınız.',
    issMidName: 'Sadece Bazı ISSler',
    issMidDesc: 'Standart engellemeler yaparlar. Güçlü Mod ile paketleri bölerek sorunsuz erişim sağlar.',
    issHeavyName: 'Türk Telekom / Vodafone / Kablonet / Superonline / Milenicom',
    issHeavyDesc: 'Zorlu ve akıllı DPI cihazları kullanırlar. Sisteme sahte paketler göndererek kandıran Güçlü Mod gerektirebilir.',
    issOtherName: 'Diğer / Bilmiyorum',
    issOtherDesc: 'Güçlü Mod ile başlar. Çoğu sağlayıcıda sorunsuz çalışır, gerekirse Turbo Mod\'a geçebilirsiniz.',

    // Bypass Ayarları
    sectionBypass: 'DETAYLI BYPASS AYARLARI',
    modeTurboName: 'Turbo Mod',
    modeTurboDesc: 'En düşük gecikme. Hafif filtreleri anında aşar.',
    modeBalancedName: 'Dengeli Mod',
    modeBalancedDesc: 'Hızlı ve stabil. Standart filtreleri aşar.',
    modeStrongName: 'Güçlü Mod',
    modeStrongDesc: 'Zorlu DPI\'ları sahte paketlerle kandırır.',

    // Ekstra Ağ
    sectionExtraNetwork: 'EKSTRA AĞ AYARLARI',
    ipv4ForceTitle: 'IPv4\'e Zorla (Önerilen)',
    ipv4ForceDesc: 'Sonsuz yükleme ve Zaman Aşımı (Timeout) hatalarını engeller.',
    winHttpForceTitle: 'Oyun Modu (WinHTTP Proxy)',
    winHttpForceDesc: 'C++ ile yazılmış masaüstü oyunların ve servislerin arka planda DPI engelini aşmasını sağlar.',

    // Gelişmiş (Npcap)
    sectionAdvancedNpcap: 'GELİŞMİŞ AYARLAR',
    advancedNpcapDesc: 'Ağır DPI önlemleri olan sağlayıcılar için (Kablonet, Superonline vb.) gelişmiş paket manipülasyonu gerektirir.',
    advancedNpcapInstalled: 'Npcap Kurulu — Gelişmiş özellikler aktif',
    advancedNpcapMissing: 'Npcap kurulu değil — Güçlü mod kısıtlı çalışır',
    advancedNpcapInstallBtn: 'NPCAP SÜRÜCÜSÜNÜ KUR',
    advancedNpcapWhy: 'Npcap, ağ paketlerine düşük seviyede erişim sağlar. Bu sayede sahte paket (fake packet) gönderme gibi gelişmiş DPI aşma teknikleri kullanılabilir.',
    advancedFeaturesToggle: 'Gelişmiş Bypass',
    advancedFeaturesToggleDesc: 'Sahte paket gönderme ve gelişmiş DPI aşma tekniklerini aktif eder.',
    npcapRestartWarning: 'Npcap\'in çalışabilmesi için bilgisayarınızı yeniden başlatmanız gerekiyor.',
    logStrongFake: '🚀 Güçlü Mod: Fake Paket (3) aktif.',
    logStrongNoDriver: '⚠️ Güçlü Mod: Sürücü yok, sadece Chunk-1 aktif.',
    logStrongChunkOnly: '🛡️ Güçlü Mod: Chunk-1 aktif.',
    logNpcapFallback: '⚠️ Npcap sürücüsü yanıt vermiyor. Gelişmiş bypass kapatılıp tekrar deneniyor...',
    advancedNpcapHint: 'Daha güçlü bypass için Npcap sürücüsünü kurun',


    // Section: Troubleshooting
    sectionTroubleshoot: 'SORUN GİDERME',
    fixInternet: 'İnternet Bağlantısını Onar',
    fixInternetDesc: 'Proxy takılı kalırsa interneti otomatik düzeltir.',
    fixRepairing: 'Onarılıyor...',
    fixRepairingDesc: 'Sistem ayarları sıfırlanıyor, lütfen bekleyin.',
    fixDone: 'Onarıldı!',
    fixDoneDesc: 'Proxy ayarları temizlendi ve internet onarıldı.',
    fixError: 'Hata Oluştu!',
    fixErrorDesc: 'İşlem sırasında bir sorun meydana geldi.',

    // Section: Developer
    sectionDev: 'GELİŞTİRİCİ',
    devRole: 'beni-iceri-al-DPI Geliştiricisi',
    devSubscribe: 'Abone Ol',
    devSupport: 'Destekle',

    // Section: Important Notice
    sectionNotice: 'ÖNEMLİ BİLGİ',
    noticeTitle: 'Güvenlik ve Yanlış Pozitif',
    noticeDesc: 'beni-iceri-al-DPI motoru, Windows Defender AI gibi yapay zeka tabanlı sistemler tarafından bazen "yanlış pozitif" olarak algılanabilir. Bu durum tamamen zararsızdır. Ayrıca Kaspersky, ESET gibi yazılımlar HTTPS tarama özelliğiyle bağlantıyı engelleyebilir. Erişim sorunu yaşarsanız bu ayarları kontrol edin.',

    // Dialogs
    confirmExitTitle: 'Çıkış',
    confirmExitDesc: 'beni-iceri-al-DPI motorunu durdurup çıkmak istediğinize emin misiniz?',
    confirmDisconnectTitle: 'Bağlantıyı Kes',
    confirmDisconnectDesc: 'Güvenli bağlantınızı sonlandırmak istediğinize emin misiniz?',

    // Settings Tabs
    tabGeneral: 'GENEL',
    tabNetwork: 'AĞ',
    tabNotification: 'BİLDİRİM',
    tabSystem: 'SİSTEM',

    // ── Update Check ──
    updateChecking: 'Güncellemeler kontrol ediliyor...',
    updateRequired: 'Güncelleme Mevcut',
    updateDesc: 'Uygulamanın yeni bir sürümü yayınlandı. Kullanmaya devam etmek için lütfen güncelleyin.',
    updateCurrent: 'Mevcut Sürüm',
    updateLatest: 'Yeni Sürüm',
    updateDownload: 'GÜNCELLEMEYİ İNDİR & KUR',
    updateDownloading: 'Güncelleme indiriliyor...',
    updateInstalling: 'Güncelleme kuruluyor, uygulama yeniden başlatılıyor...',
    updateSkip: 'Şimdi Değil',
    updateError: 'Güncelleme kontrol edilemedi (çevrimdışı olabilirsiniz)',
  },
};

// Aktif dili getiren hook/fonksiyon
export const getTranslations = (lang = 'tr') => {
  return translations[lang] || translations.tr;
};

export default translations;
