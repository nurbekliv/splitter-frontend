import type { TFunction } from 'i18next';
import { formatMoney } from './share-summary';

export type PrintPerson = { username: string; amount: number };
export type PrintItem = { name: string; total: number; allocations: PrintPerson[] };

type BuildPrintHtmlParams = {
  t: TFunction;
  language: string;
  sessionName?: string;
  currency: string;
  grandTotal: number;
  createdAt?: string;
  people: PrintPerson[];
  items: PrintItem[];
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string
  );

/**
 * A printable A4 page with the bill result. In the browser the user saves it
 * with "Save as PDF" in the print dialog.
 */
export function buildPrintHtml({
  t,
  language,
  sessionName,
  currency,
  grandTotal,
  createdAt,
  people,
  items,
}: BuildPrintHtmlParams): string {
  const money = (n: number) => escapeHtml(formatMoney(n, currency));
  const date = new Date(createdAt ?? Date.now()).toLocaleString(language);

  const peopleRows = people
    .map((p) => `<tr><td>${escapeHtml(p.username)}</td><td class="num">${money(p.amount)}</td></tr>`)
    .join('');

  const itemRows = items
    .map((item) => {
      const breakdown = item.allocations
        .map((a) => `${escapeHtml(a.username)} ${money(a.amount)}`)
        .join('<br>');
      return `<tr><td>${escapeHtml(item.name)}</td><td class="num">${money(item.total)}</td><td class="small">${breakdown}</td></tr>`;
    })
    .join('');

  const title = escapeHtml(t('sessions.finish.title'));

  return `<!doctype html>
<html lang="${escapeHtml(language)}">
<head>
<meta charset="utf-8">
<title>${title}${sessionName ? ' — ' + escapeHtml(sessionName) : ''}</title>
<style>
  @page { size: A4; margin: 18mm; }
  @media screen { body { padding: 32px; max-width: 760px; margin: 0 auto !important; } }
  body { font-family: "Noto Sans JP", "Hiragino Sans", "Yu Gothic", Arial, sans-serif; color: #1E2A35; margin: 0; }
  .brand { color: #1B7F47; font-weight: 700; letter-spacing: 1px; font-size: 12px; }
  h1 { font-size: 26px; margin: 4px 0 2px; }
  .meta { color: #4A5568; font-size: 13px; margin-bottom: 18px; }
  .total { border: 2px solid #2ECC71; background: #E9F6EF; border-radius: 10px; padding: 12px 16px; margin-bottom: 22px; }
  .total .label { font-size: 13px; color: #4A5568; }
  .total .value { font-size: 28px; font-weight: 700; color: #1B7F47; }
  h2 { font-size: 15px; margin: 20px 0 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; background: #F1F4F2; padding: 7px 8px; border-bottom: 1px solid #C9D3CE; }
  td { padding: 7px 8px; border-bottom: 1px solid #E3E8E5; vertical-align: top; }
  .num { text-align: right; white-space: nowrap; }
  .small { color: #4A5568; font-size: 12px; }
  .footer { margin-top: 28px; color: #8A949E; font-size: 11px; text-align: center; }
</style>
</head>
<body>
  <div class="brand">RECEIPT SPLITTER</div>
  <h1>${title}</h1>
  <div class="meta">${sessionName ? escapeHtml(sessionName) + ' · ' : ''}${escapeHtml(date)}</div>
  <div class="total">
    <div class="label">${escapeHtml(t('sessions.finish.totalAmount'))}</div>
    <div class="value">${money(grandTotal)}</div>
  </div>
  <h2>${escapeHtml(t('sessions.finish.byParticipant'))}</h2>
  <table>
    <tr><th>${escapeHtml(t('sessions.finish.pdfName'))}</th><th class="num">${escapeHtml(t('sessions.finish.pdfAmount'))}</th></tr>
    ${peopleRows}
  </table>
  ${
    items.length > 0
      ? `<h2>${escapeHtml(t('sessions.finish.byItem'))}</h2>
  <table>
    <tr><th>${escapeHtml(t('sessions.finish.pdfItem'))}</th><th class="num">${escapeHtml(t('sessions.finish.pdfAmount'))}</th><th>${escapeHtml(t('sessions.finish.pdfBreakdown'))}</th></tr>
    ${itemRows}
  </table>`
      : ''
  }
  <div class="footer">${escapeHtml(t('sessions.finish.shareFooter'))}</div>
</body>
</html>`;
}

/**
 * Opens the page in a new browser window and shows the print dialog
 * (the user picks "Save as PDF"). Returns false if a pop-up blocker stopped it.
 */
export function printHtmlInBrowser(html: string): boolean {
  if (typeof window === 'undefined') return false;
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
  return true;
}
