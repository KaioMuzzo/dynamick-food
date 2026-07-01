// Lets TypeScript understand `.svg` imports handled by react-native-svg-transformer:
// each .svg becomes a React component rendering an <Svg>.
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: FC<SvgProps>;
  export default content;
}
