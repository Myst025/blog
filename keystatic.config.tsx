import { config, fields, collection } from '@keystatic/core';
import React from 'react';

export default config({
  ui: {
    brand: {
      name: 'Myst-Blog',
      mark: () => {
        return (
          <button 
            onClick={async (e) => {
              e.preventDefault();
              const btn = e.currentTarget;
              const originalText = btn.innerText;
              btn.innerText = 'Pushing...';
              try {
                const res = await fetch('/__push-to-github', { method: 'POST' });
                if (res.ok) btn.innerText = '✅ Pushed!';
                else btn.innerText = '❌ Failed';
              } catch {
                btn.innerText = '❌ Error';
              }
              setTimeout(() => btn.innerText = originalText, 3000);
            }}
            style={{
              background: '#000',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Push to GitHub
          </button>
        );
      }
    }
  },
  storage: {
    kind: 'local',
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
