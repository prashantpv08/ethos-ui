declare module '*.svg?react' {
  import * as React from 'react';
  const SVGReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  export default SVGReactComponent;
}
