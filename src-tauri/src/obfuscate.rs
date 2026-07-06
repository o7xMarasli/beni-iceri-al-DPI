// ═══════════════════════════════════════════════════════════════════
// obfuscate.rs — XOR string obfuscation
//
// Tüm hassas stringler binary'de legit string table'da görünmez.
// ═══════════════════════════════════════════════════════════════════

pub const KEY: u8 = 0xA7;

/// XOR ile şifrelenmiş stringi çözer.
#[inline(never)]
pub fn reveal(data: &[u8]) -> String {
    String::from_utf8(data.iter().map(|&b| b ^ KEY).collect()).unwrap_or_default()
}

/// Compile-time XOR ile string karartma
///
/// ```
/// let s = reveal(obf!("https://..."));
/// ```
#[macro_export]
macro_rules! obf {
    ($s:literal) => {{
        const INPUT: &str = $s;
        const LEN: usize = INPUT.len();
        const OBF: [u8; LEN] = {
            let bytes = INPUT.as_bytes();
            let mut r = [0u8; LEN];
            let mut i = 0;
            while i < LEN {
                r[i] = bytes[i] ^ 0xA7;
                i += 1;
            }
            r
        };
        &OBF[..]
    }};
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_roundtrip() {
        let original = "https://api.github.com/...";
        let obfuscated = obf!(original);
        let revealed = reveal(obfuscated);
        assert_eq!(original, revealed);
    }

    #[test]
    fn test_empty() {
        let obfuscated = obf!("");
        let revealed = reveal(obfuscated);
        assert_eq!("", revealed);
    }
}
