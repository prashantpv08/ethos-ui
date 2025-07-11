import { MemoryRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';
import Link, { CustomLinkProps } from './link';

const Template: Story<CustomLinkProps> = (args) => (
  <MemoryRouter>
    <Link {...args} />
  </MemoryRouter>
);

const Default = Template.bind({});
Default.args = {
  to: '/your-path',
  children: 'Click Me',
};

export default {
  title: 'atoms/Link',
  component: Link,
} as Meta<CustomLinkProps>;

export { Default as Link };
