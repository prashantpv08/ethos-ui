import EOThemeProvider from '../src/lib/theme';
import { StoryFn, StoryContext } from '@storybook/react';
import '../src/fonts/font.css';
import { Suspense } from 'react';

const withThemeProvider = (Story: StoryFn, context: StoryContext) => {
  return (
    <EOThemeProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Story {...context} />
      </Suspense>
    </EOThemeProvider>
  );
};

export default {
  decorators: [withThemeProvider],

  parameters: {
    controls: {
      expanded: true,
    },
  },

  tags: ['autodocs'],
};
