import type { Plugin } from 'vite';

const GOOGLE_TAG_MANAGER_HOSTNAME = 'www.react-query-builder.com';
const GOOGLE_TAG_MANAGER_ID = 'GTM-WPZDH54F';

const GOOGLE_CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  analytics_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});`;

export const createGoogleTagManagerPlugin = (
  siteUrl: string | undefined
): Plugin => {
  let isEnabled = false;

  try {
    isEnabled = new URL(siteUrl ?? '').hostname === GOOGLE_TAG_MANAGER_HOSTNAME;
  } catch {
    // Leave analytics disabled when the deployment URL is absent or invalid.
  }

  return {
    name: 'google-tag-manager',
    transformIndexHtml: {
      order: 'pre',
      handler: () => {
        if (!isEnabled) {
          return [];
        }

        return [
          {
            tag: 'script',
            children: `${GOOGLE_CONSENT_DEFAULT_SCRIPT}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`,
            injectTo: 'head-prepend',
          },
          {
            tag: 'noscript',
            children: [
              {
                tag: 'iframe',
                attrs: {
                  src: `https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`,
                  height: '0',
                  width: '0',
                  style: 'display:none;visibility:hidden',
                },
              },
            ],
            injectTo: 'body-prepend',
          },
        ];
      },
    },
  };
};
