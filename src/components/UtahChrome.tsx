import { setUtahHeaderSettings, type ActionItem, type SettingsInput } from '@utahdts/utah-design-system-header';
import '@utahdts/utah-design-system-header/css';
import { useEffect, useMemo, type PropsWithChildren } from 'react';

const headerTargetSelector = '#utah-header-target';
const footerTargetSelector = '#utah-footer-target';
const ugrcLogo = '/ugrc-logo.svg';
const waffleIcon = '<span class="utds-icon-before-waffle" aria-hidden="true" />';

type UtahChromeProps = PropsWithChildren<{
  version: string;
}>;

const createActionItems = (version: string): ActionItem[] => [
  {
    actionPopupMenu: {
      menuItems: [
        {
          actionUrl: {
            openInNewTab: true,
            url: 'https://gis.utah.gov',
          },
          title: 'UGRC Homepage',
        },
        {
          actionUrl: {
            openInNewTab: true,
            url: 'https://github.com/agrc/atlas',
          },
          title: 'GitHub Repository',
        },
        {
          actionUrl: {
            openInNewTab: true,
            url: `https://github.com/agrc/atlas/releases/v${version}`,
          },
          title: `Version ${version} changelog`,
        },
        {
          actionUrl: {
            url: '/ThirdPartyNotices.txt',
          },
          title: 'Third-party notices',
        },
      ],
      title: 'Atlas resources',
    },
    icon: waffleIcon,
    showTitle: false,
    title: 'Resources',
  },
];

export function UtahChrome({ children, version }: UtahChromeProps) {
  const headerSettings = useMemo<SettingsInput>(
    () => ({
      actionItems: createActionItems(version),
      applicationType: 'custom application',
      domLocationTarget: {
        cssSelector: headerTargetSelector,
      },
      footer: {
        domLocationTarget: {
          cssSelector: footerTargetSelector,
        },
      },
      logo: {
        imageUrl: ugrcLogo,
      },
      mainMenu: false,
      notifications: false,
      onSearch: false,
      showTitle: true,
      size: 'MEDIUM',
      skipLinkUrl: '#main-content',
      title: 'Atlas Utah',
      titleUrl: '/',
      utahId: false,
    }),
    [version],
  );

  useEffect(() => {
    setUtahHeaderSettings(headerSettings);
  }, [headerSettings]);

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <div id={headerTargetSelector.slice(1)} />
        {children}
      </div>
      <div id={footerTargetSelector.slice(1)} />
    </>
  );
}
