const QR_IMAGE = "/assets/wechat-qr.jpg";
let returnFocus;
let previousOverflow;

function createDialog() {
  const style = document.createElement("style");
  style.textContent = `
    .wechat-qr-dialog {
      box-sizing: border-box;
      width: min(420px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      margin: auto;
      padding: 20px;
      border: 1px solid #e5e5e5;
      border-radius: 20px;
      background: #fff;
      color: #171717;
      box-shadow: 0 24px 80px #0004;
    }
    .wechat-qr-dialog::backdrop { background: #0009; }
    .wechat-qr-header { display: flex; align-items: center; justify-content: space-between; }
    .wechat-qr-title { margin: 0; font-size: 20px; font-weight: 700; }
    .wechat-qr-close {
      display: grid; place-items: center; width: 40px; height: 40px;
      border: 0; border-radius: 50%; background: #f5f5f5; color: inherit;
      cursor: pointer;
    }
    .wechat-qr-close:hover { background: #e5e5e5; }
    .wechat-qr-dialog :focus-visible { outline: 2px solid #07a83b; outline-offset: 3px; }
    .wechat-qr-image {
      display: block; width: auto; height: auto; max-width: 100%;
      max-height: calc(100dvh - 190px); margin: 12px auto;
      object-fit: contain; background: #fff; border-radius: 8px;
    }
    .wechat-qr-footer { margin: 12px 0 0; text-align: center; font-size: 14px; }
    .wechat-qr-footer a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
    .wechat-qr-error { margin: 16px 0; font-size: 14px; }
    .dark .wechat-qr-dialog { background: #171717; color: #f5f5f5; border-color: #404040; }
    .dark .wechat-qr-close { background: #262626; }
    .dark .wechat-qr-close:hover { background: #404040; }
  `;
  document.head.append(style);

  const dialog = document.createElement("dialog");
  dialog.id = "wechat-qr-dialog";
  dialog.className = "wechat-qr-dialog";
  dialog.setAttribute("aria-labelledby", "wechat-qr-title");
  dialog.innerHTML = `
    <div class="wechat-qr-header">
      <h2 id="wechat-qr-title" class="wechat-qr-title">WeChat</h2>
      <button type="button" class="wechat-qr-close" aria-label="Close WeChat QR code" autofocus>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="m6 6 12 12M6 18 18 6"/>
        </svg>
      </button>
    </div>
    <img class="wechat-qr-image" src="${QR_IMAGE}" width="888" height="1191" alt="WeChat QR code for KeyCharon — scan to add Zhe Li"/>
    <p class="wechat-qr-error" hidden>The image could not load. Please try opening the original image below.</p>
    <p class="wechat-qr-footer"><a href="${QR_IMAGE}" target="_blank" rel="noopener noreferrer">Open original image</a></p>
  `;
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.querySelector("img").addEventListener("error", () => {
    dialog.querySelector(".wechat-qr-error").hidden = false;
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const first = dialog.querySelector("button");
    const last = dialog.querySelector("a");
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    document.documentElement.style.overflow = previousOverflow;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  document.body.append(dialog);
  return dialog;
}

export function openWeChatQr(opener) {
  const dialog = document.getElementById("wechat-qr-dialog") || createDialog();
  if (dialog.open) return;
  returnFocus = opener || document.activeElement;
  previousOverflow = document.documentElement.style.overflow;
  dialog.showModal();
  document.documentElement.style.overflow = "hidden";
}
