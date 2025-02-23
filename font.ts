import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SCALE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const BASE_WIDTH = 375;

// Font scaling configuration
const fontConfig = {
    phone: {
        small: { min: 0.85, max: 1 },
        medium: { min: 0.9, max: 1.05 },
        large: { min: 1, max: 1.15 },
    },
    tablet: {
        small: { min: 1.1, max: 1.2 },
        medium: { min: 1.2, max: 1.3 },
        large: { min: 1.3, max: 1.4 },
    },
};

// Detect if device is a phone or tablet
export const getDeviceType = (): 'phone' | 'tablet' => {
    if (SCREEN_WIDTH >= 600 || SCREEN_HEIGHT >= 1000) {
        return 'tablet';
    }
    return 'phone';
};

// Determine Screen Size Category
const getScreenSizeCategory = (): 'small' | 'medium' | 'large' => {
    if (SCALE < 350) return 'small';
    if (SCALE > 500) return 'large';
    return 'medium';
};

// Get Scaled Font Size
export const getFontSize = (size: number): number => {
    const deviceType = getDeviceType();
    const screenCategory = getScreenSizeCategory();
    const config = fontConfig[deviceType][screenCategory];

    // Calculate scale factor
    const scaleFactor = SCALE / BASE_WIDTH;
    const clampedScaleFactor = Math.max(Math.max(scaleFactor, config.min), config.max);

    let newSize = size * clampedScaleFactor;

    // Adjust for tablets
    if (deviceType === 'tablet') {
        newSize *= 1.1;
    }

    // Apply user font scaling
    return Math.round(PixelRatio.roundToNearestPixel(newSize * PixelRatio.getFontScale()));
};

// Adjust Font Config Dynamically
export const adjustFontConfig = (
    deviceType: 'phone' | 'tablet',
    sizeCategory: 'small' | 'medium' | 'large',
    minScale: number,
    maxScale: number
) => {
    fontConfig[deviceType][sizeCategory] = { min: minScale, max: maxScale };
};

// Debug Logs
// console.log('Device type:', getDeviceType());
// console.log('Font size for 16:', getFontSize(16));
// console.log('Screen dimensions:', SCREEN_WIDTH, SCREEN_HEIGHT);
