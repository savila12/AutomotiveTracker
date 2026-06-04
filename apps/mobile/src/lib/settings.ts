type AlertFn = (title: string, message: string) => void;

type OpenLegalUrlParams = {
  url: string | null;
  label: string;
  openUrl: (url: string) => Promise<unknown>;
  alert: AlertFn;
};

export const openLegalUrl = async ({ url, label, openUrl, alert }: OpenLegalUrlParams) => {
  if (!url) {
    alert(`${label} unavailable`, 'This link is not configured yet.');
    return;
  }

  try {
    await openUrl(url);
  } catch {
    alert('Could not open link', 'Please try again.');
  }
};
