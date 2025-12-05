'use client';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

const AspectRatioRoot = AspectRatio;
const AspectRatioNamespace = Object.assign(AspectRatioRoot, {});

export { AspectRatioNamespace as AspectRatio };
