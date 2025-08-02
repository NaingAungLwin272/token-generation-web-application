export interface UserResponse {
  id: number;
  name: string;
  phoneNumber: string;
  companyName: string;
  designation: string;
  token: string;
}

export interface UserRequestPayload {
  name: string;
  phoneNumber: string;
  companyName: string;
  designation: string;
  token: string;
}
