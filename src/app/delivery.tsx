import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const MAP_ZOOM = 15;
const TILE_SIZE = 256;
const GEOCODER_MIN_INTERVAL = 1000;

function DeliverySection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <ThemedView
      type="backgroundElement"
      className="rounded-2xl border border-[#eef2f6] px-4 pb-1 pt-4">
      <View className="mb-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <Ionicons name={icon} size={19} color="#15803d" />
        </View>
        <View className="flex-1 gap-0.5">
          <ThemedText className="text-[15px] font-bold">{title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        </View>
      </View>
      <View className="mt-3">{children}</View>
    </ThemedView>
  );
}

type DeliveryDetails = {
  recipient: string;
  phone: string;
  address: string;
  unit: string;
  city: string;
  instructions: string;
};

type Coordinates = { latitude: number; longitude: number };
type MapLocation = Coordinates & { name: string };
type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string | undefined>;
};

const EMPTY_DETAILS: DeliveryDetails = {
  recipient: '',
  phone: '',
  address: '',
  unit: '',
  city: '',
  instructions: '',
};

function coordinatesToWorld({ latitude, longitude }: Coordinates, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLatitude = Math.sin((Math.max(-85.0511, Math.min(85.0511, latitude)) * Math.PI) / 180);

  return {
    x: ((longitude + 180) / 360) * scale,
    y: ((0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale),
  };
}

function worldToCoordinates(x: number, y: number, zoom: number): Coordinates {
  const scale = TILE_SIZE * 2 ** zoom;
  const wrappedX = ((x % scale) + scale) % scale;
  const clampedY = Math.max(0, Math.min(scale, y));
  const longitude = (wrappedX / scale) * 360 - 180;
  const latitude = (Math.atan(Math.sinh(Math.PI * (1 - (2 * clampedY) / scale))) * 180) / Math.PI;

  return { latitude, longitude };
}

function getCity(address: SearchResult['address']) {
  return address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? '';
}

export default function DeliveryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const geocoderLastRequest = useRef(0);
  const [deliveryDetails, setDeliveryDetails] = useState(EMPTY_DETAILS);
  const [draftDetails, setDraftDetails] = useState(EMPTY_DETAILS);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [center, setCenter] = useState<Coordinates | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [savedLocation, setSavedLocation] = useState<MapLocation | null>(null);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const isDirty =
    deliveryDetails.recipient !== draftDetails.recipient ||
    deliveryDetails.phone !== draftDetails.phone ||
    deliveryDetails.address !== draftDetails.address ||
    deliveryDetails.unit !== draftDetails.unit ||
    deliveryDetails.city !== draftDetails.city ||
    deliveryDetails.instructions !== draftDetails.instructions ||
    selectedLocation?.latitude !== savedLocation?.latitude ||
    selectedLocation?.longitude !== savedLocation?.longitude;

  const updateField = (field: keyof DeliveryDetails, value: string) => {
    setDraftDetails((details) => ({ ...details, [field]: value }));
  };

  const waitForGeocoder = async () => {
    const remaining = GEOCODER_MIN_INTERVAL - (Date.now() - geocoderLastRequest.current);
    geocoderLastRequest.current = Date.now() + Math.max(remaining, 0);
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
  };

  const searchLocations = async () => {
    const query = searchText.trim();
    if (!query) {
      setLocationMessage('Enter a street, building, or place to search.');
      return;
    }

    setIsSearching(true);
    setLocationMessage('');
    setSearchResults([]);
    try {
      await waitForGeocoder();
      const params = new URLSearchParams({
        addressdetails: '1',
        format: 'jsonv2',
        limit: '5',
        q: query,
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) {
        throw new Error('Location search is temporarily unavailable. Please try again.');
      }

      const results = (await response.json()) as SearchResult[];
      if (results.length === 0) {
        setLocationMessage('No matching places found. Try a nearby street or landmark.');
        return;
      }
      setSearchResults(results);
    } catch (error) {
      setLocationMessage(
        error instanceof Error ? error.message : 'Location search failed. Please try again.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: SearchResult) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setLocationMessage('That search result could not be placed on the map. Try another result.');
      return;
    }

    const location = {
      latitude,
      longitude,
      name: result.display_name,
    };
    setCenter(location);
    setSelectedLocation(location);
    setSearchText(result.display_name);
    setSearchResults([]);
    setLocationMessage('');
    setDraftDetails((details) => ({
      ...details,
      address: result.display_name,
      city: getCity(result.address) || details.city,
    }));
  };

  const updateMapSelection = async (coordinates: Coordinates) => {
    const location = {
      ...coordinates,
      name: `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`,
    };
    setCenter(coordinates);
    setSelectedLocation(location);
    setLocationMessage('');
    setIsResolvingLocation(true);

    try {
      await waitForGeocoder();
      const params = new URLSearchParams({
        format: 'jsonv2',
        lat: coordinates.latitude.toString(),
        lon: coordinates.longitude.toString(),
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) {
        throw new Error('Could not look up this address. You can enter it manually.');
      }

      const result = (await response.json()) as SearchResult;
      if (result.display_name) {
        setSelectedLocation({ ...location, name: result.display_name });
        setSearchText(result.display_name);
        setDraftDetails((details) => ({
          ...details,
          address: result.display_name,
          city: getCity(result.address) || details.city,
        }));
      }
    } catch (error) {
      setLocationMessage(
        error instanceof Error ? error.message : 'Could not look up this address. You can enter it manually.',
      );
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const chooseMapPoint = (x: number, y: number) => {
    if (!center || !mapSize.width || !mapSize.height || isResolvingLocation) return;

    const worldCenter = coordinatesToWorld(center, MAP_ZOOM);
    const coordinates = worldToCoordinates(
      worldCenter.x + x - mapSize.width / 2,
      worldCenter.y + y - mapSize.height / 2,
      MAP_ZOOM,
    );
    void updateMapSelection(coordinates);
  };

  const useCurrentLocation = async () => {
    setLocationMessage('');
    setSearchResults([]);
    setIsResolvingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setLocationMessage(
          'Location access is off. Allow it in Settings or search for an address instead.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await updateMapSelection({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      setLocationMessage(
        error instanceof Error
          ? error.message
          : 'Could not get your location. Search for an address instead.',
      );
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const saveDeliveryDetails = () => {
    if (
      !draftDetails.recipient.trim() ||
      !draftDetails.phone.trim() ||
      !draftDetails.address.trim() ||
      !draftDetails.city.trim()
    ) {
      Alert.alert(
        'Check your delivery details',
        'Enter a recipient, phone number, street address, and city.',
      );
      return;
    }

    if (!selectedLocation) {
      Alert.alert(
        'Choose a delivery spot',
        'Search for a place, use your current location, or tap the map to place a pin.',
      );
      return;
    }

    const savedDetails: DeliveryDetails = {
      recipient: draftDetails.recipient.trim(),
      phone: draftDetails.phone.trim(),
      address: draftDetails.address.trim(),
      unit: draftDetails.unit.trim(),
      city: draftDetails.city.trim(),
      instructions: draftDetails.instructions.trim(),
    };
    setDeliveryDetails(savedDetails);
    setDraftDetails(savedDetails);
    setSavedLocation(selectedLocation);
    Alert.alert('Delivery details saved', 'Your delivery address has been updated.');
  };

  const worldCenter = center ? coordinatesToWorld(center, MAP_ZOOM) : null;
  const tileCount = 2 ** MAP_ZOOM;
  const tileX = worldCenter ? Math.floor(worldCenter.x / TILE_SIZE) : 0;
  const tileY = worldCenter ? Math.floor(worldCenter.y / TILE_SIZE) : 0;
  const offsetX = worldCenter ? worldCenter.x - tileX * TILE_SIZE : 0;
  const offsetY = worldCenter ? worldCenter.y - tileY * TILE_SIZE : 0;

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="w-full max-w-[800px] flex-1 self-center px-5 pt-3">
          <ScreenHeader fallback="/profile" subtitle="Search or choose a spot on the map" title="Delivery location" />

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View
                className="h-[370px] overflow-hidden rounded-[28px] border border-border bg-[#eef2eb] dark:bg-[#1e2618]"
                onLayout={(event) =>
                  setMapSize({
                    width: event.nativeEvent.layout.width,
                    height: event.nativeEvent.layout.height,
                  })
                }
                onResponderRelease={(event) =>
                  chooseMapPoint(event.nativeEvent.locationX, event.nativeEvent.locationY)
                }
                onStartShouldSetResponder={() => Boolean(center)}>
                {worldCenter ? (
                  <View pointerEvents="none" className="absolute inset-0">
                    {Array.from({ length: 16 }, (_, index) => {
                      const column = (index % 4) - 1;
                      const row = Math.floor(index / 4) - 1;
                      const x = tileX + column;
                      const y = tileY + row;
                      const wrappedX = ((x % tileCount) + tileCount) % tileCount;

                      if (y < 0 || y >= tileCount) return null;

                      return (
                        <Image
                          key={`${MAP_ZOOM}-${wrappedX}-${y}`}
                          fadeDuration={0}
                          source={{
                            uri: `https://tile.openstreetmap.org/${MAP_ZOOM}/${wrappedX}/${y}.png`,
                          }}
                          style={{
                            height: TILE_SIZE,
                            left: mapSize.width / 2 + column * TILE_SIZE - offsetX,
                            position: 'absolute',
                            top: mapSize.height / 2 + row * TILE_SIZE - offsetY,
                            width: TILE_SIZE,
                          }}
                        />
                      );
                    })}
                  </View>
                ) : (
                  <View
                    pointerEvents="none"
                    className="absolute inset-0 items-center justify-center bg-[#eaf1e8] px-12 dark:bg-[#1e2618]">
                    <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-background">
                      <Ionicons color={theme.brandInk} name="map-outline" size={27} />
                    </View>
                    <ThemedText className="text-center text-[15px] font-bold">
                      Find your delivery spot
                    </ThemedText>
                    <ThemedText
                      className="mt-1 text-center text-[12px]"
                      themeColor="textSecondary">
                      Search for an address or use your current location to load the map.
                    </ThemedText>
                  </View>
                )}

                <View className="absolute left-3 right-3 top-3 flex-row items-center gap-2">
                    <View className="h-[50px] flex-1 flex-row items-center rounded-2xl border border-border bg-background px-3 shadow-sm">
                    <Ionicons color={theme.textSecondary} name="search-outline" size={19} />
                    <TextInput
                      accessibilityLabel="Search for a street, building, or place"
                      autoCapitalize="words"
                      className="h-[48px] flex-1 px-2 text-[14px] text-content"
                      onChangeText={(value) => {
                        setSearchText(value);
                        setDraftDetails((details) => ({ ...details, address: value }));
                        setSelectedLocation(null);
                        setSearchResults([]);
                        setLocationMessage('');
                      }}
                      onSubmitEditing={() => void searchLocations()}
                      placeholder="Search street or building"
                      placeholderTextColor={theme.placeholder}
                      returnKeyType="search"
                      value={searchText}
                    />
                    <Pressable
                      accessibilityLabel="Search locations"
                      accessibilityRole="button"
                      className="h-9 w-9 items-center justify-center rounded-xl bg-brand-500"
                      disabled={isSearching || isResolvingLocation}
                      onPress={() => void searchLocations()}>
                      {isSearching ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <Ionicons color="#ffffff" name="arrow-forward" size={18} />
                      )}
                    </Pressable>
                  </View>

                  <Pressable
                    accessibilityLabel="Use my current location"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isResolvingLocation }}
                    className="h-[50px] w-[50px] items-center justify-center rounded-2xl border border-border bg-background shadow-sm"
                    disabled={isResolvingLocation}
                    onPress={() => void useCurrentLocation()}>
                    <Ionicons color={theme.brandInk} name="locate" size={22} />
                  </Pressable>
                </View>

                {searchResults.length > 0 ? (
                  <View className="absolute left-3 right-[68px] top-[61px] overflow-hidden rounded-2xl border border-border bg-background shadow-md">
                    {searchResults.map((result) => (
                      <Pressable
                        accessibilityRole="button"
                        key={result.place_id}
                        className="flex-row items-center gap-2 border-b border-border px-3 py-2.5"
                        onPress={() => selectSearchResult(result)}>
                        <Ionicons color={theme.brandInk} name="location-outline" size={16} />
                        <ThemedText className="flex-1 text-[12px]" numberOfLines={2}>
                          {result.display_name}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                {selectedLocation ? (
                  <View
                    pointerEvents="none"
                    className="absolute self-center"
                    style={{
                      top: mapSize.height / 2 - 38,
                    }}>
                    <Ionicons
                      color={theme.brandInk}
                      name="location"
                      size={42}
                      style={{
                        shadowColor: '#0f172a',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3,
                      }}
                    />
                  </View>
                ) : null}

                <View
                  pointerEvents="none"
                  className="absolute bottom-9 left-3 right-3 flex-row items-center gap-3 rounded-2xl border border-border bg-background/95 px-3.5 py-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-soft">
                    <Ionicons
                      color={theme.brandInk}
                      name={selectedLocation ? 'location' : 'navigate-outline'}
                      size={18}
                    />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-[12px] font-bold" numberOfLines={1}>
                      {selectedLocation?.name ?? 'Your delivery spot'}
                    </ThemedText>
                    <ThemedText className="text-[11px]" themeColor="textSecondary">
                      {isResolvingLocation
                        ? 'Finding this address…'
                        : selectedLocation
                          ? `${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)} · tap map to adjust`
                          : 'Search or use your current location'}
                    </ThemedText>
                  </View>
                  {selectedLocation ? (
                    <Ionicons color={theme.brandInk} name="checkmark-circle" size={21} />
                  ) : null}
                </View>

                <Pressable
                  accessibilityLabel="Open OpenStreetMap attribution"
                  accessibilityRole="link"
                  className="absolute bottom-1 right-2 rounded bg-white/90 px-1.5 py-0.5"
                  onPress={() => {
                    void Linking.openURL('https://www.openstreetmap.org/copyright').catch(() =>
                      Alert.alert('Unable to open link', 'Please visit openstreetmap.org/copyright.'),
                    );
                  }}>
                  <ThemedText className="text-[9px]" themeColor="textSecondary">
                    © OpenStreetMap contributors
                  </ThemedText>
                </Pressable>
              </View>

              <ThemedText className="-mt-3 px-1 text-[11px]" themeColor="textSecondary">
                Address searches and map lookups use OpenStreetMap. Device location is requested
                only when you tap the location button.
              </ThemedText>

              {locationMessage ? (
                <ThemedView
                  type="backgroundElement"
                  className="flex-row items-start gap-2 rounded-2xl border border-[#fcd34d] px-4 py-3 dark:border-[#7c6218]">
                  <Ionicons color="#b45309" name="information-circle-outline" size={18} />
                  <ThemedText className="flex-1 text-[12px]" themeColor="textSecondary">
                    {locationMessage}
                  </ThemedText>
                </ThemedView>
              ) : null}

              <ThemedView
                type="backgroundElement"
                className="rounded-3xl border border-border px-5 py-4">
                <View className="mb-1 gap-0.5">
                  <ThemedText className="text-[15px] font-bold">Who&apos;s receiving it?</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Your courier will use these details at drop-off.
                  </ThemedText>
                </View>
              </ThemedView>

              <DeliverySection
                icon="person-outline"
                subtitle="Who should the courier ask for?"
                title="Contact details">
                  <FormField
                    autoCapitalize="words"
                    label="Recipient name"
                    onChangeText={(value) => updateField('recipient', value)}
                    placeholder="Name at the delivery address"
                    value={draftDetails.recipient}
                  />
                  <FormField
                    keyboardType="phone-pad"
                    label="Phone number"
                    onChangeText={(value) => updateField('phone', value)}
                    placeholder="+971 50 000 0000"
                    value={draftDetails.phone}
                  />
              </DeliverySection>

              <DeliverySection
                icon="navigate-outline"
                subtitle="A precise address helps avoid delays."
                title="Drop-off location">
                  <FormField
                    autoCapitalize="words"
                    label="Apartment, suite, etc. (optional)"
                    onChangeText={(value) => updateField('unit', value)}
                    placeholder="Apartment or unit number"
                    value={draftDetails.unit}
                  />
                  <FormField
                    autoCapitalize="words"
                    label="City"
                    onChangeText={(value) => updateField('city', value)}
                    placeholder="City"
                    value={draftDetails.city}
                  />
              </DeliverySection>

              <DeliverySection
                icon="chatbox-ellipses-outline"
                subtitle="Optional details for the courier."
                title="Drop-off notes">
                  <FormField
                    label="Instructions (optional)"
                    onChangeText={(value) => updateField('instructions', value)}
                    placeholder="Gate code, landmark, or safe place"
                    value={draftDetails.instructions}
                  />
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !isDirty }}
                  className={`mb-1 mt-1 min-h-14 items-center justify-center rounded-xl px-4 py-4 ${
                    isDirty ? 'bg-brand-500' : 'bg-selected'
                  }`}
                  disabled={!isDirty}
                  onPress={saveDeliveryDetails}
                  style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                  <ThemedText
                    className={`text-[16px] font-bold ${isDirty ? 'text-white' : ''}`}
                    themeColor={isDirty ? undefined : 'textSecondary'}>
                    Save delivery details
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ScrollView>

            <View
              className="border-t border-[#eef2f6] bg-background px-1 pt-3"
              style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !isDirty }}
                className={`h-12 flex-row items-center justify-center gap-2 rounded-xl ${
                  isDirty ? 'bg-brand-500' : 'bg-selected'
                }`}
                disabled={!isDirty}
                onPress={saveDeliveryDetails}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <Ionicons
                  name={isDirty ? 'checkmark-circle-outline' : 'checkmark-circle'}
                  size={19}
                  color={isDirty ? '#ffffff' : '#64748b'}
                />
                <ThemedText
                  className={`font-semibold ${isDirty ? 'text-white' : ''}`}
                  themeColor={isDirty ? undefined : 'textSecondary'}>
                  {isDirty ? 'Save delivery details' : 'No changes to save'}
                </ThemedText>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
