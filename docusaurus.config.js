// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Shazoe",
  tagline: "Trusted Blockhain Validator",
  favicon: "img/shazoes.ico",

  // Set the production url of your site here
  url: "https://services.shazoe.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Shazoe", // Usually your GitHub org/user name.
  projectName: "Shazoe", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: "./sidebars.js",
          routeBasePath: "yay",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: false,
        // {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "mainnets",
        path: "mainnets",
        routeBasePath: "mainnets",
        sidebarPath: require.resolve("./sidebarsMainnets.js"),
        // ... other options
      },
      // {
      //   id: 'testnets',
      //   path: 'testnets',
      //   routeBasePath: 'testnets',
      //   sidebarPath: require.resolve('./sidebarsTestnets.js'),
      //   // ... other options
      // },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "testnets",
        path: "testnets",
        routeBasePath: "testnets",
        sidebarPath: require.resolve("./sidebarsTestnets.js"),
        // ... other options
      },
    ],
  ],

  themeConfig:
    // /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Shazoe",
        logo: {
          alt: "Shazoe Logo",
          src: "img/shazoes.ico",
        },
        items: [
          {
            to: "/mainnets",
            position: "left",
            label: "Mainnets",
          },
          { to: "/testnets", label: "Testnets", position: "left" },
          // { to: "/blog", lasbel: "Blog", position: "left" },
          {
            href: "https://explorer.shazoe.xyz",
            label: "Explorer",
            position: "right",
          },
          {
            href: "https://x.com/_Shazoe",
            label: "X",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Networks",
            items: [
              {
                label: "Mainnets",
                to: "mainnets",
              },
              {
                label: "Testnets",
                to: "testnets",
              },
            ],
          },
          {
            title: "Contacts",
            items: [
              {
                label: "Discord",
                href: "http://discordapp.com/users/424422625662468096",
              },
              {
                label: "X",
                href: "https://x.com/_Shazoe",
              },
            ],
          },
          {
            // title: "More",
            items: [
              // {
              //   label: "Blog",
              //   to: "/blog",
              // },
              {
                label: "Explorer",
                href: "https://explorer.shazoe.xyz",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Shazoe`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    },
};

export default config;
