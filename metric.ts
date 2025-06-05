import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Adjusted to prevent over-scaling on tablets
const horizontalScale = (size: number) => {
  const scaleFactor = width / guidelineBaseWidth;
  const limitedFactor = Math.min(scaleFactor, 1.3); // Limit max upscaling
  return size * limitedFactor;
};

const verticalScale = (size: number) => {
  const scaleFactor = height / guidelineBaseHeight;
  const limitedFactor = Math.min(scaleFactor, 1.3); // Limit max upscaling
  return size * limitedFactor;
};

const moderateScale = (size: number, factor = 0.5) => {
  const hs = horizontalScale(size);
  return size + (hs - size) * factor;
};

export { horizontalScale, verticalScale, moderateScale };
