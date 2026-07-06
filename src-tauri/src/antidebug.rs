// ═══════════════════════════════════════════════════════════════════
// antidebug.rs — Reverse engineering & debugger detection
//
// Sadece RELEASE build'de aktif (windows, NOT debug).
#![allow(unused_imports)]
// ═══════════════════════════════════════════════════════════════════

#[cfg(all(windows, not(debug_assertions)))]
mod win_debug {
    use winapi::um::debugapi::IsDebuggerPresent;
    use winapi::um::processthreadsapi::GetCurrentProcess;
    use winapi::shared::minwindef::{DWORD, LPDWORD, LPVOID};
    use winapi::um::libloaderapi::{GetModuleHandleA, GetProcAddress};
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::time::Instant;

    const ProcessDebugPort: u32 = 7;
    const ProcessDebugFlags: u32 = 0x1f;
    const ThreadHideFromDebugger: u32 = 0x11;

    type NtQIP = unsafe extern "system" fn(HANDLE, u32, LPVOID, DWORD, LPDWORD) -> i32;
    type NtSIT = unsafe extern "system" fn(HANDLE, u32, LPVOID, DWORD) -> i32;

    use winapi::um::winnt::HANDLE;

    static FLAGGED: AtomicBool = AtomicBool::new(false);

    /// Ntdll'den fonksiyon resolve et — import table'da görünmez
    unsafe fn resolve_nt(func_name: &[u8]) -> Option<*mut ()> {
        let module = GetModuleHandleA("ntdll.dll\0".as_ptr() as *const i8);
        if module.is_null() {
            return None;
        }
        let addr = GetProcAddress(module, func_name.as_ptr() as *const i8);
        if addr.is_null() { None } else { Some(addr as *mut ()) }
    }

    fn check_peb() -> bool {
        unsafe { IsDebuggerPresent() != 0 }
    }

    fn check_debug_port() -> bool {
        unsafe {
            let ntqip = match resolve_nt(b"NtQueryInformationProcess\0") {
                Some(p) => std::mem::transmute::<*mut (), NtQIP>(p),
                None => return false,
            };
            let mut port: DWORD = 0;
            let mut ret_len: DWORD = 0;
            let status = ntqip(
                GetCurrentProcess(),
                ProcessDebugPort,
                &mut port as *mut _ as LPVOID,
                std::mem::size_of::<DWORD>() as DWORD,
                &mut ret_len,
            );
            status == 0 && port != 0 && port != DWORD::MAX
        }
    }

    fn check_debug_flags() -> bool {
        unsafe {
            let ntqip = match resolve_nt(b"NtQueryInformationProcess\0") {
                Some(p) => std::mem::transmute::<*mut (), NtQIP>(p),
                None => return false,
            };
            let mut flags: DWORD = 0;
            let mut ret_len: DWORD = 0;
            let status = ntqip(
                GetCurrentProcess(),
                ProcessDebugFlags,
                &mut flags as *mut _ as LPVOID,
                std::mem::size_of::<DWORD>() as DWORD,
                &mut ret_len,
            );
            status == 0 && flags == 0
        }
    }

    fn check_timing() -> bool {
        // ✅ BUG-3 FIX: Eşik 2ms → 10ms yükseltildi.
        // Yüklü / eski donanımlı makinelerde 2ms eşiği CPU spike sırasında aşılıp
        // uygulama sebepsiz kapanabiliyordu (false-positive). Ayrıca tek bir hit
        // yeterli sayılmaz — ardışık 3 başarısız ölçüm gerekiyor.
        const THRESHOLD_NS: u128 = 10_000_000; // 10ms
        let mut hit_count = 0u32;
        for _ in 0..5 {
            let start = Instant::now();
            for _ in 0..10_000 {
                std::hint::spin_loop();
            }
            if start.elapsed().as_nanos() > THRESHOLD_NS {
                hit_count += 1;
                if hit_count >= 3 {
                    return true;
                }
            }
        }
        false
    }

    fn hide_from_debugger() -> bool {
        unsafe {
            let ntsit = match resolve_nt(b"NtSetInformationThread\0") {
                Some(p) => std::mem::transmute::<*mut (), NtSIT>(p),
                None => return false,
            };
            let status = ntsit(-2isize as HANDLE, ThreadHideFromDebugger, std::ptr::null_mut(), 0);
            status != 0
        }
    }

    pub fn full_scan() -> bool {
        if FLAGGED.load(Ordering::Relaxed) {
            return true;
        }
        if check_peb() || check_debug_port() || check_debug_flags() || check_timing() {
            FLAGGED.store(true, Ordering::Relaxed);
            return true;
        }
        if hide_from_debugger() {
            FLAGGED.store(true, Ordering::Relaxed);
            return true;
        }
        false
    }

    pub fn exit_on_debugger() -> ! {
        std::process::exit(1);
    }
}

/// Public API — çok katmanlı anti-debug başlat
#[cfg(all(windows, not(debug_assertions)))]
pub fn run_detection() {
    if win_debug::full_scan() {
        win_debug::exit_on_debugger();
    }
    // Gecikmeli ikinci tarama (anti-anti-debug)
    std::thread::spawn(|| {
        std::thread::sleep(std::time::Duration::from_secs(5));
        if win_debug::full_scan() {
            std::process::exit(1);
        }
    });
}

#[cfg(not(all(windows, not(debug_assertions))))]
pub fn run_detection() {
    // debug build / non-windows: pasif
}
