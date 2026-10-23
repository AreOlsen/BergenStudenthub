import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.GITHUB_PAGES === 'true' ? '/BergenStudentweb' : ''
    }
  }
};

export default config;
