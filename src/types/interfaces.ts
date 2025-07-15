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
  hills?: string;
  doors?: string;
  dangerous_places?: string;
  population?: string;
  religions?: string;
}

export interface PrayerRequest {
  id: string;
  requester?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
