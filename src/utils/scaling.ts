import { Dimensions, PixelRatio } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width, height } = Dimensions.get('window');

const widthScale = width / BASE_WIDTH;
const heightScale = height / BASE_HEIGHT;

const scaleValue = (size: number, factor: number, axisScale: number): number =>
  size + (size * axisScale - size) * factor;

/**
 * Horizontal scaling helper.
 * Use for spacing that depends on screen width, such as margin, padding,
 * gap, or other width-based spacing values.
 * Avoid using it for container width/height layout.
 */
export const rs = (size: number): number =>
  PixelRatio.roundToNearestPixel(size * widthScale);

/**
 * Vertical scaling helper.
 * Use sparingly for top/bottom spacing that should adapt to screen height,
 * such as marginTop or marginBottom.
 * Avoid using it for regular layout sizing.
 */
export const rvs = (size: number): number =>
  PixelRatio.roundToNearestPixel(size * heightScale);

/**
 * Font-size scaling helper.
 * Use this for text sizes because it scales gently and helps keep typography
 * readable across different screen sizes.
 */
export const rms = (size: number, factor = 0.5): number => {
  const scaled = scaleValue(size, factor, widthScale);
  return PixelRatio.roundToNearestPixel(scaled);
};

/**
 * Moderate vertical scaling helper.
 * Use for lineHeight or occasional vertical spacing when you need a softer
 * scaling effect than rvs.
 * Keep it away from container layout sizing.
 */
export const rmvs = (size: number, factor = 0.5): number => {
  const scaled = scaleValue(size, factor, heightScale);
  return PixelRatio.roundToNearestPixel(scaled);
};
