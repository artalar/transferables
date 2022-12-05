import type { getTransferable as transferable, getTransferables as transferables, hasTransferables as has } from "../src/index.ts";
import { isSupported } from "../src/index.ts";

// 16MB = 1024 * 1024 * 16
export const MB = 1024 * 1024;

/**
 * Generates an Array of a certain MB size (by default 16 MB)
 * 
 * @param size Array size in MB
 */
export function range(size = 16) {
  return Array.from({ length: size * MB }, (v, i) => i);
}

export const isClonable = isSupported();

/**
 * Generates a complex object for various array buffer sizes, 
 * to test how much of an impact transferable objects actually have
 * on performance
 * 
 * @param size Array size in MB
 */
export function generateObj(size = 16, enable: { streams?: boolean, channel?: boolean } = {}) {
  const isStream = enable.streams ?? true;
  const isChannel = enable.channel ?? true;

  const arr = range(size);
  const uint8 = new Uint8Array(arr);
  const { buffer: arrbuf } = uint8;

  const int8 = new Int8Array(arr);
  const uint8c = new Uint8ClampedArray(arr)
  const int16 = new Int16Array(arr);
  const uint16 = new Uint16Array(arr);
  const int32 = new Int32Array(arr);
  const uint32 = new Uint32Array(arr);
  const float32 = new Float32Array(arr);
  const float64 = new Float64Array(arr);

  let transferable: any[] = [];
  transferable.push(arrbuf);
  transferable.push(int8.buffer);
  transferable.push(uint8c.buffer);
  transferable.push(int16.buffer);
  transferable.push(uint16.buffer);
  transferable.push(int32.buffer);
  transferable.push(uint32.buffer);
  transferable.push(float32.buffer);
  transferable.push(float64.buffer);

  const complexTypedArrObj = {
    int8: int8,
    uint8_uint8c: [uint8, uint8c],
    float32_float64_uint32_int32_uint16_int16_uint8obj: {
      float32_float64_obj: [
        float32,
        float64,
        {
          float32_float64_int16_int32: [float32, float64, int16, int32]
        }
      ],
      uint32: [uint32],
      uint16_float32: [uint16, float32],
      uint16_obj_int16: [
        uint16,
        {
          arrbuf: [arrbuf]
        },
        int16,
      ],
      obj_uin8_uint16: [
        {
          arrbuf_uint8_uint16: [arrbuf, uint8, uint16]
        },
        uint8,
        uint16
      ]
    },
    arrbuf: arrbuf,
    arrbuf_obj: {
      buf: arrbuf
    },
    arrbuf_float32: [arrbuf, float32]
  }

  // @ts-ignore MessageChannel
  const channel = isChannel && ('MessageChannel' in globalThis) && new globalThis.MessageChannel();
  const ports = channel && [channel?.port1, channel?.port2];
  Array.isArray(ports) && transferable.push(...ports)

  const readable = "ReadableStream" in globalThis;
  const writable = "WritableStream" in globalThis;
  const transform = "TransformStream" in globalThis;

  const streams = isStream && {
    readonly: readable && new ReadableStream(),
    writeonly: writable && new WritableStream(),
    tranformonly: transform && new TransformStream()
  }

  streams && streams.readonly && transferable.push(streams.readonly)
  streams && streams.writeonly && transferable.push(streams.writeonly)
  streams && streams.tranformonly && transferable.push(streams.tranformonly)

  // No polyfill for OffscreenCanvas, RTCPeerConnection, and RTCDataChannel
  // const offscreencanvas = new OffscreenCanvas(200, 200);
  // const PeerConnection = new RTCPeerConnection();
  // const DataChannel = PeerConnection.createDataChannel("my channel");

  // No polyfill
  // const audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel = { 
  //   audiodata: new AudioData(),
  //   imagebitmap: new ImageBitmap(),
  //   videoframe: new VideoFrame(),
  //   offscreencanvas,
  //   rtcdatachannel: new RTCDataChannel()
  // }

  const fn1 = function () { }
  fn1.ports = ports;

  function fn2() { }
  fn2.channel = channel;

  const other_objects = {
    arr: range(size),
    prototype: fn2.prototype,

    arr2: [
      int8,
      uint8c,
      int16,
      uint16,
      int32,
      uint32,
      float32,
      float64,
    ],

    complexTypedArrObj,
    streams,
    channel,
    ports,
    instanciatedClass: new class {
      #x = {
        internal: {
          value: 25,
          ports
        }
      };
      streams = streams;
      x: number | object = 5;
      constructor() {
        this.x = { complexTypedArrObj };
      }
    }()
  }

  const dynamic_size_object: Record<string | number, unknown> = {};
  const len = Math.min(Math.max(size + 10, 1), 1000);

  for (let i = 0; i < len; i++) {
    const arr_ = range(size);
    const uint8_ = new Uint8Array(arr_);
    const int8_ = new Int8Array(arr_);
    const uint8c_ = new Uint8ClampedArray(arr_)
    const int16_ = new Int16Array(arr_);
    const uint16_ = new Uint16Array(arr_);
    const int32_ = new Int32Array(arr_);
    const uint32_ = new Uint32Array(arr_);
    const float32_ = new Float32Array(arr_);
    const float64_ = new Float64Array(arr_);

    transferable.push(uint8_.buffer);
    transferable.push(int8_.buffer);
    transferable.push(uint8c_.buffer);
    transferable.push(int16_.buffer);
    transferable.push(uint16_.buffer);
    transferable.push(int32_.buffer);
    transferable.push(uint32_.buffer);
    transferable.push(float32_.buffer);
    transferable.push(float64_.buffer);

    // @ts-ignore MessageChannel
    const channel_ = isChannel && ('MessageChannel' in globalThis) && new globalThis.MessageChannel();
    const ports_ = channel_ && [channel_.port1, channel_.port2];
    Array.isArray(ports_) && transferable.push(...ports_)

    const streams_ = isStream && {
      readonly: new ReadableStream(),
      writeonly: new WritableStream(),
      tranformonly: new TransformStream()
    }

    streams_ && streams_.readonly && transferable.push(streams_.readonly)
    streams_ && streams_.writeonly && transferable.push(streams_.writeonly)
    streams_ && streams_.tranformonly && transferable.push(streams_.tranformonly)

    dynamic_size_object[i] = {
      uint8_all: [
        uint8_,
        int8_,
        uint8c_,
        int16_,
        uint16_,
        int32_,
        uint32_,
        float32_,
        float64_,
        channel_,
        ports_,
        streams_,
      ],
      arr_,
      uint8_,
      int8_,
      uint8c_,
      int16_,
      uint16_,
      int32_,
      uint32_,
      float32_,
      float64_,
      channel_,
      ports_,
      streams_,
    };
  }

  return {
    other_objects,
    dynamic_size_object,
    complexTypedArrObj,
    transferable: Array.from(new Set(transferable))
  };
}

/**
 * Maps the name of the benchmark to the name of the metric it is
 * measuring. Each benchmark will have a map of metrics to an array of
 * numbers (the numbers per cycle) that are the measured performance of the metric.
*/
export const perfs = new Map<string, Map<string, number[]>>();

/**
 * Add a performance measure for a specific variant of a specific benchmark
 * 
 * @param name The name of the benchmarkx
 * @param variant The name of the variant
 * @param fn The function to call to run the benchmark
 */
export async function add(name: string, variant: string, fn?: Function, obj?: unknown) {
  const start = performance.now();
  await fn?.(obj);
  const end = performance.now();
  const duration = end - start;

  if (!perfs.has(name)) perfs.set(name, new Map<string, number[]>());
  if (!perfs.get(name)?.has(variant)) perfs.get(name)?.set(variant, []);
  perfs.get(name)?.get(variant)?.push(duration);
}

/**
 * This is a time formatter that enables us to format elapsed time into human readable measurements of time 
 */
export const timeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "long",
});

export function timeFormat(time: number) {
  return timeFormatter.format(time, "seconds").replace("seconds", "ms");
}

export interface IIterationType {
  name: string;
  variant: string;
  cycle: number;
  i: number;
  obj: ReturnType<typeof generateObj>;
}

export interface ICreateMessageChannelIteratorOptions {
  name: string;
  index: number;
  variant: string;
  cycle?: number;
  obj: ReturnType<typeof generateObj>;
  channel: MessageChannel;
  queue: Map<string, ReturnType<typeof createPromise>>;
}

interface ICreateWorkerIteratorOptions {
  name: string;
  index: number;
  variant: string;
  cycle?: number;
  obj: ReturnType<typeof generateObj>;
  worker: Worker;
  queue: Map<string, ReturnType<typeof createPromise>>;
}

export function createPromise() {
  let resolve: ((value: unknown) => void) | undefined;
  let reject: ((value: unknown) => void) | undefined;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

export async function createMessageChannelPromise({ name, index, cycle = 0, variant, obj, channel, queue }: ICreateMessageChannelIteratorOptions) {
  const simpleMsg = { name, variant, cycle, i: index };
  const msg = { ...simpleMsg, obj };
  try {
    channel.port2.postMessage(msg, obj.transferable);
  } catch (e) {
    console.warn(e);
    channel.port2.postMessage(simpleMsg);
  }

  const promise = createPromise();
  const queueKey = `${name}-${variant}-${cycle}-${index}`;
  queue.set(queueKey, promise);
  await promise.promise;
}

export async function createWorkerPromise({ name, index, cycle = 0, variant, obj, worker, queue }: ICreateWorkerIteratorOptions) {
  const simpleMsg = { name, variant, cycle, i: index };
  const msg = { ...simpleMsg, obj };
  try {
    console.log(obj.transferable)
    worker.postMessage(msg, obj.transferable);
  } catch (e) {
    console.warn(e);
    worker.postMessage(simpleMsg);
  }

  const promise = createPromise();
  const queueKey = `${name}-${variant}-${cycle}-${index}`;
  queue.set(queueKey, promise);
  await promise.promise;
}

// [`hasTransferables`, `structuredClone (manually)`, `structuredClone (getTransferable*)`, `structuredClone (getTransferables)`]
export function createStructuredCloneVariants(
  hasTransferables: typeof has, 
  getTransferable: typeof transferable, 
  getTransferables: typeof transferables
) {
  return {
    hasTransferables(obj: ReturnType<typeof generateObj>) {
      return hasTransferables(obj, true);
    },

    "structuredClone (manually)": function (obj: ReturnType<typeof generateObj>) {
      try {
        structuredClone(obj, { transfer: obj.transferable });
      } catch (e) { console.warn(e); }
    },

    "structuredClone (getTransferable*)": function (obj: ReturnType<typeof generateObj>) {
      try {
        const transfer = Array.from(getTransferable(obj, true)) as Transferable[];
        structuredClone(obj, { transfer });
      } catch (e) { console.warn(e); }
    },

    "structuredClone (getTransferables)": function (obj: ReturnType<typeof generateObj>) {
      try {
        const transfer = getTransferables(obj, true) as Transferable[];
        structuredClone(obj, { transfer });
      } catch (e) { console.warn(e); }
    }
  };
}

export const postMessageVariants = [`hasTransferables`, `postMessage (no transfers)`, `postMessage (manually)`, `postMessage (getTransferable*)`, `postMessage (getTransferables)`];
export const maxSize = 1.6;

export function printTable(variants: string[], dmeanstdev: any, markdownTable: any) {
  const head = ["", ...variants];
  const table: Record<string, string[]>[] = [];

  perfs.forEach((variants, name) => {
    const obj: Record<string, string[]> = {};
    variants.forEach((durations) => {
      const [mean, std] = dmeanstdev(durations.length, 0, new Float64Array(durations), 1, new Float64Array(2), 1);

      obj[name] ??= [];
      obj[name].push(`${timeFormat(mean)} ± ${timeFormat(std).replace("in ", "")}`);

    });

    table.push(obj);
  })

  const str = table.map((x) => {
    const [key] = Object.keys(x);
    return [key, ...x[key]]
  })

  const result = markdownTable([head, ...str]);
  console.log(result);
  console.log("\n");

  return result;
}

console.log({ isClonable })

