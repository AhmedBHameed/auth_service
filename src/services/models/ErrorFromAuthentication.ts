export interface ErrorFromAuthentication {
  errors?: [
    {
      errorCode: string;
      message: string;
      statusCode: number;
    }
  ];
}
