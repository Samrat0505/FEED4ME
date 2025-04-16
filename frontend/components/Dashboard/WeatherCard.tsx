import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { MapPin, RefreshCw } from "lucide-react-native";
import LucidIcons from "~/lib/LucidIcons";

const Weather = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const apiKey = process.env.WEATHER_API_KEY;
  const apiKey = `FBe5qo4TIIRo8UihfsBguNkhTiRzeNLa`;

  const storageKey = "weatherData";

  useEffect(() => {
    loadCachedWeather();
  }, []);

  const loadCachedWeather = async () => {
    try {
      const cached = await AsyncStorage.getItem(storageKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          setCurrent(data.current);
          setForecast(data.forecast);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Cache load error:", err);
    }
    fetchWeather();
  };

  const fetchWeather = async () => {
    setLoading(true);
    const data = await getAccuWeatherData(latitude, longitude);
    if (data) {
      setCurrent(data.current);
      setForecast(data.forecast);
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } else {
      ToastAndroid.show("Failed to fetch weather", ToastAndroid.LONG);
    }
    setLoading(false);
  };

  const getAccuWeatherData = async (latitude: number, longitude: number) => {
    try {
      const locationRes = await axios.get(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search`,
        {
          params: {
            apikey: apiKey,
            q: `${latitude},${longitude}`,
          },
        }
      );

      const locationKey = locationRes.data.Key;
      const cityName = locationRes.data.LocalizedName;

      const currentRes = await axios.get(
        `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,
        {
          params: {
            apikey: apiKey,
          },
        }
      );

      const forecastRes = await axios.get(
        `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}`,
        {
          params: {
            apikey: apiKey,
            metric: true,
          },
        }
      );

      const current = {
        ...currentRes.data[0],
        name: cityName,
      };

      return {
        current,
        forecast: forecastRes.data,
      };
    } catch (error) {
      console.error("AccuWeather API error:", error);
      return null;
    }
  };

  const WeatherSkeleton = () => (
    <View className="border border-muted p-3 rounded-xl m-2 mx-5 bg-white space-y-4 gap-4">
      <View className="flex-row justify-between items-center">
        <View className="h-4 w-32 bg-gray-300 rounded-full" />
        <View className="h-4 w-6 bg-gray-300 rounded-full" />
      </View>

      <View className="h-4 w-24 bg-gray-200 rounded-full" />

      <View className="flex flex-row justify-between items-start">
        <View className="space-y-2 gap-2">
          <View className="h-10 w-20 bg-gray-300 rounded-lg" />
          <View className="h-6 w-10 bg-gray-300 rounded-lg" />
        </View>
        <View className="h-12 w-12 bg-gray-300 rounded-full" />
      </View>

      <View className="h-4 w-32 bg-gray-200 rounded-full" />

      <ScrollView horizontal contentContainerStyle={{ gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} className="bg-gray-200 p-3 rounded-xl items-center">
            <View className="h-10 w-10 bg-gray-300 rounded-full mb-2" />
            <View className="h-4 w-12 bg-gray-300 rounded-full mb-1" />
            <View className="h-4 w-8 bg-gray-300 rounded-full" />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) return <WeatherSkeleton />;

  if (!current || !forecast) return null;

  return (
    <View className="border border-muted p-3 rounded-xl m-2 mx-5 bg-white">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <LucidIcons IconName={MapPin} />
          <Text>{current.name}</Text>
        </View>
        <TouchableOpacity onPress={fetchWeather}>
          <LucidIcons IconName={RefreshCw} />
        </TouchableOpacity>
      </View>

      <Text className="p-2 text-muted-foreground text-sm">
        Today {format(new Date(), "dd MMM yyyy")}
      </Text>

      <View className="flex flex-row justify-between items-start flex-wrap">
        <View className="flex flex-row items-center p-2 gap-2">
          <Text className="text-7xl font-semibold">
            {Math.round(current.Temperature.Metric.Value)}
          </Text>
          <Text className="text-xl">°C</Text>
        </View>
        <View className="flex flex-row items-center gap-2 px-2">
          <Image
            source={{
              uri: `https://developer.accuweather.com/sites/default/files/${current.WeatherIcon.toString().padStart(
                2,
                "0"
              )}-s.png`,
            }}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
          <Text>{current.WeatherText}</Text>
        </View>
      </View>

      <Text className="pb-2 font-semibold">Hourly Forecast</Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
      >
        {forecast.map((hour: any, index: number) => (
          <View key={index} className="items-center rounded-xl bg-slate-50 p-2">
            <Image
              source={{
                uri: `https://developer.accuweather.com/sites/default/files/${hour.WeatherIcon.toString().padStart(
                  2,
                  "0"
                )}-s.png`,
              }}
              style={{ width: 40, height: 40 }}
            />
            <Text className="text-sm">
              {format(new Date(hour.DateTime), "h a")}
            </Text>
            <Text className="text-lg">
              {Math.round(hour.Temperature.Value)}°
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Weather;
