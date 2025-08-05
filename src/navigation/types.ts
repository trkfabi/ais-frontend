export type DrawerParamList = {
  "Vessels Map": undefined;
  Settings: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  BillingHistory: undefined;
};

export type ParamListBase = Record<string, object | undefined>;

export type RouteProp<T extends ParamListBase, K extends keyof T> = {
  key: string;
  name: K;
  params?: T[K];
  state?: any;
};
