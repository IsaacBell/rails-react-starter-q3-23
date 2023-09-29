import { Command } from '../types/soapstone.ts';

export const ExampleCommand: Command = {
  command_text: 'demo',
  model_name: 'emergency',
  object_type: 'command',
  instructions: {
    callback: 'Log?demo callback run',
    priority: '002',
  },
  location: {},
  active: true,
  custom_data: {},
  response_text: 'Thanks so much for trying out this demo!',
};

export const ExampleCommandCb = (_: string) => {};
