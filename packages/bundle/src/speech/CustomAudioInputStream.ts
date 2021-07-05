// TODO: We should export this type of AudioInputStream to allow web developers to bring in their own microphone.
//       For example, it should enable React Native devs to bring in their microphone implementation and use Cognitive Services Speech Services.
import { AudioInputStream } from 'microsoft-cognitiveservices-speech-sdk';

// TODO: Revisit all imports from internals of Speech SDK.
//       It should works with React TypeScript projects without modifying its internal Webpack configuration.
import {
  AudioSourceErrorEvent,
  AudioSourceEvent,
  AudioSourceInitializingEvent,
  AudioSourceOffEvent,
  AudioSourceReadyEvent,
  AudioStreamNodeAttachedEvent,
  AudioStreamNodeAttachingEvent,
  AudioStreamNodeDetachedEvent,
  AudioStreamNodeErrorEvent,
  Events,
  EventSource
} from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/Exports';

import { AudioStreamFormatImpl } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/sdk/Audio/AudioStreamFormat';

import {
  connectivity as Connectivity,
  ISpeechConfigAudioDevice,
  type as Type
} from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/Exports';

import { v4 } from 'uuid';

const SYMBOL_DEVICE_INFO = Symbol('deviceInfo');
const SYMBOL_EVENTS = Symbol('events');
const SYMBOL_FORMAT = Symbol('format');
const SYMBOL_OPTIONS = Symbol('options');

type AudioStreamNode = {
  detach: () => Promise<void>;
  id: () => string;
  read: () => Promise<StreamChunk<ArrayBuffer>>;
};

type DeviceInfo = {
  connectivity?: Connectivity | 'Bluetooth' | 'Wired' | 'WiFi' | 'Cellular' | 'InBuilt' | 'Unknown';
  manufacturer?: string;
  model?: string;
  type?:
    | Type
    | 'Phone'
    | 'Speaker'
    | 'Car'
    | 'Headset'
    | 'Thermostat'
    | 'Microphones'
    | 'Deskphone'
    | 'RemoteControl'
    | 'Unknown'
    | 'File'
    | 'Stream';
};

type Format = {
  bitsPerSample: number;
  channels: number;
  samplesPerSec: number;
};

type NormalizedOptions = Required<Omit<Options, 'debug'>> & {
  debug: boolean;
};

type Options = {
  debug?: true;
  id?: string;
};

type StreamChunk<T> = {
  isEnd: boolean;
  buffer: T;
  timeReceived: number;
};

// Speech SDK quirks: Only 2 lifecycle functions are actually used.
//                    They are: attach() and turnOff().
//                    Others are not used, including: blob(), close(), detach(), turnOn().
abstract class CustomAudioInputStream extends AudioInputStream {
  constructor(options: Options) {
    super();

    const normalizedOptions: NormalizedOptions = {
      debug: options.debug || false,
      id: options.id || v4().replace(/-/gu, '')
    };

    this[SYMBOL_EVENTS] = new EventSource<AudioSourceEvent>();
    this[SYMBOL_OPTIONS] = normalizedOptions;
  }

  [SYMBOL_DEVICE_INFO]: DeviceInfo;
  [SYMBOL_EVENTS]: EventSource<AudioSourceEvent>;
  [SYMBOL_FORMAT]: Format;
  [SYMBOL_OPTIONS]: NormalizedOptions;

  // This code will only works in browsers other than IE11. Only works in ES5 is okay.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Accessors are only available when targeting ECMAScript 5 and higher.ts(1056)
  get events(): EventSource<AudioSourceEvent> {
    return this[SYMBOL_EVENTS];
  }

  // Speech SDK quirks: AudioStreamFormatImpl is internal implementation while AudioStreamFormat is public.
  //                    It is weird to expose AudioStreamFormatImpl instead of AudioStreamFormat.
  // Speech SDK quirks: It is weird to return a Promise in a property.
  //                    Especially this is audio format. Setup options should be initialized synchronously.
  // This code will only works in browsers other than IE11. Only works in ES5 is okay.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Accessors are only available when targeting ECMAScript 5 and higher.ts(1056)
  get format(): Promise<AudioStreamFormatImpl> {
    const format = this[SYMBOL_FORMAT];

    if (!format) {
      throw new Error('"format" is not available until attach() is called.');
    }

    return Promise.resolve(new AudioStreamFormatImpl(format.samplesPerSec, format.bitsPerSample, format.channels));
  }

  id(): string {
    return this[SYMBOL_OPTIONS].id;
  }

  // Speech SDK quirks: in JavaScript, onXxx means "listen to event XXX".
  //                    instead, in Speech SDK, it means "emit event XXX".
  protected onEvent(event: AudioSourceEvent): void {
    this[SYMBOL_EVENTS].onEvent(event);
    Events.instance.onEvent(event);
  }

  protected emitInitializing(): void {
    this.debug('Emitting "AudioSourceInitializingEvent".');
    this.onEvent(new AudioSourceInitializingEvent(this.id()));
  }

  protected emitReady(): void {
    this.debug('Emitting "AudioSourceReadyEvent".');
    this.onEvent(new AudioSourceReadyEvent(this.id()));
  }

  // Speech SDK quirks: "error" is a string, instead of an Error object.
  protected emitError(error: string): void {
    this.debug('Emitting "AudioSourceErrorEvent".', { error });
    this.onEvent(new AudioSourceErrorEvent(this.id(), error));
  }

  protected emitNodeAttaching(audioNodeId: string): void {
    this.debug(`Emitting "AudioStreamNodeAttachingEvent" for node "${audioNodeId}".`);
    this.onEvent(new AudioStreamNodeAttachingEvent(this.id(), audioNodeId));
  }

  protected emitNodeAttached(audioNodeId: string): void {
    this.debug(`Emitting "AudioStreamNodeAttachedEvent" for node "${audioNodeId}".`);
    this.onEvent(new AudioStreamNodeAttachedEvent(this.id(), audioNodeId));
  }

  // Speech SDK quirks: "error" is a string, instead of an Error object.
  protected emitNodeError(audioNodeId: string, error: string): void {
    this.debug(`Emitting "AudioStreamNodeErrorEvent" for node "${audioNodeId}".`, { error });
    this.onEvent(new AudioStreamNodeErrorEvent(this.id(), audioNodeId, error));
  }

  protected emitNodeDetached(audioNodeId: string): void {
    this.debug('Emitting "AudioStreamNodeDetachedEvent".');
    this.onEvent(new AudioStreamNodeDetachedEvent(this.id(), audioNodeId));
  }

  protected emitOff(): void {
    this.debug('Emitting "AudioSourceOffEvent".');
    this.onEvent(new AudioSourceOffEvent(this.id()));
  }

  // Speech SDK quirks: It seems close() is never called, despite, it is marked as abstract.
  // Speech SDK requires this function.
  // eslint-disable-next-line class-methods-use-this
  close(): void {
    throw new Error('Not implemented');
  }

  private debug(message, ...args) {
    // eslint-disable-next-line no-console
    this[SYMBOL_OPTIONS].debug && console.info(`CustomAudioInputStream: ${message}`, ...args);
  }

  /** Implements this function. When called, it should start recording and return an `IAudioStreamNode`. */
  protected abstract performAttach(
    audioNodeId: string
  ): Promise<{
    audioStreamNode: AudioStreamNode;
    deviceInfo: DeviceInfo;
    format: Format;
  }>;

  attach(audioNodeId: string): Promise<AudioStreamNode> {
    this.debug(`Callback for "attach" with "${audioNodeId}".`);

    this.emitNodeAttaching(audioNodeId);

    return Promise.resolve().then<AudioStreamNode>(async () => {
      this.emitInitializing();

      try {
        const { audioStreamNode, deviceInfo, format } = await this.performAttach(audioNodeId);

        this[SYMBOL_DEVICE_INFO] = deviceInfo;
        this[SYMBOL_FORMAT] = format;

        this.emitReady();
        this.emitNodeAttached(audioNodeId);

        return {
          detach: async () => {
            this.debug(`Detaching audio node "${audioNodeId}".`);

            await audioStreamNode.detach();

            this.emitNodeDetached(audioNodeId);
          },
          id: () => audioStreamNode.id(),
          read: () => {
            this.debug('Reading');

            return audioStreamNode.read();
          }
        };
      } catch (error) {
        this.emitNodeError(audioNodeId, error);

        throw error;
      }
    });
  }

  /** Implements this function. When called, it should stop recording. This is called before the `IAudioStreamNode.detach` function. */
  protected abstract performTurnOff(): Promise<void>;

  async turnOff(): Promise<void> {
    this.debug(`Callback for "turnOff".`);

    await this.performTurnOff();

    this.emitOff();
  }

  // This code will only works in browsers other than IE11. Only works in ES5 is okay.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Accessors are only available when targeting ECMAScript 5 and higher.ts(1056)
  get deviceInfo(): Promise<ISpeechConfigAudioDevice> {
    this.debug(`Getting "deviceInfo".`);

    const deviceInfo = this[SYMBOL_DEVICE_INFO];

    if (!deviceInfo) {
      throw new Error('"deviceInfo" is not available until attach() is called.');
    }

    const { connectivity, manufacturer, model, type } = deviceInfo;
    const { bitsPerSample, channels, samplesPerSec } = this[SYMBOL_FORMAT];

    return Promise.resolve({
      bitspersample: bitsPerSample,
      channelcount: channels,
      connectivity:
        typeof connectivity === 'string' ? Connectivity[connectivity] : connectivity || Connectivity.Unknown,
      manufacturer: manufacturer || '',
      model: model || '',
      samplerate: samplesPerSec,
      type: typeof type === 'string' ? Type[type] : type || Type.Unknown
    });
  }
}

export default CustomAudioInputStream;

export type { AudioStreamNode, DeviceInfo, Format, Options };
