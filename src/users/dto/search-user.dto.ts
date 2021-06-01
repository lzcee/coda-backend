export class SearchUserDto {
  name: string;
  email: string;
  area?: string;
  programmingLanguage?: string[];
  softwares?: string[];
  limit: number;
}
