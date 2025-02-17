import { MB, generateObj, add, createStructuredCloneVariants, printTable, maxSize, isClonable } from "../utils";
import { getTransferable, getTransferables, hasTransferables } from "../../src";

import bytes from "pretty-bytes";
import { dmeanstdev } from '@stdlib/stats-base';

import { markdownTable } from 'markdown-table';

const variants = createStructuredCloneVariants(hasTransferables, getTransferable, getTransferables);
const keys = Object.keys(variants) as (keyof typeof variants)[];
const len = keys.length;

export default async function (e: MouseEvent) {
  e.preventDefault();
  
  const num_ = Math.pow(2, Math.log2(maxSize * MB));
  const name_ = bytes(num_, { maximumFractionDigits: 3 });
  const obj_ = generateObj(num_ / MB, isClonable);
  console.log({ type: "structuredClone (browser)", name: name_, transferable: obj_.transferable.length })

  for (let cycle = 0; cycle < 5; cycle++) {
    for (let index = 0; index < Math.log2(maxSize * MB); index++) {
      const num = Math.pow(2, index);
      const name = bytes(num, { maximumFractionDigits: 3 });

      for (let j = 0; j < len; j++) {
        const variant = keys[j];
        const fn = variants[variant];
        const obj = generateObj(num / MB, isClonable);

        console.log({ name, index, variant, cycle })
        await add(name, variant, fn, obj)
      }
    }
    console.log("\n")
  }

  return printTable(keys, dmeanstdev, markdownTable);
}