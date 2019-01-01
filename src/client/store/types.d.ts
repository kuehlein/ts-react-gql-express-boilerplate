import { StateType } from "typesafe-actions";
// import { RouterAction, LocationChangeAction } from 'react-router-redux';
// type ReactRouterAction = RouterAction | LocationChangeAction;
import { IUserAction } from "./user";
import { rootReducer } from "./";

// declare module "Types" {
export type RootState = StateType<typeof rootReducer>;
export type RootAction = IUserAction; // | IAnotherAction...
// }
