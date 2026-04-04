import React from "react";
import { EventVenue, EventVenueSpec } from "./EventVenue";

const BASE_SPEC: EventVenueSpec = {
  event_name: "PinBoard Maps Dev Summit 2026",
  event_date: "March 15, 2026",
  venues: [
    { venue_name: "Main Hall", address: "Museumsplatz 1, 1070 Wien", capacity: 500, venue_type: "Keynote", time_slot: "9:00 AM" },
    { venue_name: "Workshop Room A", address: "Museumsplatz 1, 1070 Wien", capacity: 60, venue_type: "Workshop", time_slot: "11:00 AM" },
    { venue_name: "Workshop Room B", address: "Museumsplatz 1, 1070 Wien", capacity: 40, venue_type: "Workshop", time_slot: "2:00 PM" },
    { venue_name: "Networking Lounge", address: "Museumsplatz 1, 1070 Wien", capacity: 150, venue_type: "Social", time_slot: "5:00 PM" },
  ],
  total_attendees: 420,
  total_venues: 4,
  event_description: "Annual developer summit for the PinBoard Maps community",
};

export const EventVenueScheduleMapDark: React.FC = () => <EventVenue spec={{ ...BASE_SPEC, layout: "schedule-map", theme: "dark" }} />;
export const EventVenueScheduleMapBold: React.FC = () => <EventVenue spec={{ ...BASE_SPEC, layout: "schedule-map", theme: "bold" }} />;
export const EventVenueVenueCardsDark: React.FC = () => <EventVenue spec={{ ...BASE_SPEC, layout: "venue-cards", theme: "dark" }} />;
export const EventVenueVenueCardsBold: React.FC = () => <EventVenue spec={{ ...BASE_SPEC, layout: "venue-cards", theme: "bold" }} />;
export const EventVenueEventOverviewDark: React.FC = () => <EventVenue spec={{ ...BASE_SPEC, layout: "event-overview", theme: "dark" }} />;
export const EventVenueEventOverviewBold: React.FC = () => <EventVenue spec={{ ...BASE_SPEC, layout: "event-overview", theme: "bold" }} />;
