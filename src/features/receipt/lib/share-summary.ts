import type { TFunction } from 'i18next';

export type ShareLine = { username: string; amount: number };

export const formatMoney = (amount: number, currency: string) =>
  `${currency} ${Math.round(amount).toLocaleString('en-US')}`;

type BuildShareSummaryParams = {
  t: TFunction;
  sessionName?: string;
  currency: string;
  grandTotal: number;
  lines: ShareLine[];
};

/**
 * Builds a plain-text bill summary that can be pasted into any messenger
 * (LINE, Telegram, etc.). The text follows the current app language.
 */
export function buildShareSummary({
  t,
  sessionName,
  currency,
  grandTotal,
  lines,
}: BuildShareSummaryParams): string {
  const header = sessionName
    ? t('sessions.finish.shareHeader', { name: sessionName })
    : t('sessions.finish.shareHeaderNoName');

  const participantLines = lines.map(
    (line) => `・${line.username}: ${formatMoney(line.amount, currency)}`
  );

  return [
    header,
    t('sessions.finish.shareTotal', { amount: formatMoney(grandTotal, currency) }),
    '',
    ...participantLines,
    '',
    t('sessions.finish.shareFooter'),
  ].join('\n');
}
