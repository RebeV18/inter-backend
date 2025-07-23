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
  name: string;
  continents: string[];
  flags: string[];
  coat_of_arms?: string;
  capital: string;
  geopoint: { latitude: number; longitude: number };
  geographical_division: string;
  physical_map?: string;
  political_map?: string;
  government?: string;
  area?: number;
  principal_cities?: string;
  hills?: string[];
  volcanoes?: string[];
  entry_points?: string[];
  population?: string;
  religions?: string;
}

export interface Mission {
  id: string;
  country: string;
  cities: City[];
  map?: string;
  post?: string;
}

export interface City {
  order: number;
  place: string;
  map: string;
  photo: string;
}

export interface PrayerRequest {
  id: string;
  requester?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
