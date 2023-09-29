import { User as FirebaseUser } from 'firebase/auth';
// import { UserMetadata } from 'aws-sdk/clients/elastictranscoder';

export type UserTypes = 'responder' | 'investigator' | 'admin' | 'user';
export type AgencySpecialties = 'fire' | 'police' | 'ems' | 'clinical' | 'admin' | 'test' | 'care' | 'gov' | 'biz' | 'event' | 'unknown' | 'historical' | 'systems' | 'other';

// TODO: this is an example of how this type might look
export interface Agency {
  name: string;
  capacity: number;
  max_capacity?: number;
  specialty: AgencySpecialties;
  description?: string;
  url?: string;
  deleted: boolean;
  external_id?: string;
  users?: any[];
  jurisdictions?: any[];
}

export interface User extends FirebaseUser {
  deleted?: boolean;
  radar_user_id?: string;
  device_id?: string;
  description?: string;
  uid: string;
  // email: string;
  // email_verified?: boolean;
  // is_anonymous?: boolean;
  // display_name?: string;
  // metadata: UserMetadata;
  // phone_number?: string;
  // photo_url?: string;
  // provider_data?: any[];
  // provider_id?: string;
  // refresh_token?: string;
  // type?: UserTypes;
  // encrypted_password?: string;
  // tokens?: Record<string, unknown>;
  // agency?: Agency;
}
