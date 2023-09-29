import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import App from './App.tsx';

export default {
  title: 'Components/App',
  component: App,
} as Meta;

const Template: Story = (
  args: React.JSX.IntrinsicAttributes,
) => <App {...args} />;

export const Default = Template.bind({});
