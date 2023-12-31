
export type User = {
  id: string;
  firstName: string;
  age: number;
  companyId: string;
  company: Company;
}

export type Company = {
  id: string;
  name: string;
  description: string;
  users: User[];
}
