export const AppR = {
  root: '/',
  dashboard: {
    full: '/dashboard',
    simple: 'dashboard',
  },
  settings: {
    full: '/settings',
    simple: 'settings',
  },
  profile: {
    full: '/profile',
    simple: 'profile',
  },
  reader: {
    stories: {
      list: {
        full: '/reader/stories',
        simple: 'reader/stories',
      },
      details: {
        simple: ':id',
      },
    },
    collections: {
      list: {
        full: '/reader/collections',
        simple: 'reader/collections',
      },
      details: {
        simple: ':id',
      },
    },
    tags: {
      list: {
        full: '/reader/tags',
        simple: 'reader/tags',
      },
    },
  },
  writer: {
    list: {
      full: '/writer/stories',
      simple: 'writer/stories',
    },
    details: {
      simple: ':id',
    },
    collections: {
      list: {
        full: '/writer/collections',
        simple: 'writer/collections',
      },
      details: {
        simple: ':id',
      },
    },
    tags: {
      list: {
        full: '/writer/tags',
        simple: 'writer/tags',
      },
    },
  },
};
