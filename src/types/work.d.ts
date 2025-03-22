interface Sources {
  sm?: string[];
  md?: string[];
  lg?: string[];
}

export interface WorkData {
  type: string;
  client: string;
  campaign?: string;
  displayType: string;
  src: string | Sources;
  origin?: string;
  width: string | number;
  height: string | number;
}
