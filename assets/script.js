/**
 * امیرمهدی عسکری | توابع تعاملی جاوااسکریپت وب‌سایت
 * Interactive JavaScript Utilities (Theme, Clipboard, Digits, Validation, Shortcuts)
 */

const STORAGE_THEME_KEY = 'amirmahdi_theme_preference';

/**
 * تبدیل اعداد انگلیسی به ارقام استاندارد فارسی
 * @param {number | string} input
 * @returns {string}
 */
export function toPersianDigits(input) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/\d/g, (digit) => persianNumbers[Number(digit)]);
}

/**
 * خواندن وضعیت ذخیره شده تم (تاریک یا روشن)
 * @returns {boolean} true = dark, false = light
 */
export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
  } catch {
    // Fallback to dark obsidian theme if storage is restricted
  }
  return true;
}

/**
 * اعمال کلاس تم تاریک/روشن روی تگ html و ذخیره در مرورگر
 * @param {boolean} isDark
 */
export function applyTheme(isDark) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem(STORAGE_THEME_KEY, isDark ? 'dark' : 'light');
  } catch {
    // Ignore storage write errors in private frames
  }
}

/**
 * کپی ایمن متن (شناسه پیام‌رسان یا پرامپت) در کلیپ‌بورد
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * اعتبارسنجی فرم ارسال پیام مستقیم
 * @param {{ name: string, contactId: string, message: string }} fields
 * @returns {{ valid: boolean, error: string }}
 */
export function validateContactForm({ name, contactId, message }) {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'لطفاً نام خود را به صورت کامل وارد کنید.' };
  }

  const trimmedId = (contactId || '').trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId);
  const isHandle = /^@?[a-zA-Z0-9_]{3,}$/.test(trimmedId);

  if (!isEmail && !isHandle) {
    return {
      valid: false,
      error: 'لطفاً یک ایمیل معتبر یا آیدی پیام‌رسان (مثال: @username) وارد کنید.',
    };
  }

  if (!message || message.trim().length < 10) {
    return { valid: false, error: 'متن پیام باید حداقل ۱۰ کاراکتر باشد.' };
  }

  return { valid: true, error: '' };
}

/**
 * اسکرول نرم به بالای صفحه هنگام جابه‌جایی بین بخش‌ها
 */
export function scrollToTopSmooth() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * ثبت میانبر کیبورد (Ctrl+K یا Cmd+K) برای باز کردن جستجوی سریع
 * @param {() => void} onTrigger
 * @returns {() => void} cleanup function
 */
export function registerSearchShortcut(onTrigger) {
  const handler = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      onTrigger();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
