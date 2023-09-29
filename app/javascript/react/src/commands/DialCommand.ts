import { Command } from '../types/soapstone.ts';

// dials 555 by default
// set call number using the `instructions.callback` field
// as in: 'Dial?411'
export const DialCommand: Command = {
  command_text: 'dial',
  model_name: 'emergency',
  object_type: 'command',
  instructions: {
    callback: 'Dial?555',
    priority: '120',
  },
  location: {},
  active: true,
  custom_data: {},
  response_text: 'To dial a service, say "Call 911" or "Call 411", etc.',
};

export const DialCommandCb = (phone: string) => { window.location.href = `tel:${phone}`; };
