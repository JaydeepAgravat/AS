import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import FastImage, {
  FastImageProps,
  ImageStyle as FastImageStyle,
  OnErrorEvent,
  OnLoadEvent,
  ResizeMode,
  Source,
} from '@d11/react-native-fast-image';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@config/colors';
import { ICONS } from '@config/icons';

type AppImageSource = ImageSourcePropType | string;

type NativeImageSource = Source | number;
type LayoutSize = { width: number; height: number };
type AppImageNetworkOptions = Pick<Source, 'headers' | 'priority' | 'cache'>;

const DEFAULT_SHIMMER_COLORS = [
  COLORS.shimmer.base,
  COLORS.shimmer.highlight,
  COLORS.shimmer.base,
];

type BaseFastImageProps = Omit<
  FastImageProps,
  'source' | 'style' | 'resizeMode'
>;

type AppImageProps = BaseFastImageProps & {
  source: AppImageSource;
  fallbackSource?: AppImageSource;
  resizeMode?: ResizeMode;
  asBackground?: boolean;
  shimmerEnabled?: boolean;
  shimmerColors?: string[];
  style?: StyleProp<ImageStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  headers?: Source['headers'];
  priority?: Source['priority'];
  cache?: Source['cache'];
};

const isRemoteSource = (source: NativeImageSource): source is Source => {
  return typeof source === 'object' && source !== null && 'uri' in source;
};

const toNativeSource = (source: AppImageSource): NativeImageSource => {
  if (typeof source === 'string') {
    return { uri: source };
  }

  if (Array.isArray(source)) {
    if (__DEV__ && source.length > 1) {
      console.warn(
        '[AppImage] Array sources with multiple entries are not fully supported. Using only the first source.',
      );
    }

    const first = source[0];
    if (!first) {
      return { uri: '' };
    }

    return first as NativeImageSource;
  }

  return source as NativeImageSource;
};

const addNetworkOptions = (
  source: NativeImageSource,
  options: AppImageNetworkOptions,
): NativeImageSource => {
  if (!isRemoteSource(source)) {
    return source;
  }

  return {
    ...source,
    ...(options.headers ? { headers: options.headers } : {}),
    ...(options.priority ? { priority: options.priority } : {}),
    ...(options.cache ? { cache: options.cache } : {}),
  };
};

const getSourceIdentity = (source: NativeImageSource): string => {
  if (typeof source === 'number') {
    return String(source);
  }

  if (!source?.uri) {
    return '';
  }

  return source.uri;
};

const hasRemoteUri = (source: NativeImageSource): boolean => {
  return isRemoteSource(source) && Boolean(source.uri);
};

const getNumericDimension = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};

const getSeededLayout = (
  style: StyleProp<ImageStyle> | StyleProp<ViewStyle>,
): LayoutSize => {
  const flatStyle = StyleSheet.flatten(style) as
    | ImageStyle
    | ViewStyle
    | undefined;

  return {
    width: getNumericDimension(flatStyle?.width),
    height: getNumericDimension(flatStyle?.height),
  };
};

const AppImage = ({
  source,
  fallbackSource,
  resizeMode = FastImage.resizeMode.contain,
  asBackground = false,
  shimmerEnabled = true,
  shimmerColors = DEFAULT_SHIMMER_COLORS,
  style,
  backgroundStyle,
  containerStyle,
  imageStyle,
  headers,
  priority,
  cache,
  children,
  ...rest
}: AppImageProps) => {
  const primarySource = useMemo(
    () =>
      addNetworkOptions(toNativeSource(source), {
        headers,
        priority,
        cache,
      }),
    [source, headers, priority, cache],
  );

  const fallbackNormalizedSource = useMemo(
    () =>
      fallbackSource
        ? addNetworkOptions(toNativeSource(fallbackSource), {
            headers,
            priority,
            cache,
          })
        : null,
    [fallbackSource, headers, priority, cache],
  );

  const primaryIdentity = useMemo(
    () => getSourceIdentity(primarySource),
    [primarySource],
  );

  const shouldUseShimmerForPrimary =
    shimmerEnabled && hasRemoteUri(primarySource);

  const [hasError, setHasError] = useState(false);
  const [showErrorFallback, setShowErrorFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(() => !shouldUseShimmerForPrimary);

  const seededLayoutStyle = useMemo(
    () => (asBackground ? [backgroundStyle, containerStyle] : style),
    [asBackground, backgroundStyle, containerStyle, style],
  );

  const [layoutSize, setLayoutSize] = useState<LayoutSize>(() =>
    getSeededLayout(seededLayoutStyle),
  );

  const normalizedSource =
    hasError && fallbackNormalizedSource
      ? fallbackNormalizedSource
      : primarySource;

  const shouldUseShimmer = shimmerEnabled && hasRemoteUri(normalizedSource);

  // Reset all state before paint when primary source changes.
  useLayoutEffect(() => {
    setHasError(false);
    setShowErrorFallback(false);
    setIsLoaded(!shouldUseShimmerForPrimary);
  }, [primaryIdentity, shouldUseShimmerForPrimary]);

  const {
    onLoadStart,
    onLoad,
    onError,
    onLoadEnd,
    onLayout,
    ...fastImageRest
  } = rest;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      setLayoutSize(prev => {
        if (prev.width === width && prev.height === height) {
          return prev;
        }

        return { width, height };
      });

      onLayout?.(event);
    },
    [onLayout],
  );

  const handleLoadStart = useCallback(() => {
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoad: FastImageProps['onLoad'] = useCallback(
    (event: OnLoadEvent) => {
      setIsLoaded(true);
      onLoad?.(event);
    },
    [onLoad],
  );

  const handleError: FastImageProps['onError'] = useCallback(
    (event: OnErrorEvent) => {
      if (!hasError && fallbackNormalizedSource) {
        // first failure — try fallback source
        setHasError(true);
        setIsLoaded(false);
      } else {
        // no fallback left — show dummy placeholder view
        setShowErrorFallback(true);
        setIsLoaded(true);
      }

      onError?.(event);
    },
    [fallbackNormalizedSource, hasError, onError],
  );

  const shouldRenderShimmer =
    shouldUseShimmer &&
    !isLoaded &&
    layoutSize.width > 0 &&
    layoutSize.height > 0;

  const shimmerOverlay = shouldRenderShimmer ? (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient}
      visible={false}
      width={layoutSize.width}
      height={layoutSize.height}
      shimmerColors={shimmerColors}
      style={[StyleSheet.absoluteFill, styles.shimmerOverlay]}
      shimmerStyle={[StyleSheet.absoluteFill, styles.shimmerOverlay]}
    />
  ) : null;

  // Dummy view shown when both primary and fallback sources fail.
  const errorFallback = showErrorFallback ? (
    <View style={[styles.errorImageContainer]}>
      <FastImage source={ICONS.IMG_ERROR} style={styles.errorImage} />
    </View>
  ) : null;

  if (asBackground) {
    return (
      <View style={[backgroundStyle, containerStyle]} onLayout={handleLayout}>
        <FastImage
          {...fastImageRest}
          source={normalizedSource}
          resizeMode={resizeMode}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          onLoadEnd={onLoadEnd}
          style={
            [StyleSheet.absoluteFill, imageStyle] as StyleProp<FastImageStyle>
          }
        />
        {shimmerOverlay}
        {errorFallback}
        {children}
      </View>
    );
  }

  return (
    <FastImage
      {...fastImageRest}
      source={normalizedSource}
      resizeMode={resizeMode}
      onLayout={handleLayout}
      onLoadStart={handleLoadStart}
      onLoad={handleLoad}
      onError={handleError}
      onLoadEnd={onLoadEnd}
      style={style as StyleProp<FastImageStyle>}
    >
      {shimmerOverlay}
      {errorFallback}
      {children}
    </FastImage>
  );
};

const styles = StyleSheet.create({
  shimmerOverlay: {
    pointerEvents: 'none',
  },
  errorImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorImage: {
    width: '50%',
    height: '50%',
  },
});

export const APP_IMAGE_RESIZE_MODE = FastImage.resizeMode;
export const APP_IMAGE_PRIORITY = FastImage.priority;
export const APP_IMAGE_CACHE_CONTROL = FastImage.cacheControl;
export const APP_IMAGE_TRANSITION = FastImage.transition;
export const preloadAppImages = FastImage.preload;
export const clearAppImageMemoryCache = FastImage.clearMemoryCache;
export const clearAppImageDiskCache = FastImage.clearDiskCache;

export type { AppImageProps, AppImageSource };

export default AppImage;
