export type ControllerResponse<T = {} | [] | any> = {
  success: boolean;
  data?: T;
  status: number;
  message: string;
};

export type TAdmin = {
  fullName: string;
  email: string;
  phone: string;
  image?: string;
  password: string;
  isActive?: boolean;
  role: "manager" | "super";
  createdAt: string;
};
