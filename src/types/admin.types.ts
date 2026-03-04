import { Property } from './property.types';

export interface PropertyWithVisibility extends Property {
  visible: boolean;
}
