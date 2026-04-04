import React from "react";
import { TravelItinerary, TravelItinerarySpec } from "./TravelItinerary";

const BASE_SPEC: TravelItinerarySpec = {
  trip_title: "5 Days in Japan",
  destination: "Tokyo → Kyoto → Osaka",
  duration: "5 days",
  days: [
    { day_number: 1, location: "Tokyo", activities: ["Shibuya Crossing", "Meiji Shrine", "Harajuku"], highlight: "Explore the electric energy of Shibuya" },
    { day_number: 2, location: "Tokyo", activities: ["Tsukiji Market", "Akihabara", "Senso-ji"], highlight: "Morning sushi at Tsukiji outer market" },
    { day_number: 3, location: "Kyoto", activities: ["Fushimi Inari", "Arashiyama", "Tea Ceremony"], highlight: "Walk through 10,000 torii gates" },
    { day_number: 4, location: "Kyoto", activities: ["Kinkaku-ji", "Nishiki Market", "Gion"], highlight: "Golden Pavilion at sunset" },
    { day_number: 5, location: "Osaka", activities: ["Dotonbori", "Osaka Castle", "Street Food Tour"], highlight: "Takoyaki and okonomiyaki crawl" },
  ],
  total_stops: 15,
  summary: "A whirlwind tour through Japan's cultural heartland",
};

export const TravelItineraryDayByDayWarm: React.FC = () => <TravelItinerary spec={{ ...BASE_SPEC, layout: "day-by-day", theme: "warm" }} />;
export const TravelItineraryDayByDayBold: React.FC = () => <TravelItinerary spec={{ ...BASE_SPEC, layout: "day-by-day", theme: "bold" }} />;
export const TravelItineraryRouteOverviewWarm: React.FC = () => <TravelItinerary spec={{ ...BASE_SPEC, layout: "route-overview", theme: "warm" }} />;
export const TravelItineraryRouteOverviewBold: React.FC = () => <TravelItinerary spec={{ ...BASE_SPEC, layout: "route-overview", theme: "bold" }} />;
export const TravelItineraryHighlightsWarm: React.FC = () => <TravelItinerary spec={{ ...BASE_SPEC, layout: "highlights", theme: "warm" }} />;
export const TravelItineraryHighlightsBold: React.FC = () => <TravelItinerary spec={{ ...BASE_SPEC, layout: "highlights", theme: "bold" }} />;
