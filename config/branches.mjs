/**
 * Branch manifest — the version-controlled, declarative record of every
 * Branch-specific value.
 *
 * This file is DATA. It is the single source of truth that the BranchResolver
 * turns into an immutable ResolvedBranch. Adding a Branch is a new entry here
 * plus `provision`/`deploy`; no code change.
 *
 * Values migrated from config/deployment.mjs, studio/sanity.cli.js,
 * wrangler.toml and wrangler.qld.toml. No secrets live here: the fields below
 * are public operational identifiers and presentation data.
 *
 * See docs/sparc/branch-agnostic/algorithm_specification.md §1 and
 * architecture_blueprint.md §4.2.
 */

/** @type {import('./branch/contract.mjs').BranchManifest} */
export const branchManifest = {
  schemaVersion: 1,
  defaultBranch: 'vic',

  tokenContract: {
    requiredRoles: [
      'primary',
      'primary-dark',
      'on-primary',
      'secondary',
      'on-secondary',
      'surface-base',
      'surface-raised',
      'fg',
      'muted',
      'line',
      'focus',
    ],
    kinds: {
      primary: 'color',
      'primary-dark': 'color',
      'on-primary': 'color',
      secondary: 'color',
      'on-secondary': 'color',
      'surface-base': 'color',
      'surface-raised': 'color',
      fg: 'color',
      muted: 'color',
      line: 'color',
      focus: 'color',
    },
  },

  branches: {
    vic: {
      identity: {
        slug: 'vic',
        state: 'Victoria',
        adjective: 'Victorian',
        label: 'Fusion Party Victoria',
        tagline: 'Reignite Democracy',
        themeColor: '#D428D4',
        siteUrl: 'https://vic.fusionparty.org.au',
        allowedOrigins: ['https://vic.fusionparty.org.au'],
      },
      sanity: {
        projectId: 'qwl3f8jb',
        dataset: 'production',
        studioAppId: 'b1vkw1bmcrkhlb4no5vyzdlg',
      },
      theme: {
        slug: 'vic',
        tokens: {
          primary: '#D428D4',
          'primary-dark': '#A81EA8',
          'on-primary': '#FFFFFF',
          secondary: '#3CE0C0',
          'on-secondary': '#0B0B0B',
          'surface-base': '#0B0B0B',
          'surface-raised': '#161616',
          fg: '#FFFFFF',
          muted: 'rgba(255, 255, 255, 0.72)',
          line: '#333333',
          focus: '#D428D4',
        },
      },
      assets: {
        ogDefault: '/og/default.png',
        hero: '/hero.png',
        favicon: '/favicon.svg',
        pwaManifest: '/manifest.json',
        logo: '/logo-rings-color.png',
        ogTemplate: '/og/default.png',
      },
      analytics: {
        siteId: 'pa-HF_gBIYZhzFUGLXpsvgWh',
      },
      deploy: {
        workerName: 'fusion-website',
        wranglerConfig: 'wrangler.toml',
        kvNamespaces: [{ binding: 'NATIONBUILDER_TOKENS', id: '4be5b5fc9edc49f3bd5a2c040483da0e' }],
        compatibilityFlags: ['nodejs_compat'],
        compatibilityDate: '2025-01-29',
        cacheVersion: '1',
      },
      runtime: {
        contentProfile: 'victoria-campaign',
        socialAccounts: [
          { platform: 'Facebook', url: 'https://www.facebook.com/FusionPartyAus' },
          { platform: 'Instagram', url: 'https://www.instagram.com/fusionpartyaus' },
          { platform: 'YouTube', url: 'https://www.youtube.com/c/fusionpartyaus' },
          { platform: 'Mastodon', url: 'https://mastodon.au/@FusionPartyAus' },
        ],
        policyCallouts: { housing: true, transportScore: true },
        navigation: {
          fallback: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Policies', href: '/policies' },
            { label: 'Vision', href: '/vision' },
            { label: 'Research', href: '/research' },
          ],
          cta: { label: 'Get involved', href: '/get-involved' },
        },
        contact: {
          email: 'contact@fusionparty.org.au',
          pressEmail: 'press@fusionparty.org.au',
          helloEmail: 'hello@fusionparty.org.au',
          preselectionEmail: 'preselection@fusionparty.org.au',
          techEmail: 'tech@fusionparty.org.au',
          discord: 'https://www.fusionparty.org.au/discord',
          phone: '0410 249 574',
          address: '254 McLeod Lane\nMansfield VIC 3722\nAustralia',
        },
        analytics: {
          plausibleScriptUrl: 'https://analytics.fusionparty.org.au/js/pa-HF_gBIYZhzFUGLXpsvgWh.js',
        },
        seo: {
          nationalOrganizationUrl: 'https://fusionparty.org.au/#organization',
          logoPath: '/logo-rings-color.png',
          defaultOgImage: '/og/default.png',
        },
        cta: {
          getInvolved: '/get-involved',
          donate: '/get-involved#donate',
          donateNational: 'https://fusionparty.org.au/donate',
          contact: '/contact',
          costings: '/costings',
          electorates: '/electorate',
          transportScore: 'https://transportscore.fusionparty.org.au',
        },
        footer: {
          networkBrandingUrl: 'https://www.fusionparty.org.au',
          newsletterEndpoint: '/api/newsletter',
        },
      },
    },

    qld: {
      identity: {
        slug: 'qld',
        state: 'Queensland',
        adjective: 'Queensland',
        label: 'Fusion Party Queensland',
        tagline: 'A better future for Queensland',
        themeColor: '#731E32',
        siteUrl: 'https://qld.fusionparty.org.au',
        allowedOrigins: ['https://qld.fusionparty.org.au'],
      },
      sanity: {
        projectId: 'qwl3f8jb',
        dataset: 'qld',
        studioAppId: 'pctplpfvvxwavjm1erscuknz',
        allowSharedProject: true,
      },
      theme: {
        slug: 'qld',
        tokens: {
          primary: '#731E32',
          'primary-dark': '#5E1628',
          'on-primary': '#FFF7EC',
          secondary: '#233D3A',
          'on-secondary': '#FFF7EC',
          'surface-base': '#FFF7EC',
          'surface-raised': '#FFFDF8',
          fg: '#233D3A',
          muted: 'rgba(35, 61, 58, 0.72)',
          line: '#E5DCCB',
          focus: '#233D3A',
        },
      },
      assets: {
        ogDefault: '/og/qld-default.png',
        hero: '/solo-full-colour.svg',
        favicon: '/favicon.svg',
        pwaManifest: '/manifest.qld.json',
        logo: '/logo-rings-color.png',
        ogTemplate: '/og/qld-default.png',
      },
      analytics: {
        enabled: true,
        siteId: 'pa-6TB7kWpUyzQNp_ONfw6M_',
      },
      deploy: {
        workerName: 'fusion-website-qld',
        wranglerConfig: 'wrangler.qld.toml',
        kvNamespaces: [{ binding: 'SESSION', id: '0771f9c48b4840bebd5091051a7bbec8' }],
        compatibilityFlags: ['nodejs_compat'],
        compatibilityDate: '2025-01-29',
        cacheVersion: '1',
      },
      runtime: {
        contentProfile: 'branch-neutral',
        features: { investigations: true },
        socialAccounts: [],
        navigation: {
          fallback: [
            { label: 'Home', href: '/' },
            { label: 'Issues we're investigating', href: '/investigations' },
            { label: 'Policies', href: '/policies' },
            { label: 'Contact', href: '/contact' },
          ],
          cta: { label: 'Get involved', href: '/contact' },
        },
        contact: {
          email: 'contact@fusionparty.org.au',
          pressEmail: 'press@fusionparty.org.au',
          helloEmail: 'hello@fusionparty.org.au',
          preselectionEmail: 'preselection@fusionparty.org.au',
          techEmail: 'tech@fusionparty.org.au',
          discord: 'https://www.fusionparty.org.au/discord',
        },
        analytics: {},
        seo: {
          nationalOrganizationUrl: 'https://fusionparty.org.au/#organization',
          logoPath: '/logo-rings-color.png',
          defaultOgImage: '/og/qld-default.png',
        },
        cta: {
          getInvolved: '/contact',
          donate: 'https://fusionparty.org.au/donate',
          donateNational: 'https://fusionparty.org.au/donate',
          contact: '/contact',
          electorates: '/electorates',
        },
        footer: {
          networkBrandingUrl: 'https://www.fusionparty.org.au',
          newsletterEndpoint: '/api/newsletter',
        },
      },
    },
  },
}

export const branches = branchManifest.branches

export default branchManifest
