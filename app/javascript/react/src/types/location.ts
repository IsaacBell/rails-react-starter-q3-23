export type Position = Record<'latitude' | 'longitude' | 'altitude', number>;

export interface Geometry {
  coordinates: string[];
}

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface OSMTag {
  [key: string]: string;
}

export interface OSMNode {
  id: string | number;
  name?: string | null;
  lat: number;
  lon: number;
  tags?: OSMTag;
  type?: 'node' | null;
}

export interface OSMGeoLocDetails {
  place_id?: number;
  osm_type: string;
  osm_id: number;
  place_rank?: number;
  category: string;
  type: string;
  importance?: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    highway?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    county?: string;
    city?: string;
    state?: string;
    ISO3166_2_lvl4?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

export interface OSMGeoLoc {
  properties: OSMGeoLocDetails;
  bbox: number[];
  geometry: Geometry;
}

export interface Coords {
  latitude: number;
  longitude: number;
  altitude: number | null;
}

export interface Location {
  id: string;
  lat: number;
  lon: number;
  name?: string;
}
