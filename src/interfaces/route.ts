/**
 * Gamer One API Documentation
 * Welcome to the Official Gamer One API documentation.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: developer@gamerone.gg
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { User } from './user';

export type RouteContentType = 'user' | 'club';

export enum RouteContentTypeEnum {
  User = 'user',
  Club = 'club',
}

export interface Route {
  contentId?: number;
  contentType?: RouteContentType;
  slug?: string;
  content?: User;
}