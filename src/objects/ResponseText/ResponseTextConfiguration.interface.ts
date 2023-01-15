import { Events } from 'phaser';
import SRTTextConfiguration from '../Text/TextConfiguration.interface';

type ResponseTextConfiguration = SRTTextConfiguration & {
  eventEmitter: Events.EventEmitter;
  respondOn: string;
};

export default ResponseTextConfiguration;
