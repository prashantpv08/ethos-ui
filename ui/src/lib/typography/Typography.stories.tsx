import { Meta, Story } from '@storybook/react';
import { Heading, Label, CustomTypographyProps } from './Typography';
import EOThemeProvider from '../theme';

export default {
  title: 'Typography',
  component: Heading,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'subtitle1',
        'subtitle2',
        'body1',
      ],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    children: {
      control: 'text',
    },
  },
} as Meta;

const HeadingTemplate: Story<CustomTypographyProps> = (args) => (
  <EOThemeProvider>
    <Heading {...args} />
  </EOThemeProvider>
);

const LabelTemplate: Story<CustomTypographyProps> = (args) => (
  <EOThemeProvider>
    <Label {...args} />
  </EOThemeProvider>
);

export const HeadingH1 = HeadingTemplate.bind({});
HeadingH1.args = {
  variant: 'h1',
  weight: 'regular',
  children: 'Heading / H1 / Regular',
};

export const HeadingH2 = HeadingTemplate.bind({});
HeadingH2.args = {
  variant: 'h2',
  weight: 'medium',
  children: 'Heading / H2 / Medium',
};

export const HeadingH3 = HeadingTemplate.bind({});
HeadingH3.args = {
  variant: 'h3',
  weight: 'semibold',
  children: 'Heading / H3 / SemiBold',
};

export const HeadingH4 = HeadingTemplate.bind({});
HeadingH4.args = {
  variant: 'h4',
  weight: 'bold',
  children: 'Heading / H4 / Bold',
};

export const HeadingH5 = HeadingTemplate.bind({});
HeadingH5.args = {
  variant: 'h5',
  weight: 'regular',
  children: 'Heading / H5 / Regular',
};

export const LabelL1 = LabelTemplate.bind({});
LabelL1.args = {
  variant: 'subtitle1',
  weight: 'regular',
  children: 'Label / L1 / Regular',
};

export const LabelL2 = LabelTemplate.bind({});
LabelL2.args = {
  variant: 'subtitle2',
  weight: 'medium',
  children: 'Label / L2 / Medium',
};

export const LabelL3 = LabelTemplate.bind({});
LabelL3.args = {
  variant: 'body1',
  weight: 'semibold',
  children: 'Label / L3 / SemiBold',
};
