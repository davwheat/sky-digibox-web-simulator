const prodPlugins =
  process.env.NODE_ENV === 'production'
    ? [
        `gatsby-plugin-preact`,
        {
          resolve: 'gatsby-plugin-remove-console',
          options: {
            exclude: ['error', 'warn'], // <- will be removed all console calls except these
          },
        },
      ]
    : []

module.exports = {
  flags: {
    // PRESERVE_WEBPACK_CACHE: true,
    // FAST_DEV: true,
    // PRESERVE_FILE_DOWNLOAD_CACHE: true,
    // DEV_SSR: false,
  },
  siteMetadata: {
    title: 'Sky Digibox Simulator',
    description: 'A web simulation of the old Sky Digibox electronic programme guide (EPG).',
    author: `@davwheat`,
    siteUrl: `https://sky-epg.davwheat.dev`,
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-typescript-checker',
    'gatsby-plugin-sitemap',
    `gatsby-plugin-layout`,
    `gatsby-plugin-less`,
    `gatsby-plugin-react-head`,
    `gatsby-plugin-material-ui`,
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/images/sky-logo-transparent.png',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    ...prodPlugins,
  ],
}
