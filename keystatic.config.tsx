import { config, fields, collection } from '@keystatic/core';
import React from 'react';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'blog-admin/blog',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        pubDate: fields.date({ label: 'Publish Date', validation: { isRequired: true }, defaultValue: new Date().toISOString().split('T')[0] }),
        author: fields.text({ label: 'Author', defaultValue: 'Mohammed Yamin Salman' }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'public/assets',
          publicPath: '/assets',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),
        content: fields.markdoc({ 
          label: 'Content',
          extension: 'md',
        }),
      },
    }),
  },
});
