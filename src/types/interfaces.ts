import { GeoPoint } from 'firebase-admin/firestore';

export interface TopicElement {
  id: string;
  text: string;
  pic: string;
}

export interface Topic {
  id: string;
  theme: string;
  elements: TopicElement[];
}

export interface Country {
  id: string;
  custID: number;
  name: string;
  continents: string[];
  capital?: string;
  population?: number;
  flags?: string[];
  coat_of_arms?: string;
  government: string;
  hills: string;
  geographical_division: string;
  geopoint: GeoPoint;
  physical_map: string;
  political_map: string;
  principal_cities: string;
  religions: string;
}

export interface PrayerRequest {
  id: string;
  requester?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
