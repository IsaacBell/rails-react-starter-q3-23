import localforage from 'localforage';
import { Command } from '../types/soapstone.ts';
import { ExampleCommand, ExampleCommandCb } from './ExampleCommand.ts';
import { DialCommand, DialCommandCb } from './DialCommand.ts';
import { getLastKnownLocation } from '../utils/location.ts';
import { getLocalData } from '../utils/data.ts';

export const CommandPriorityCodes = {
  '000': 'admin',
  '001': 'internal',
  '002': 'test',

  100: 'care',
  101: 'emergency services',
  120: 'non-critical services',

  200: 'gov',
  230: 'government function',
  231: 'government event',

  300: 'biz',
  330: 'business function',

  400: 'pub',
  440: 'event',
  450: 'performance',

  500: 'pri',
  510: 'gathering',
  511: 'invitation',

  999: 'unknown',
};

export const commandCallBacks: Record<string, ((arg: string) => void)> = {
  Dial: DialCommandCb,
  Example: ExampleCommandCb,
};

export const storeSpeechCommands = async (commands: Command[]) => {
  await localforage.setItem('speechCommands', commands);
};

export const getStoredSpeechCommands = async (): Promise<Command[] | null> => {
  const json = await getLocalData('speechCommands') as any;
  return JSON.parse(json) ?? null;
};

export const defaultCommands: Command[] = [
  DialCommand,
  ExampleCommand,
  {
    command_text: 'low battery mode',
    model_name: 'critical',
    object_type: 'command',
    instructions: {
      // todo
      ai: 'off',
      speech: 'off',
    },
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Entering low battery mode. Turning off ',
  },
  {
    command_text: 'call 555',
    model_name: 'emergency',
    object_type: 'command',
    instructions: {
      callback: 'Dial?555',
      priority: '101',
    },
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Calling 555...',
  },
  {
    command_text: 'call 411',
    model_name: 'emergency',
    object_type: 'command',
    instructions: {
      callback: 'Dial?411',
      priority: '120',
    },
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Calling 411...',
  },
  {
    command_text: 'call 911',
    model_name: 'emergency',
    object_type: 'command',
    instructions: {
      callback: 'Dial?911',
      priority: '101',
    },
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Not calling 911. Please be aware that this is a demo...',
  },
  {
    command_text: 'turn off object detection',
    model_name: 'object-detection',
    object_type: 'command',
    instructions: {},
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Turning off object detection...',
  },
  {
    command_text: 'turn off speech',
    model_name: 'speech',
    object_type: 'command',
    instructions: {},
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Turning off speech...',
  },
  {
    command_text: 'turn off mic',
    model_name: 'speech',
    object_type: 'command',
    instructions: {},
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Turning off speech...',
  },
  {
    command_text: 'take me to the hospital',
    model_name: 'navigation',
    object_type: 'command',
    instructions: {},
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Navigating to the nearest hospital...',
  },
  {
    command_text: 'take me to the police station',
    model_name: 'navigation',
    object_type: 'command',
    instructions: {},
    location: {},
    active: true,
    custom_data: {},
    response_text: 'Navigating to the nearest police station...',
  },
  {
    command_text: 'take me home',
    model_name: 'navigation',
    object_type: 'command',
    instructions: {},
    location: {
    },
    active: true,
    custom_data: {},
    response_text: 'Navigating home...',
  },
];

export const fetchDynamicCommands = async (): Promise<Command[]> => {
  const loc = await getLastKnownLocation();
  if (!loc) return [];
  const cached = await getStoredSpeechCommands();
  if (cached) return cached;

  const coords = loc?.geometry?.coordinates;
  if (!coords || coords.length !== 2) return [];

  const [lng, lat] = coords;
  let url = '/api/commands';
  if (lat && lng) url += `?lat=${lat}&lng=${lng}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dynamic commands:', error);
  }

  return [];
};

export const getAllCommands = async (): Promise<Command[]> => {
  const dynamicCommands = await fetchDynamicCommands();
  return [...defaultCommands, ...dynamicCommands];
};
