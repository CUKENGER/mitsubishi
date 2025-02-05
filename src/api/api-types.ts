type tTypeMethod =
  | 'getVehicle'
  | 'getMainGroup'
  | 'getNodes'
  | 'getNode'
  | 'getImage'
  | 'getVehicleId';

export type tQData = {
  method: tTypeMethod;
  vehicleId?: string;
  vin?: string;
  data?: any;
};

export type tTableHeader = {
  id: string;
  value: string;
};
export type tTableData = {
  value: string;
  number?: string;
  name?: string;
  flagNotTranslate?: boolean;
};
type tTableItem = {
  [key: string]: tTableData;
};
export type tTable = {
  header: tTableHeader[];
  // data: tTableItem[];
  data: Array<{ code: string; name: string }>;
  flag_hide_header?: boolean;
  title?: string;
  q?: string;
};

export type tAttributesMain = {
  label: string;
  value: string | number;
  id: string;
};
export type tVehicle = {
  vin: string;
  vehicleId: string;
  name: string;
  nameFull: string;
  nameShort: string;
  modelName: string;
  qMainGroup: string;
  brandId: string;
  brandName: string;
  attributesMain: tAttributesMain[];
  attributesAdv: tTable[];
};

export type tNodePart = {
  hotspotId: string;
  number: string;
  name: string;
  note?: string;
  qty?: string;
};

export type tNodeHotspot = {
  hotspotId: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

export type tNodeImages = {
  qImage: string;
  width?: number;
  height?: number;
};

export type tNode = {
  name: string;
  title?: string;
  code?: string;
  note?: string;
  parts: tNodePart[];
  hotspots: tNodeHotspot[];
  images: tNodeImages[];
  image_index?: number;
  qGroup: string;
};

export type tListItem = {
  title: string;
  code?: string;
  q: string;
};

export type tResult = {
  resultCode: number;
  vehicle?: tVehicle;
  lists?: tListItem[];
  node?: tNode;
};

export interface iQService {
  run(qData: any): Promise<tResult>;
}

