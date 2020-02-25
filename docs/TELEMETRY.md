# Telemetry system

In Web Chat 4.8, a new telemetry system is introduced. Developers can opt into this feature by implementing their own telemetry collection adapter and start pumping measurements into telemetry services of their choice.

Microsoft do not collect or receive any telemetry measurements for Web Chat on both CDN and NPM releases. Developers must provide their own telemetry collection adapter to start collecting data. Under local regulations, they may be required to provide privacy policy to the end-user to explain their data collection policy and provide a prompt.

## Collection

We have 2 samples for collecting telemetry measurements:

-  [Collecting telemetry measurements using Azure Application Insights](https://github.com/microsoft/BotFramework-WebChat/tree/master/samples/04.api/k.telemetry-application-insights)
-  [Collecting telemetry measurements using Google Analytics](https://github.com/microsoft/BotFramework-WebChat/tree/master/samples/04.api/l.telemetry-google-analytics)

## Measurements

We simplified our measurements to make it suitable for popular telemetry services:

-  Dimensions are environment information, including browser capabilities and options passed to Web Chat
-  Events will include a name, optional string data, and optional non-negative finite integer value
-  Exceptions will include the JavaScript error object
-  Timings will fire two events, `timingstart` and `timingend`
   -  `timingstart` will include a name
   -  `timingend` will include a name, and duration measured in milliseconds

Feature updates on minor versions may introduce new or remove outdated measurements. To better understand user behaviors with different set of measurements, developers are advised to tag their telemetry data with Web Chat version.

### Dimensions

The following information will be emitted on every measurement. Dimensions may change during the session.

| Name                                   | Description                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `prop:locale`                          | Locale specified in props, normalized                                                    |
| `prop:speechRecognition`               | `"false"` if speech recognition is switched off                                          |
| `prop:speechSynthesis`                 | `"false"` if speech synthesis is switched off                                            |
| `capability:downscaleImage:workerType` | `"web worker"` if the browser support Web Worker and offline canvas, otherwise, `"main"` |

> `prop:speechRecognition` and `prop:speechSynthesis` does not represents browser capabilities on Speech Recognition and Speech Synthesis.

Some telemetry services may have limited number of dimensions. For example, Google Analytics has a limit of 20 custom dimensions. As Web Chat may introduce more dimensions later, developers are advised to pick dimensions they needed before sending to their services.

### Events for hooks

When the following hooks are called, one or more event measurements will be emitted.

| Hooks              | Events          | Data          | Data type | Description                                               |
| ------------------ | --------------- | ------------- | --------- | --------------------------------------------------------- |
| `useSendFiles`     | `sendFiles`     |               |           | Emit when the user uploading files                        |
|                    |                 | `numFile`     | `number`  | Number of files uploaded                                  |
|                    |                 | `sumSizeInKB` | `number`  | Total file size in kilobytes                              |
| `useSubmitSendBox` | `submitSendBox` |               |           | Emit when the user submit send box                        |
|                    |                 |               | `string`  | The method of submit, for example, `keyboard` or `speech` |

### Other events

| Name   | Description                                |
| ------ | ------------------------------------------ |
| `init` | Emit when telemetry system has initialized |

### Exceptions

### Timings

The following operations are timed:

| Timing                    | Description                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- |
| `sendFiles:makeThumbnail` | Time used to generate thumbnail for every uploading image via `useSendFiles` hook |

## Data collection

> For data collection, you must comply to your local regulations and may often need to provide a privacy policy to your end-user.

To collect measurements, you will need to pass an `onTelemetry` handler as a prop to Web Chat. The event emitted will be one of the types below:

```ts
interface TelemetryMeasurementEvent {
   type: string;
   dimension: any;
}

interface TelemetryEventMeasurementEvent extends TelemetryMeasurementEvent {
   type: 'event';
   name: string;
   data?: string;
   value?: number;
}

interface TelemetryExceptionMeasurementEvent extends TelemetryMeasurementEvent {
   type: 'exception';
   error: Error;
}

interface TelemetryTimingStartMeasurementEvent extends TelemetryMeasurementEvent {
   type: 'timingstart';
   name: string;
   timingId: string;
}

interface TelemetryTimingEndMeasurementEvent extends TelemetryMeasurementEvent {
   type: 'timingend';
   name: string;
   timingId: string;
   duration: number;
}
```

Web Chat may emit a large number of dimensions and measurements to your `onTelemetry` handler. As your telemetry service provider may limit number of dimensions and measurements for a single session or property, you are advised to pick and choose the data you needed before transmitting them to your provider.

## Hooks

To emit custom measurements through the `onTelemetry` handler, you can use one of the following hooks.

-  [`useTrackDimension`](https://github.com/microsoft/BotFramework-WebChat/tree/master/docs/HOOKS.md#usetrackdimension) to add/change/remove a dimension
-  [`useTrackEvent`](https://github.com/microsoft/BotFramework-WebChat/tree/master/docs/HOOKS.md#usetrackevent) to emit an event
-  [`useTrackException`](https://github.com/microsoft/BotFramework-WebChat/tree/master/docs/HOOKS.md#usetrackexception) to emit an exception
-  [`useTrackTiming`](https://github.com/microsoft/BotFramework-WebChat/tree/master/docs/HOOKS.md#usetracktiming) to emit a timing

Please refer to [`HOOKS.md`](https://github.com/microsoft/BotFramework-WebChat/tree/master/docs/HOOKS.md#telemetry) for API references.
